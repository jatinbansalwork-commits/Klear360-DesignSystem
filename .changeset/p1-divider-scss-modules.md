---
"@klear/klear360": patch
---

feat(Divider): migrate web styling to SCSS Modules (P1 pilot 1/3)

Web `Divider` now uses `.module.scss` and CSS custom properties from `Klear360Provider`
instead of styled-components. React Native is unchanged. Import `@klear/klear360/styles.css`
once in the app as components migrate.
