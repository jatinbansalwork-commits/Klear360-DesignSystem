# React Library Best Practices — prioritized backlog

Living tracker for `@klear/klear360`. **Full 1–25 checklist:** [react-library-ship-tracker.md](./react-library-ship-tracker.md). Detail in [decisions.md](./decisions.md).

## P0 — Ship now (items 1–2)

| # | Item | Status |
|---|------|--------|
| 1 | P3 waves 3–5 | **#187** — CI fix pushed; merge when green |
| 2 | RN optional peers + audit docs | **#188** — merge when green |

## P1 — Next minors (items 4–6, 18, 23–25)

| # | Item |
|---|------|
| 4 | Web styled stragglers (Button.stories, Sandpack) |
| 5 | Confirm `@klear/klear360-core` `src/styles` |
| 18 | Storybook-dedicated tsconfig |
| 23–25 | Reconcile `decisions.md`, backlog hygiene |

(GenUI split = **done**; drop P1-3.)

## P2 — Programs / major (items 3, 6–17, 19–22)

Native styling (**3**), `on*Change` major (**7**), RN Jest (**17**), core peer (**6**), tarball CI (**15**), Table rows (**11**), SideNav reducer (**12**), a11y/docs/tests (**19–22**), npm audit (**16**).

**Branch for items 3+:** `cursor/react-library-ship-100` (open after P0 merges).
