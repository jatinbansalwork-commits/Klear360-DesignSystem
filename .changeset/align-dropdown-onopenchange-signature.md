---
"@klear/klear360": major
---

breaking: align `Dropdown`'s `onOpenChange` signature with the rest of the overlay components

`Dropdown`'s `onOpenChange` was the only overlay component still using a bare boolean callback
(`onOpenChange?: (isOpen: boolean) => void`), unlike `DatePicker`, `Popover`, `Tooltip`, `Menu`,
`TimePicker`, and `SpotlightPopoverTour`, which all use
`onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void`. A consumer moving between these very
similar overlay components couldn't share one handler because of the mismatched shape.

### Before

```jsx
<Dropdown isOpen={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
```

### After

```jsx
<Dropdown isOpen={isOpen} onOpenChange={({ isOpen }) => setIsOpen(isOpen)}>
```

A codemod (`codemods/migrate-dropdown-open-change`) mechanically migrates call sites - see
`docs/migration-docs/upgrade-v13.md` for the command and manual-migration instructions. All of
this design system's own internal usages (`TextInput`, `SearchInput`, `CountrySelector`, plus
stories and tests) were migrated directly as part of this change.
