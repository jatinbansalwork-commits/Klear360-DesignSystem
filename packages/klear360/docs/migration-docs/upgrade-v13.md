# Migration to Klear360 v13

## Changes

1. `Dropdown`'s `onOpenChange` signature changed to match every other overlay component

## `Dropdown`'s `onOpenChange` signature change

`Dropdown`'s `onOpenChange` was the only overlay component in the design system still using a bare
boolean callback (`onOpenChange?: (isOpen: boolean) => void`). `DatePicker`, `Popover`, `Tooltip`,
`Menu`, `TimePicker`, and `SpotlightPopoverTour` all use an object-wrapped signature instead
(`onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void`), so a consumer moving between these
very similar overlay components couldn't share one handler. `Dropdown` has been aligned to match.

### Before

```jsx
<Dropdown isOpen={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
```

### After

```jsx
<Dropdown isOpen={isOpen} onOpenChange={({ isOpen }) => setIsOpen(isOpen)}>
```

A bare setter passed directly also needs wrapping:

```diff
- <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
+ <Dropdown isOpen={isOpen} onOpenChange={({ isOpen }) => setIsOpen(isOpen)}>
```

### Migrate with the codemod

```sh
npx jscodeshift ./PATH_TO_YOUR_DIR --extensions=tsx,ts,jsx,js -t ./node_modules/@klear/klear360/codemods/migrate-dropdown-open-change/transformers/index.ts --ignore-pattern="**/node_modules/**"
```

The codemod only touches `onOpenChange` on a JSX element literally named `Dropdown` - it leaves
`DropdownOverlay`, `DropdownButton`, and every other component's own (already object-wrapped)
`onOpenChange` untouched. Run your formatter (e.g. `prettier --write`) afterwards to clean up the
codemod's output.

### Manual migration

If you'd rather migrate by hand, wrap the existing parameter in `{ isOpen }` destructuring at each
`Dropdown`'s `onOpenChange` call site. There is no runtime behavior change - only the parameter
shape.
