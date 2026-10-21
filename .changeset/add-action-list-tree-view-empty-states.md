---
"@klear/klear360": minor
---

feat: add a "no results" pattern to `ActionList` and `TreeView`

Neither component had a built-in way to show feedback when a filterable list resolves to zero
items - a consumer typing a filter that matched nothing just saw an empty dropdown panel, and a
lazily-loaded `TreeView` branch that resolved to zero children just rendered an expanded group
with nothing inside it.

- `ActionList` gains a `noResultsContent?: React.ReactNode` prop, shown instead of the list when a
  filterable trigger (`AutoComplete`, or any trigger with an `AutoComplete` in the
  `DropdownHeader`, e.g. `FilterChipSelectInput`) narrows the options down to zero matches. It
  defaults to a built-in `EmptyState` ("No results found"). This also fixes a gap where filtering
  to zero matches via a header `AutoComplete` (as used by `FilterChipSelectInput`) rendered a
  blank panel - previously only the standalone `AutoComplete` trigger was handled.
- `TreeView` gains a new `TreeViewEmptyState` component - render it as a branch's only child (or
  as `TreeView`'s only child, for the whole tree) once an async fetch resolves to zero items. It
  is decorative only: never registered as a row, so it's never focusable or counted in keyboard
  traversal. Keep the branch's `hasChildren` set so the chevron / expanded state persists once the
  fetch resolves empty.

Both default to the shared `EmptyState` component, following the same visual pattern as `Table`'s
documented `EmptyState` wrapper convention.
