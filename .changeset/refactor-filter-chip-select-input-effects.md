---
"@klear/klear360": patch
---

refactor: merge duplicate effects in FilterChipSelectInput (web)

Two `useEffect`s in `FilterChipSelectInput.web.tsx` both depended on the same
`changeCallbackTriggerer` value and were both guarded by `!isFirstRender`, splitting one logical
"selection changed" reaction into two separate effects. Merged into one, preserving the original
execution order exactly - no behavior change. Verified via the component's new web test coverage
(added in a companion PR) plus `FilterChipGroup.web.test.tsx` and `TreeViewDropdown.web.test.tsx`.
