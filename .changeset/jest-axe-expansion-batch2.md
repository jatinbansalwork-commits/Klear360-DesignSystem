---
"@klear/klear360": patch
---

fix: BottomSheet missing accessibilityLabel, BaseInput missing aria-labelledby

Second batch of jest-axe coverage expansion (Drawer, BottomSheet, Dropdown, DatePicker, TimePicker,
Table), which caught two real, pre-existing accessibility bugs:

- `BottomSheet` had no way at all to supply an accessible name for its `dialog` role - every
  BottomSheet in the app failed the WCAG dialog-naming requirement unconditionally. Added an
  `accessibilityLabel` prop, matching the existing `Modal`/`Drawer` pattern.
- `BaseInput` (the shared foundation under nearly every input and dropdown trigger - TextInput,
  SelectInput, SearchInput, AutoComplete, and more) only associated its visible label via the
  native HTML `<label for>` mechanism. That's spec-valid for a native `<input>`, but axe correctly
  flags it as insufficient once `role` is overridden to a non-native-labelable ARIA widget role
  like `combobox` or `searchbox` - per WAI-ARIA 1.2, those roles' accessible name must come from
  `aria-label`/`aria-labelledby`. Verified this is a genuine, spec-valid finding (not an axe false
  positive) via an isolated minimal HTML repro before fixing. Now also sets `aria-labelledby`
  pointing at the existing visible label whenever one renders.
