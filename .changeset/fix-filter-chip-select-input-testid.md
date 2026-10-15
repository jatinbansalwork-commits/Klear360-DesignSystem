---
"@klear/klear360": patch
---

fix: forward testID on FilterChipSelectInput (web)

`testID` was destructured out of props and never forwarded to `BaseFilterChip`, making it a
silent no-op on web (native was unaffected). Found and fixed while adding the component's
first-ever web unit test coverage.
