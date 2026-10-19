# Klear360 Design System — Agent Context

Klear360 is Klear's design system. This package (`@klear/klear360`) ships React (web) and React Native components from a single shared codebase.

## Package Structure

```
src/
  components/   # Components directory
  tokens/       # theme tokens
  utils/        # Shared utilities and helpers
```

## Quick Commands

> **Note:** Run these commands from the `packages/klear360` directory.

### Running Tests

| Task                               | Command                                      |
| ---------------------------------- | -------------------------------------------- |
| Web tests (all)                    | `yarn test:react`                            |
| Web tests (specific components)    | `yarn test:react DatePicker Dropdown`        |
| Native tests                       | `yarn test:react-native`                     |
| Native tests (specific components) | `yarn test:react-native DatePicker Dropdown` |
| Update snapshots                   | `yarn test:react -u`                         |

### Other Commands

| Task                  | Command                                 |
| --------------------- | --------------------------------------- |
| Type check            | `yarn typecheck`                        |
| Prettier format files | `yarn prettier --write <file1> <file2>` |
| Build klear360 package   | `yarn build`                            |
| Run storybook locally | `yarn start:web`                        |

## Common Patterns and Best Practices to follow

- **Prop Namings and Component Structures:**
  - While adding a new prop to a component or adding a new component, always refer to types of existing components and ensure that the new prop names and component structures are consistent with existing components (use types and story examples as source of truth as API decisions can be out of date).
  - Follow best practices and give enough thought to prop names and component names as it is an important part of the design system. E.g. do not use negative prop names `isNotVisible` or inconsistent names like `loading` instead of `isLoading` used in other components.
  - A P3 audit (grepped every `components/*/types.ts` for bare `boolean` props not following the `is*`/`has*`/`show*`/`hide*`/`should*`/`auto*`/`default*`/`allow*`/`enable*` families already used throughout this codebase) found exactly one genuine violation (`Table`'s `Column.sortable`, tracked separately for a breaking rename + codemod). Every other bare-sounding boolean turned out to be a deliberate pass-through to an underlying library's own API, not a one-off inconsistency - don't "fix" these: `Charts/*`'s `hide`/`active` mirror Recharts' own prop vocabulary directly, and `Spark/KlearGlass`'s `wrapMode`/`reverse`/`paused` deliberately mirror Adobe After Effects' Colorama effect parameter names (it's an explicit port of that pipeline, see the file's own header comment).
  - A follow-up P3 audit checked several more cross-cutting prop *patterns* (not just booleans) across every component that has each one, rather than auditing component-by-component:
    - `size`: clean. Every component consistently uses full words from one shared `xsmall`/`small`/`medium`/`large`/`full` vocabulary - no abbreviations like `sm`/`md`/`lg` anywhere - just a different subset per component's own needs, which is expected, not inconsistent.
    - Callback naming: clean. Names that look similar at a glance (`onSelect`/`onSelection` vs. `Table`'s public `onSelectionChange`) turned out to be internal-only sub-component props, not competing public APIs.
    - `value`/`defaultValue`/`onChange`: clean once investigated. `FilterChip`'s missing `defaultValue` is intentional - it's documented as always-controlled by design. `Switch`'s bare `value` isn't its controlled state at all (that's `isChecked`/`defaultChecked`, matching `Checkbox`/`Radio`); it's the underlying HTML input's submit value, same as a native `<input type="checkbox" value="...">`.
    - `variant`: not comparable across components - it's inherently component-specific in meaning (shape vs. color vs. layout), so there's no shared vocabulary to be inconsistent with.
    - `placement` vs. `defaultPlacement` (`Popover`/`Tooltip` vs. `Dropdown`/`Menu`): looked like an inconsistency, isn't - `Popover` reactively rebinds `placement` into `useFloating()` on every change, while `Dropdown`/`Menu`'s `defaultPlacement` only seeds the initial position before floating-ui's own auto-flip middleware takes over. Different names correctly reflect different behavior.
    - `ref` forwarding type: clean. `Klear360ElementRef` (the shared, cross-platform ref union type) is used by 33 public top-level components; the handful of `React.forwardRef<HTMLDivElement>`/`<HTMLButtonElement>`/`<SVGSVGElement>` usages found are all internal sub-components (`CarouselBody`, `MenuItem`, `PopupArrow`, etc.) where the exact DOM element is already known and doesn't need cross-platform flexibility - not a bypass of the convention.
    - `accessibilityLabel`: clean. Every component consistently uses `accessibilityLabel` (never `ariaLabel`/`aria-label` as an actual prop name - the one `ariaLabel` hit found is a local variable inside `SegmentedControl.web.tsx`, not a public prop) for the accessible-name override, and `labelledBy`-style wiring is handled internally via `makeAccessible()` rather than exposed as its own prop anywhere.
    - `onOpenChange`'s *signature* (not name) was a real issue - fixed as a breaking change (see `Dropdown`'s own `_decisions/decisions.md`). Following up on it, a broader audit of every other `on*Change` callback's argument shape (bare value vs. `{ value }`-wrapped) found the same inconsistency is systemic across the package (`Table.onPageChange`, `ResizableSplit.onWidthChange`, `DatePicker.onPickerChange`, and a dozen+ others split roughly evenly between the two styles) - not fixed inline since it spans many public props across high-traffic components; see the package-level `_decisions/decisions.md` for the full breakdown and the combined follow-up task.
- **When intent is 'perform-task-end-to-end' (as defined by root AGENT context file)**
  - Do the task end-to-end with meaningful assumptions
  - Make sure the core task is still the focus while you also perform the other sanity tasks
