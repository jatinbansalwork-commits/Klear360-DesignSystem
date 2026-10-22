---
"@klear/klear360": patch
"@klear/klear360-core": patch
---

fix: restore the `merge` utility after `ts-deepmerge`'s v8 export change

A recent `ts-deepmerge` 6.2.0 -> 8.0.0 bump removed its named `merge` export, keeping only a
`default` export. Both packages' `lodashButBetter/merge.ts` still re-exported `merge as default`,
which TypeScript correctly flags as an error (`Module '"ts-deepmerge"' has no exported member
'merge'`) - breaking `typecheck` on `main`. Fixed by re-exporting the actual `default` export
instead. Verified the real `ts-deepmerge` module's `default` is the working merge function, and that
`typecheck` plus the existing `overrideTheme`/`createTheme` test suites pass in both packages.
