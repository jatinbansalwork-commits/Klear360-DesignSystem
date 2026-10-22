# ActionList

ActionList renders the flat option list used inside `Dropdown` (`SelectInput`, `AutoComplete`, `FilterChipSelectInput`, `InputDropdownButton`) and inside `Menu`/`DropdownButton`/`DropdownLink`. It stays flat forever - `TreeView` is the sibling component that owns hierarchy (see `TreeView/_decisions/decisions.md`).

## React.memo evaluation

**Finding (P3 follow-up on the TreeView `React.memo` audit, see `TreeView/_decisions/decisions.md`, "React.memo evaluation").** That audit explicitly flagged `ActionListItem` as carrying the identical bug it had just fixed in `TreeViewItem`, and left it out of scope as "a separate, higher-blast-radius change" because `Dropdown` is shared infrastructure behind `ActionList`, `AutoComplete`, `SelectInput`, `FilterChipSelectInput`, and `Menu` - not one component tree.

`_ActionListItem` read `activeIndex`, `selectedIndices`, `filteredValues`, and `isKeydownPressed` straight off `useDropdown()` (`React.useContext(DropdownContext)` under the hood), and the exported component was `React.memo(_ActionListItem)`. `Dropdown.tsx`'s `contextValue` bundled all of Dropdown's state - including those four fast-changing fields - into one `useMemo`'d object, so `memo` was a no-op for any re-render triggered by that context identity changing: an arrow-key press (`activeIndex`), a filter keystroke (`filteredValues`), a selection (`selectedIndices`), or a keyboard/mouse switch (`isKeydownPressed`) anywhere in the list re-rendered **every** `ActionListItem` in it, same root cause as `TreeViewItem`'s bug but triggered far more frequently (every keystroke while filtering, every arrow press, vs. TreeView's click-driven selection/expansion).

**Measured** with a 50-item `ActionList` (jest, spying on `getActionListItemRole` - a function `_ActionListItem`'s render body calls unconditionally, so the spy's call count is a direct proxy for how many times the render body actually executed; see `Dropdown/__tests__/ActionListItem.renderScope.web.test.tsx`):

| Interaction                                   | Before (items re-rendered) | After |
| ---------------------------------------------- | --------------------------: | ----: |
| Single `ArrowDown` (moves `activeIndex` by one) |                        50/50 |   2/2 |
| Single AutoComplete filter keystroke (3 items)  |                          6\* |     5\* |

\* The 3-item filter case isn't a clean N-vs-2 comparison like the arrow-key case: AutoComplete's "first item always in focus" effect (`AutoComplete.tsx`) also moves `activeIndex` to the first visible match on every filter change, so even after the fix, 3 items legitimately have a reason to re-render here (the one that lost `isActive`+`isVisible`, the one that lost only `isVisible`, and the one that gained `isActive`) - and each of those renders twice across two cascaded effects (filter commit, then the active-index-follow commit). The small absolute drop (6 → 5) at N=3 is expected; the arrow-key case is the representative O(list size) → O(1) result, since every item but the two touched now bails out of rendering entirely regardless of list size.

**Chosen approach: selector-based subscriptions, same shape as TreeView's fix, not a context split.** For the same reason TreeView's own writeup gives: splitting `DropdownContext` into multiple smaller contexts wouldn't reduce the blast radius, since most of the bundled state is a single value (or a small set of them) that every item potentially cares about - what each item actually needs is to compare only **its own derived slice** of that state and skip rendering when that slice hasn't changed. `useDropdownStoreSelector` (`useDropdownStore.ts`) is a `React.useSyncExternalStore`-based selector hook, structurally identical to `useTreeViewStore.ts`'s `useTreeViewStoreSelector`.

`DropdownContext` now only carries structural/rarely-changing state (`options`, `selectionType`, `dropdownTriggerer`, `dropdownBaseId`, refs, setters, and 5 newly-stable action functions - see below); `DropdownStoreContext` carries a small external store (`activeIndex`, `selectedIndices`, `filteredValues`, `isKeydownPressed`) that `ActionListItem` subscribes to per-slice:

```ts
const isActive = useDropdownStoreSelector((state) => state.activeIndex === props._index);
const isKeydownPressed = useDropdownStoreSelector((state) => state.isKeydownPressed);
const isSelectedByIndex = useDropdownStoreSelector((state) =>
  typeof props._index === 'number' ? state.selectedIndices.includes(props._index) : undefined,
);
const isVisibleFromFilter = useDropdownStoreSelector((state) =>
  state.filteredValues.includes(props.value),
);
```

`_ActionListItem` reads its structural fields (`dropdownBaseId`, `onOptionClick`, `setShouldIgnoreBlurAnimation`, `selectionType`, `dropdownTriggerer`, `hasAutoCompleteInHeader`) via `React.useContext(DropdownContext)` directly - **not** via `useDropdown()`. `useDropdown()` itself still subscribes to the store's *whole* state (`useDropdownStoreSelector((state) => state)`), for backward compatibility with every other caller (`SelectInput`, `AutoComplete`, `FilterChipSelectInput`, `Dropdown.tsx`'s own internals, `Menu`'s trigger, `TreeView`'s dropdown-mode integration) - all single-instance-per-Dropdown, so a whole-state subscription there is exactly as cheap as the old bundled-context read already was. Calling `useDropdown()` from inside `_ActionListItem` would silently reintroduce the bug (the nested `useSyncExternalStore` call would subscribe the item to every volatile field again, defeating the per-slice selectors) - this is why `_ActionListItem` reads structural fields off context directly instead.

