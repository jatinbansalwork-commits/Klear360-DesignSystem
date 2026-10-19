# Package build output

This covers `@klear/klear360` as a whole: what module format(s) it ships, and why.

## ESM-only: intentional

`@klear/klear360` publishes ESM only (`rollup.config.mjs`'s `getWebConfig`/`getNativeConfig` both emit `format: 'es'`; the package's `exports` map has no `"require"` condition). This is a deliberate decision, not an oversight, revisited most recently as part of the P3 "CJS dual-package support" remediation item (see `scripts/verifyPublishInterop.mjs`, which asserts `require()` fails with the expected `ERR_REQUIRE_ESM`/"Cannot use import statement" shape rather than silently treating it as a pass).

### Why a real CJS build isn't being pursued

Rollup can already emit a CJS bundle trivially — `getKlear360CoverageConfig` in `rollup.config.mjs` does exactly that for `utils/klear360Coverage.ts` (format: `'cjs'`, same plugin pipeline) because Playwright's coverage API needs it. So producing a second, CJS, build target for `components`/`tokens`/`utils` is mechanically easy.

The blocker is downstream, not in this package's own build. Like most of this package's dependencies, `klear360` leaves its `dependencies` external at build time (`externalDependencies` in `rollup.config.mjs`, via `rollup-plugin-peer-deps-external` + `depsExternalPlugin`) rather than bundling them — standard practice for a library, but it means a CJS build of klear360 would still contain bare `require('some-dependency')` calls for every dependency. Several dependencies that are reachable from the public entry points are themselves **ESM-only with no CommonJS entry at all** (`"type": "module"`, no `main`, no `require` condition in `exports`):

- `@table-library/react-table-library` (used by `Table`)
- `react-markdown` and its transitive dependency `unist-util-visit-parents` (used by `MessageViewer`/Klear AI UI)
- `@formatjs/intl-displaynames`, `@formatjs/intl-locale` (used by the i18n utilities)

A CJS build of klear360 calling `require('@table-library/react-table-library')` fails immediately with `ERR_REQUIRE_ESM` regardless of what format *our own* code is compiled to — these packages ship no CJS artifact to require. The same deep-import-style resolution is also used by bundlers (webpack <5, Metro, older Jest configs) that don't yet support Node's `require(esm)` interop, so a nominal "dual-package" build would still break for a meaningful slice of real `require()` consumers the moment they touch `Table` or `MessageViewer`.

Dual-publishing a CJS entry point that works for some import paths and throws for others is worse than being honestly ESM-only: it would pass naive smoke tests (`require('@klear/klear360/tokens')` works fine, since `tokens` has no ESM-only deps) while failing unpredictably for consumers depending on which component tree got pulled in. That's a worse support/debugging story than today's single, consistent "this package is ESM" message.

### What a CJS-only consumer should do instead

- Prefer importing via a bundler (webpack 5+, Vite, Metro, Jest with ESM support) — all of these already resolve klear360's `exports` map correctly and are what every existing consumer uses.
- If stuck in a plain Node CommonJS script, use a dynamic `const klear360 = await import('@klear/klear360/components')` instead of `require()`. This works today in any Node version that can run klear360's own peer deps (React 18+, Node >=22 per this package's `engines` field).
- Node's native `require(esm)` support (stable from Node 22/23 onward) will transparently handle klear360's own ESM output in `require()` once the *dependency* ecosystem above also drops CJS entry points or Node's interop subsumes it — this is intentionally left as "works where the whole chain is Node and new enough" rather than something klear360 needs to special-case.

### Re-evaluate when

- `@table-library/react-table-library`, `react-markdown`/`unist-util-visit-parents`, or the `@formatjs/intl-*` packages ship a CJS build or dual ESM+CJS `exports`, **or**
- These dependencies are replaced/removed, **or**
- Node's `require(esm)` interop becomes the de facto standard across the bundlers this package's consumers actually use (webpack, Metro, Jest), not just plain Node.

Until then, `verify:interop`'s CJS checks are expected to report the "known limitation"/"expected: ESM-only build" outcomes, not failures.
