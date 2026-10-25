import test from 'node:test';
import assert from 'node:assert/strict';
import { checkTagMatchesVersion, classifyNpmView } from './check_publish_version.mjs';

const e404 = '{"error":{"code":"E404","summary":"not found"}}';
const pkg = { name: '@entire-vc/tokens', version: '0.2.0' };

test('matching tag passes', () => assert.equal(checkTagMatchesVersion('v0.2.0', pkg), null));
test('mismatching tag fails', () => assert.match(checkTagMatchesVersion('v0.1.2', pkg), /does not match/));
test('tag without v prefix fails', () => assert.ok(checkTagMatchesVersion('0.2.0', pkg)));
test('existing version is published', () => assert.equal(classifyNpmView({ status: 0, stdout: '0.2.0', stderr: '' }), 'published'));
test('E404 is absent', () => assert.equal(classifyNpmView({ status: 1, stdout: '{"error":{"code":"E404","summary":"not found"}}', stderr: '' }), 'absent'));
test('generic 404 text without the E404 code is not absent', () => assert.equal(classifyNpmView({ status: 1, stdout: '', stderr: '404 Not Found - proxy' }), 'error'));
test('E404 text in stderr without the structured code is not absent', () => assert.equal(classifyNpmView({ status: 1, stdout: '', stderr: 'npm error code E404 via proxy ECONNRESET' }), 'error'));
test('network error is not absent', () => assert.equal(classifyNpmView({ status: 1, stdout: '', stderr: 'npm error code ECONNRESET' }), 'error'));

// End-to-end: run the script itself and check the exit status. `npm` is replaced
// by a stub on PATH so the registry answer is controlled and no network is used.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, 'check_publish_version.mjs');

function run(tag, npmBody) {
  const dir = mkdtempSync(join(tmpdir(), 'publish-guard-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg));
  const bin = join(dir, 'npm');
  writeFileSync(bin, `#!/bin/sh\n${npmBody}\n`);
  chmodSync(bin, 0o755);
  return spawnSync(process.execPath, [script, tag, dir], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}` },
  });
}

test('script exits 1 on tag/version mismatch', () => {
  const r = run('v9.9.9', 'exit 1');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /does not match/);
});
test('script exits 1 when the version is already published', () => {
  const r = run('v0.2.0', 'echo 0.2.0');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /already published/);
});
test('script exits 1 on a registry error that is not E404', () => {
  const r = run('v0.2.0', 'echo "npm error code ECONNRESET" >&2; exit 1');
  assert.equal(r.status, 1);
});
test('script exits 0 only when the registry says E404', () => {
  const r = run('v0.2.0', `echo '${e404}'; exit 1`);
  assert.equal(r.status, 0);
});
test('script exits 2 without arguments', () => {
  assert.equal(spawnSync(process.execPath, [script], { encoding: 'utf8' }).status, 2);
});
