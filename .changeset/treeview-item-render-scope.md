---
"@klear/klear360": patch
---

perf(TreeView): stop every TreeViewItem re-rendering on every selection/expansion change

`TreeViewItem` read `selectedValuesSet`, `expandedValues`, and `tabbableValue` straight off a
single `TreeViewContext`, so selecting or expanding any one node re-rendered every mounted row
in the tree - profiling a 110-row tree showed 110/110 rows re-rendering per interaction.
`TreeViewContext` now only carries structural/rarely-changing state and stable callbacks; a new
`useTreeViewStoreSelector` (backed by `useSyncExternalStore`) lets each row subscribe to just its
own derived slice of selection/expansion/roving-tabindex state. `TreeViewItem` and
`TreeViewLoadMore` are now wrapped in `React.memo`, which is effective now that context no longer
changes on every interaction. No public API change. See
`packages/klear360/src/components/TreeView/_decisions/decisions.md` ("React.memo evaluation") for
the full investigation.
