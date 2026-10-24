---
"@klear/klear360": patch
---

feat: SCSS Modules P1 pilots (Divider, BaseButton, Dropdown overlay, TableSurface)

Web pilots migrate static styling to `.module.scss` with tokens via `Klear360Provider` CSS variables; theme- and color-scheme-dependent decoration (shadows, borders, overlays) still resolves from the Theme object. React Native unchanged. Import `@klear/klear360/styles.css` once in the app. Drops `@klear/klear360-core` from package dependencies until P3 (Yarn 1 nohoist install fix).
