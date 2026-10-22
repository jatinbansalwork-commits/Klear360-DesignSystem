---
"@klear/klear360": patch
"@klear/klear360-core": patch
---

fix: bump `ts-deepmerge` to patch a moderate prototype-pollution DoS advisory

Part of a larger P0 dependency-audit follow-up (`yarn audit`'s 38 high / 46 moderate findings
deferred from the original critical-only pass - see `packages/klear360/_decisions/decisions.md`'s
"Dependency audit" section). `ts-deepmerge` is the one runtime (not dev) dependency in that batch,
bumped 6.2.0 → 8.0.0.

The bump isn't behavior-neutral: v8 removed the package's `default` export (it now only exports a
named `merge`). Both packages re-export it as `export { default } from 'ts-deepmerge'`, which still
type-checked cleanly under `esModuleInterop`'s synthetic-default handling but would have resolved
`default` to the whole module object at runtime instead of the callable merge function, breaking
theme overrides (`overrideTheme.ts`) the moment they ran. Fixed by re-exporting the named `merge`
export as `default` instead (`export { merge as default } from 'ts-deepmerge'`) in both packages'
`src/utils/lodashButBetter/merge.ts` - no change to this package's own public API or merge
behavior.
