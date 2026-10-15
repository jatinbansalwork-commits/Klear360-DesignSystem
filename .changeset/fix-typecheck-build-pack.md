---
"@klear/klear360": patch
---

fix: unblock package build (3 pre-existing typecheck errors) and shrink published package by excluding sourcemaps

- Fix `@klear/i18n` `typesVersions` pointing at non-existent per-subpath `.d.ts` files, which made `@klear/i18n/currency` unresolvable and broke `Amount.tsx` typecheck/build.
- Fix `Badge.contrast.web.test.ts` losing token literal types through an unnecessary `Record<string, unknown>` cast, which broke `DotNotationToken` inference.
- Bump `@react-stately/datepicker` to `3.17.1` to match the version `@react-types/datepicker` actually requires, eliminating a duplicate nested install with an incompatible `TimeFieldState` shape that broke `TimeInput.web.tsx`.
- Exclude `**/*.js.map` from the published npm package (`files` field) - cuts the pre-publish `npm pack` output from 12,593 files / 51.3MB unpacked to 6,331 files / ~23MB.
