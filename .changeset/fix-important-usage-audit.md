---
"@klear/klear360": patch
---

fix: justify !important usage, fix two grid-template-columns inconsistencies in Table

Added explanatory comments for every legitimate `!important` use across 8 files - each falls
into one of three categories: guarding against a host page's own `*:focus { ... !important }`
reset, overriding a third-party library's own inline/internal styles (react-window via
@table-library's virtualized mode, Storybook's docs iframe), or overriding a child component's
own internal styling from outside (BaseInput, ProgressBar).

Also fixed two real inconsistencies found along the way, both in the `grid-template-columns`
override for virtualized tables:
- `Table.web.tsx`: a duplicate `!important` (appeared once inside the ternary's false-branch
  string, once again outside it).
- `TableHeader.web.tsx`: an asymmetric ternary where only the false branch got `!important`,
  not the true branch - now both get it consistently, matching `Table.web.tsx`.

Both fixes verified via the full `Table.web.test.tsx` suite and regenerated snapshots - diffs are
limited to styled-components class-name hashes (expected, since the generated CSS text changed),
with no structural changes to any rendered DOM tree.
