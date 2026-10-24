# React Library Best Practices — prioritized backlog

Living tracker for `@klear/klear360`. **Checklist 1–25:** [react-library-ship-tracker.md](./react-library-ship-tracker.md). Audit detail: [decisions.md](./decisions.md).

**Horizons:** **P0** = unblock `main`. **P1** = Wave A minors. **P2** = programs / major.

---

## P0 — Done on `main`

| # | Item | Status |
|---|------|--------|
| 2 | RN optional peers + audit triage (#188) | **Merged** |
| 1 | P3 waves 3–5 (web cutover) | **This PR** (merge of wave 5 + Wave A) |

---

## P1 — Wave A (this PR)

| # | Item | Status |
|---|------|--------|
| 4 | Web styled stragglers (`Button.stories`, Sandpack sample notes) | In PR |
| 5 | Confirm `@klear/klear360-core` `src/styles` | In PR |
| 18 | Storybook-dedicated tsconfig + `yarn types:typecheck:storybook` | In PR |
| 23–25 | `decisions.md`, backlog, ship tracker | In PR |

GenUI file split = **done** (do not reopen).

---

## P2 — Next programs

Native styling (**3**), `on*Change` major (**7**), RN Jest (**17**), core published peer (**6**), tarball CI (**15**), Table rows (**11**), SideNav reducer (**12**), a11y/docs/tests (**19–22**), npm audit (**16**).

---

## Done (no action)

Web SCSS + P3 web cutover; performance hot paths; Chromatic + a11y guide; Changesets; ESM-only policy; type-only circular deps OK.
