import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

// Fixtures represent the external npm audit response, including registry errors.
function check(advisories, metadata) {
  const vulnerabilities = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
  for (const advisory of Object.values(advisories ?? {})) {
    if (advisory && typeof advisory === 'object') {
      advisory.severity ??= 'high';
      vulnerabilities[advisory.severity]++;
    }
  }
  metadata ??= { totalDependencies: 1, vulnerabilities };
  const dir = mkdtempSync(join(tmpdir(), 'security-audit-'));
  try {
    const path = join(dir, 'audit.json');
    writeFileSync(path, JSON.stringify({ advisories, metadata }));
    return spawnSync(process.execPath, [new URL('./check_security_audit.mjs', import.meta.url).pathname, path], { encoding: 'utf8' });
  } finally {
    rmSync(dir, { recursive: true });
  }
}

test('clean inventory passes', () => {
  const result = check({});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS/);
});
for (const id of ['GHSA-587h-7wmj-h5pm', 'GHSA-f2ph-cmg5-wxc8']) {
  test(`rejects ${id}`, () => {
    const result = check({ 1: { github_advisory_id: id } });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unresolved:/);
  });
}
test('unpatched braces stays explicitly unresolved', () => {
  const result = check({ 1: { github_advisory_id: 'GHSA-vfj7-8cjw-p6xm', patched_versions: '<0.0.0' } });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /UNRESOLVED: braces/);
});
test('braces exception expires when a patch is reported', () => {
  assert.equal(check({ 1: { github_advisory_id: 'GHSA-vfj7-8cjw-p6xm', patched_versions: '>=3.0.4' } }).status, 1);
});
test('missing registry data fails closed', () => {
  assert.equal(check(null).status, 1);
  assert.equal(check({ error: 'network failure' }).status, 1);
  assert.equal(check({}, {}).status, 1);
});

test('contradictory vulnerability summary fails closed', () => {
  assert.equal(check({}, { totalDependencies: 1, vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 1 } }).status, 1);
});

test('nonempty advisories cannot be hidden by a zero summary', () => {
  assert.equal(check({ 1: { github_advisory_id: 'GHSA-vfj7-8cjw-p6xm', patched_versions: '<0.0.0' } }, { totalDependencies: 1, vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 } }).status, 1);
});
test('invalid summary counts and missing severities fail closed', () => {
  for (const high of [-1, 0.5, '0', null]) {
    assert.equal(check({}, { totalDependencies: 1, vulnerabilities: { info: 0, low: 0, moderate: 0, high, critical: 0 } }).status, 1);
  }
  assert.equal(check({}, { totalDependencies: 1, vulnerabilities: {} }).status, 1);
});
