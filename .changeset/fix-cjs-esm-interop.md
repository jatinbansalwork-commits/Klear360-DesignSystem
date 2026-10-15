---
"@klear/klear360": patch
---

fix: resolve extensionless deep imports that break under strict ESM resolution

Added a CJS/ESM interop smoke test (`yarn workspace @klear/klear360 verify:interop`) that loads
the published web entry points (`components`, `tokens`, `utils`) the way a real consumer resolves
them - via native `import()`/`require()` - rather than through a bundler's lenient resolver.

It caught two real bugs, both extensionless deep imports that Node's strict ESM resolver treats as
an unsupported directory import instead of the intended sibling file:

- `dayjs/plugin/customParseFormat`, `dayjs/plugin/timezone`, `dayjs/plugin/utc` in the DatePicker
- `@table-library/react-table-library/{table,virtualized,theme,sort,pagination,select,tree}` in Table

Both are fixed by adding the explicit `.js` extension. Since this project's `moduleResolution`
("node") doesn't rewrite a `.js` specifier to its `.d.ts` counterpart the way `bundler`/`node16`
would, added a small ambient module shim (`src/@types/tableLibrary.d.ts`) re-exporting each
`@table-library/react-table-library/*.js` specifier's types from its already-typed extensionless
counterpart.

The smoke test also surfaced (and explicitly documents as a known, non-fixable limitation) that
`styled-components`'s own CJS bundle doesn't interop correctly with Node's native ESM loader -
unrelated to this package and invisible to every real consumer, which all load through a bundler.
