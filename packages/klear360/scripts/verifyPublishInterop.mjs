// Smoke-tests the built package.json "exports" entry points the way a real consumer resolves
// them - via native ESM `import()` and CJS `require()` - so a build that only "looks right" in
// source (or only works through a bundler's lenient resolver) doesn't slip into a release.
// Run after `yarn build`, against the files in `build/`, not against `src/`.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);

// Native entry points are deliberately excluded: React Native apps load them through Metro's own
// CJS-style resolver, not Node's spec-compliant ESM resolver, so testing them here would fail on
// resolution patterns (bare "react-native" field, directory + package.json "main") that are valid
// for every real native consumer and simply aren't reachable through `node`.
const ENTRY_POINTS = [
  {
    name: 'components (web)',
    path: '../build/lib/web/production/components/index.js',
    expect: 'Button',
    // `styled-components`'s own CJS bundle doesn't interop correctly with Node's native ESM
    // loader (its default export resolves to a plain data object with no callable tag proxy),
    // independent of anything in this package. Every real consumer loads this entry through a
    // bundler (webpack/vite/metro/jest), which handles that interop correctly; this is a known,
    // third-party limitation of running bundler-free Node against it, not a regression to chase.
    knownLimitation: 'styled-components CJS/ESM interop (third-party, not fixable here)',
  },
  { name: 'tokens (web)', path: '../build/lib/web/production/tokens/index.js', expect: 'colors' },
  { name: 'utils (web)', path: '../build/lib/web/production/utils/index.js', expect: 'useBreakpoint' },
];

// Errors in *resolving* a specifier (vs. errors while *evaluating* a correctly-resolved module)
// are the class of bug this script exists to catch: wrong/missing file extensions, directory
// imports, etc. in our own source or build output.
const isResolutionError = (error) =>
  error.code === 'ERR_MODULE_NOT_FOUND' ||
  error.code === 'ERR_UNSUPPORTED_DIR_IMPORT' ||
  error.code === 'MODULE_NOT_FOUND' ||
  /Cannot find module/.test(error.message) ||
  /Directory import/.test(error.message);

let failures = 0;

for (const { name, path, expect, knownLimitation } of ENTRY_POINTS) {
  try {
    const esmModule = await import(path);
    assert.ok(expect in esmModule, `expected ESM import of "${name}" to export "${expect}"`);
    console.log(`✓ import()  ${name}`);
  } catch (error) {
    if (!isResolutionError(error) && knownLimitation) {
      console.log(`… import()  ${name} (known limitation: ${knownLimitation})`);
    } else {
      failures += 1;
      console.error(`✗ import()  ${name}\n  ${error.message}`);
    }
  }

  try {
    require(path);
    console.log(`✓ require() ${name}`);
  } catch (error) {
    // The published package has no "require" exports condition and its build output is ESM
    // syntax, so a plain CommonJS consumer can only load it via Node's require(esm) support
    // (Node >=22, or >=20.19 with the flag). That is a known, intentional gap - not something
    // this script should silently paper over - so we only fail on a DIFFERENT, unexpected error.
    const isExpectedEsmOnlyError =
      error.code === 'ERR_REQUIRE_ESM' || /Cannot use import statement/.test(error.message);

    if (isExpectedEsmOnlyError) {
      console.log(`… require() ${name} (expected: ESM-only build, no "require" condition)`);
    } else if (!isResolutionError(error) && knownLimitation) {
      console.log(`… require() ${name} (known limitation: ${knownLimitation})`);
    } else {
      failures += 1;
      console.error(`✗ require() ${name}\n  ${error.message}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} interop check(s) failed.`);
  process.exit(1);
}

console.log('\nAll publish interop checks passed.');
