---
"@klear/klear360": patch
---

feat(Dropdown): migrate web overlay panel to SCSS Modules (P1 pilot 3/3)

The dropdown overlay panel background uses CSS custom properties from
`Klear360Provider`, so light and dark themes keep working. Box shadow and backdrop
blur still come from the resolved theme.
