---
"@klear/klear360": minor
---

feat(Table): add `isSortable` column config, deprecate `sortable`

`TableColumnConfig`'s `sortable` boolean broke the `is*` naming convention used by every other
boolean prop in the design system. Added `isSortable` as the preferred field and marked `sortable`
`@deprecated` - it's still fully functional (used as a fallback whenever `isSortable` isn't set),
so no existing consumer needs to change anything immediately.

This follows the same non-breaking deprecation precedent already used elsewhere in `Table`
(`TableHeaderRowProps.rowDensity`, `onSelectionChange`'s `values`) rather than a hard removal -
existing code keeps working.

A codemod (`codemods/migrate-table-sortable`) is included to mechanically migrate `sortable` to
`isSortable` in a consumer's own column configs ahead of the eventual removal.
