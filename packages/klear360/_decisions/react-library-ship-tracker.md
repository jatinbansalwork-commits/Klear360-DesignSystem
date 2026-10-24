# React library checklist — ship tracker (1–25)

Goal: every row **Done** on `main`. Detail in [decisions.md](./decisions.md) and [react-library-backlog.md](./react-library-backlog.md).

| # | Item | Acceptance (100%) | Status | PR / notes |
|---|------|-------------------|--------|------------|
| 1 | P3 waves 3–5 (web cutover) | #187 merged; no web production styled bridge; waves 3–5 in decisions | **In progress** | [#187](https://github.com/jatinbansalwork-commits/Klear360-DesignSystem/pull/187) — CI fix in flight |
| 2 | RN optional peers + audit docs | #188 merged; `peerDependenciesMeta`; backlog on main | **In progress** | [#188](https://github.com/jatinbansalwork-commits/Klear360-DesignSystem/pull/188) |
| 3 | React Native styling pass | Zero `styled-components` on native paths; provider native migrated | **Not started** | Program after #1 |
| 4 | Web styled stragglers | No styled in stories/Sandpack except documented test bridge | **Not started** | After #1 |
| 5 | `@klear/klear360-core` styles confirmed | Decision: canonical or not; doc updated | **Not started** | P1-2 |
| 6 | `@klear/klear360-core` published peer | Peer in package.json; clean `yarn install --frozen-lockfile` | **Not started** | Blocked on nohoist/vitest |
| 7 | `on*Change` API consistency | One convention; codemod; major release | **Not started** | Major |
| 8 | Composition / boolean props | ESLint or review checklist adopted | **Not started** | Policy |
| 9 | Large-component SRP | No tracked oversized files without plan | **Not started** | GenUI done |
| 10 | In-library `React.lazy` | Documented consumer pattern (GenUI guide) | **Done (by design)** | N/A in library |
| 11 | Table row selection re-renders | Fixed or documented upstream limit accepted in decisions | **Partial** | @table-library |
| 12 | SideNav `useReducer` | Refactor merged or waived in decisions | **Not started** | Optional |
| 13 | Context provider splits | Hot paths done; remainder audited | **Partial** | |
| 14 | CJS `require()` without bundler | Documented ESM-only or dual publish | **Done (by design)** | ESM-only |
| 15 | Pack tarball consumer smoke in CI | Job installs `.tgz` in fixture app | **Not started** | |
| 16 | npm audit clean | No open critical/high in scope per policy | **Partial** | Dev deps |
| 17 | React Native Jest green | Native test job passes | **Not started** | |
| 18 | Storybook stories typecheck | Dedicated tsconfig; CI step | **Not started** | P1-4 |
| 19 | State coverage tests | Loading/error/empty/disabled where applicable | **Partial** | |
| 20 | Hook/utility test coverage | No untested critical hooks | **Partial** | |
| 21 | Per-component a11y reference | Central guide + high-traffic components | **Partial** | |
| 22 | Doc drift automation | CI or script for props vs stories | **Not started** | |
| 23 | `decisions.md` P3 table | Matches main after cutover | **Not started** | After #1 |
| 24 | Backlog file on main | `react-library-backlog.md` current | **Not started** | #188 |
| 25 | Stale backlog rows | e.g. GenUI split marked done | **Not started** | #188 + this file |

## Merge order

1. **#188** (peers + docs) — smallest conflict surface  
2. **#187** (P3) — rebase on main after #188 if needed  
3. Branch **`cursor/react-library-ship-100`** for items 3–25 in waves