**`ActionListSection`** (also `React.memo`'d) still calls `useDropdown()` for `hasAutoCompleteInHeader`/`dropdownTriggerer`/`filteredValues`, so it still re-renders on every volatile change - left as-is deliberately: sections are O(number of sections), not O(list size), and optimizing them wasn't part of this investigation's scope.

### A second problem this surfaced: stable actions can't read reactive closures

Making `ActionListItem` stop re-rendering on every keystroke means its own call to `onOptionClick` (the click handler, needed for every click) can no longer be a closure rebuilt from reactive state inside `useDropdown()` - by the time the item is actually clicked, that closure could be reading `activeIndex`/`selectedIndices`/`options` values from several interactions ago, since the item itself hasn't re-rendered to refresh them.

`onOptionClick`, `onOptionChange`, `selectOption`, `removeOption`, and `selectOptionsBatch` were hoisted out of `useDropdown()` (where they were previously recreated, with fresh reactive closures, on every call) into a new `useDropdownActions` hook called **once** per `Dropdown` instance, in `Dropdown.tsx`, with `React.useCallback` giving each a stable identity for the Dropdown's lifetime. They read the state they need through a `latestRef` (`Dropdown.tsx`'s `latestActionsRef`), mutated synchronously in `_Dropdown`'s render body every render - exactly the `latestRef` pattern `TreeView.web.tsx` already uses for its own three stable context callbacks - so they're always exactly as fresh as a reactive closure would have been, with zero extra lag.

This `latestRef` deliberately duplicates `activeIndex`/`selectedIndices`/`filteredValues` (also published to the external store) rather than having these actions call `store.getState()`: the store only updates via a `useIsomorphicLayoutEffect`, one commit *behind* the render that set the React state in the first place. Two of these actions firing within the same render pass (e.g. a `selectOptionsBatch` call immediately decided from a just-computed "are all selected" check) would read a stale value off the store. `latestRef`, mutated synchronously during render, has no such lag.

A related, non-obvious failure mode this uncovered: some consumers (`useControlledDropdownInput.tsx`, `FilterChipSelectInput.web.tsx` / `.native.tsx`) fire their `onChange` from a `useEffect` keyed to `changeCallbackTriggerer` (a plain, un-moved context value with no lag) and, in the same effect, used to read the now-volatile `selectedIndices` reactively off `useDropdown()`. Because `changeCallbackTriggerer` and `selectedIndices` are bumped in the very same `setState` batch but surface through two different mechanisms with two different timings (context propagation vs. the store's layout-effect sync), that effect could fire with the *already-updated* `changeCallbackTriggerer` but a *not-yet-synced*, stale `selectedIndices` - observed as `onChange` firing with an empty `values` array right after a selection. `getSelectedIndices()` (a new, stable, `latestRef`-backed snapshot getter on `DropdownContextType`) fixes this: anywhere a `changeCallbackTriggerer`-keyed effect (or `TreeView`'s own branch-cascade-toggle decision) needs the *current* selection synchronously, it calls `getSelectedIndices()` instead of reading the reactive `selectedIndices`.

**Explicitly out of scope.** `ActionListSection`'s re-render scope (see above). Any further optimization of `Dropdown`'s other single-instance consumers (`SelectInput`, `AutoComplete`, `FilterChipSelectInput`, `Menu`'s trigger) - they're O(1), not O(list size), so they were never the target of this investigation.

Verified via `Dropdown/__tests__/ActionListItem.renderScope.web.test.tsx`: moving the active index with arrow keys and filtering with AutoComplete each leave the render count of unrelated items at zero (measured via the `getActionListItemRole` spy - see that test file's own comment for why DOM-node-identity, the technique `TreeViewItem.renderScope.web.test.tsx` uses, doesn't actually distinguish "bailed out" from "re-rendered to an identical result" here, and was confirmed not to fail against the pre-fix code). The full `Dropdown.web.test.tsx` / `TreeView.web.test.tsx` / `TreeViewDropdown.web.test.tsx` / `Menu.web.test.tsx` / `AutoComplete.web.test.tsx` / `FilterChipSelectInput.web.test.tsx` / `FilterChipGroup.web.test.tsx` suites, standalone and Dropdown mode, pass unchanged. SSR: `useDropdownStoreSelector` passes the same snapshot getter as both the client and server argument to `useSyncExternalStore`, same as `useTreeViewStoreSelector`; `DropdownStoreContext`'s default value is a real (never-updated) store with the same no-op defaults `DropdownContext` itself used to carry, rather than `null` + a thrown error, since `useDropdown()` (and, through it, `TreeView`'s own dropdown-mode detection) is called unconditionally, including standalone outside any `Dropdown` - mirroring `DropdownContext`'s own established convention instead of copying `TreeView`'s "throw if used standalone" convention, which doesn't apply here. Caught by `TreeView.ssr.test.tsx` (which calls `useDropdown()` from standalone `TreeView`) during this investigation, before it shipped.

## Out of scope for this change

- No public prop or `useDropdown()` return-shape changes; `DropdownContextType` gained 6 new fields (`onOptionClick`, `removeOption`, `selectOptionsBatch`, `getSelectedIndices`, `selectOption`, `onOptionChange`) and lost 4 (`activeIndex`, `selectedIndices`, `filteredValues`, `isKeydownPressed` as plain data - their setters stay), but neither type is exported from the package's `index.ts`, so this is a purely internal, non-breaking change. No changeset.
- `ActionListSection`'s re-render scope (see above).
- `TreeView`'s own dropdown-mode `activeIndex`/`isKeydownPressed` re-render scope (`TreeViewItem.web.tsx` still calls `useDropdown()` wholesale) - unchanged by this work, already flagged as its own follow-up in `TreeView/_decisions/decisions.md`.

<br/><br/>

fin 🌻
