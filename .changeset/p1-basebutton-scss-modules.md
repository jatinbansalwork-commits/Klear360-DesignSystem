---
"@klear/klear360": patch
---

feat(Button): migrate web BaseButton styling to SCSS Modules (P1 pilot 2/3)

Web buttons now use `BaseButton.module.scss` with class-variance-authority for
variant, color, and size. React Native is unchanged. Consumers should import
`@klear/klear360/styles.css` once as more components migrate.
