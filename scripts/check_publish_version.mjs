// Pre-publish guard for the publish-npm CI job.
//   node scripts/check_publish_version.mjs <tag> <package-dir>
// Fails (exit 1) when the tag does not match the package version, or when that
// version already exists on the public registry. Only the structured E404 code from `npm view`
// counts as "not published yet"; any other registry error also fails, so a
// network problem can never look like a free version.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function checkTagMatchesVersion(tag, pkg) {
  const expected = `v${pkg.version}`;
  if (tag !== expected) {
    return `tag ${tag} does not match ${pkg.name} version ${pkg.version} (expected tag ${expected})`;
  }
  return null;
}

export function classifyNpmView(result) {
  if (result.status === 0) return 'published';
  // `npm view --json` prints {"error":{"code":"E404",...}} on stdout; trust the
  // structured code only, never a substring of free text.
  try {
    return JSON.parse(result.stdout).error?.code === 'E404' ? 'absent' : 'error';
  } catch {
    return 'error';
  }
}

function main() {
  const [tag, dir] = process.argv.slice(2);
  if (!tag || !dir) {
    console.error('usage: check_publish_version.mjs <tag> <package-dir>');
    process.exit(2);
  }
  const pkg = JSON.parse(readFileSync(`${dir}/package.json`, 'utf8'));
  const mismatch = checkTagMatchesVersion(tag, pkg);
  if (mismatch) {
    console.error(`FAIL: ${mismatch}`);
    process.exit(1);
  }
  const spec = `${pkg.name}@${pkg.version}`;
  const view = spawnSync('npm', ['view', spec, 'version', '--json', '--registry', 'https://registry.npmjs.org/'], { encoding: 'utf8' });
  const state = classifyNpmView(view);
  if (state !== 'absent') {
    console.error(`FAIL: ${spec} is ${state === 'published' ? 'already published' : 'not checkable'}: ${view.stderr.trim()}`);
    process.exit(1);
  }
  console.log(`OK: ${spec} matches tag ${tag} and is not on the registry yet`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
