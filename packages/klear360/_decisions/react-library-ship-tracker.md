# React library checklist — ship tracker (1–25)

Goal: every row **Done** on `main`. Detail in [decisions.md](./decisions.md) and [react-library-backlog.md](./react-library-backlog.md).

| # | Item | Acceptance (100%) | Status | PR / notes |
|---|------|-------------------|--------|------------|
| 1 | P3 waves 3–5 (web cutover) | Merged; no web production styled bridge | **Done** | Wave A PR (#187 superseded) |
| 2 | RN optional peers + audit docs | #188 merged | **Done** | `main` |
| 3 | React Native styling pass | Zero `styled-components` on native paths | **Not started** | Wave B |
| 4 | Web styled stragglers | Documented allowlist only | **Done** | Sandpack peers + styledProps test; Button.stories fixed |
| 5 | `@klear/klear360-core` styles confirmed | Decision updated | **Done** | CONFIRMED in decisions.md |
| 6 | `@klear/klear360-core` published peer | Clean frozen install | **Not started** | Blocked nohoist |
| 7 | `on*Change` API consistency | Major + codemod | **Not started** | Wave D |
| 8 | Composition / boolean props | Policy | **Not started** | |
| 9 | Large-component SRP | GenUI done | **Partial** | |
| 10 | In-library `React.lazy` | Consumer docs | **Done (by design)** | |
| 11 | Table row selection re-renders | Fixed or accepted limit | **Partial** | |
| 12 | SideNav `useReducer` | Refactor or waive | **Not started** | |
| 13 | Context provider splits | Hot paths done | **Partial** | |
| 14 | CJS `require()` without bundler | ESM-only documented | **Done (by design)** | |
| 15 | Pack tarball smoke in CI | Fixture install job | **Not started** | |
| 16 | npm audit clean | Policy scope | **Partial** | |
| 17 | React Native Jest green | CI native tests | **Not started** | Wave B |
| 18 | Storybook stories typecheck | Dedicated tsconfig + script + Storybook check config | **Partial** | Config landed; not in `yarn typecheck` until error burn-down |
| 19–22 | Tests / a11y / doc automation | See backlog P2 | **Partial** | |
| 23 | `decisions.md` P3 + item 5 + item 18 | Current | **Done** | Wave A |
| 24 | Backlog on main | Current | **Done** | Wave A |
| 25 | Stale backlog rows | GenUI removed | **Done** | Wave A |

## Next: Wave B (items 3, 17)
