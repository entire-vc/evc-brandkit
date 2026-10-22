import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Consume pnpm audit's JSON, including its nonzero vulnerability result.
// Network errors and schema drift must fail rather than look like a clean audit.
const audit = JSON.parse(readFileSync(process.argv[2], 'utf8'));
assert(audit.advisories && typeof audit.advisories === 'object' && !Array.isArray(audit.advisories), 'Missing advisories');
assert(Number.isInteger(audit.metadata?.totalDependencies) && audit.metadata.totalDependencies > 0, 'Missing dependency inventory');
const severities = ['info', 'low', 'moderate', 'high', 'critical'];
const summary = audit.metadata.vulnerabilities;
assert(summary && typeof summary === 'object' && !Array.isArray(summary), 'Missing vulnerability summary');
const counts = Object.fromEntries(severities.map(severity => [severity, 0]));
for (const advisory of Object.values(audit.advisories)) {
  assert(advisory && typeof advisory === 'object' && !Array.isArray(advisory), 'Invalid advisory');
  assert(severities.includes(advisory.severity), 'Invalid advisory severity');
  counts[advisory.severity]++;
}
for (const severity of severities) {
  assert(Number.isInteger(summary[severity]) && summary[severity] >= 0, `Invalid ${severity} count`);
  assert.equal(summary[severity], counts[severity], `Contradictory ${severity} count`);
}
const fixed = new Set(['GHSA-587h-7wmj-h5pm', 'GHSA-f2ph-cmg5-wxc8']);
for (const advisory of Object.values(audit.advisories)) {
  assert(typeof advisory.github_advisory_id === 'string', 'Missing advisory identity');
  assert(!fixed.has(advisory.github_advisory_id), `Unresolved: ${advisory.github_advisory_id}`);
  if (advisory.github_advisory_id === 'GHSA-vfj7-8cjw-p6xm') {
    // No published patch as of 2026-10-22. Do not silently retain this exception
    // after the registry starts reporting a patched version.
    assert.equal(advisory.patched_versions, '<0.0.0', 'braces now has a patch: update it');
    console.log('UNRESOLVED: braces GHSA-vfj7-8cjw-p6xm; no published patch');
  } else {
    console.log(`OTHER: ${advisory.github_advisory_id} ${advisory.module_name} ${advisory.severity}`);
  }
}
console.log('PASS: Vite and Storybook target advisories absent');
