---
"@klear/klear360": minor
---

feat: add the `@klear/klear360/styles.css` export (SCSS Modules foundation)

First step of migrating components from styled-components to `.module.scss`. Component styles
will be extracted into a single stylesheet instead of being injected at import time, so consumers
load it once:

```js
import '@klear/klear360/styles.css';
```

No component has moved yet - the stylesheet currently only declares the `klear360` cascade layer,
and every component still renders through styled-components exactly as before. Importing it now is
optional and harmless; it becomes required as components are migrated. Theme CSS custom
properties for migrated components are injected at runtime by `Klear360Provider` (see P1);
`@klear/klear360-core` is not listed in `package.json` yet because Yarn 1's `nohoist` for
`@klear/klear360` breaks clean installs when it is — a proper peer dependency lands at P3.
