---
"@klear/klear360": patch
---

fix: mark several React Native-only peer dependencies as optional

A web-only consumer installing `@klear/klear360` with plain `npm install` could hit an `ERESOLVE`
failure, because `@floating-ui/react-native`, `@gorhom/bottom-sheet`, `@gorhom/portal`,
`react-native-gesture-handler`, `react-native-pager-view`, and `react-native-svg` weren't marked
`optional` in `peerDependenciesMeta`, unlike `react-native`, `react-native-reanimated`, and
`react-native-safe-area-context`, which already were. Added the missing entries so web-only
consumers aren't required to have React Native peers installed just to satisfy npm's resolver.
