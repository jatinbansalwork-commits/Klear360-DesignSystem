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
optional and harmless; it becomes required as components are migrated. Also adds
`@klear/klear360-core` as a dependency for its theme CSS variables.
