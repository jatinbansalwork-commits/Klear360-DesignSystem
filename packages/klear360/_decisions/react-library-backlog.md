# React Library Best Practices — prioritized backlog

Living tracker for `@klear/klear360` against the React Library Development Best Practices checklist. Detail and audit rationale live in [decisions.md](./decisions.md).

**Horizons:** **P0** = this sprint / unblock `main`. **P1** = next minor batches. **P2** = next major or dedicated program.

---

## P0 — Ship now

| ID | Item | Owner | Status |
|----|------|-------|--------|
| P0-1 | **P3 wave 5** — Storybook/docs SCSS, `~utils/cssObject`, decisions | Eng | In PR |
| P0-2 | **CI green** on wave 5 PR (web typecheck + Jest) | Eng | — |
| P0-3 | **Triage open audit PRs** — #179, #162, #157, #156 (merge, rebase, or close) | Eng + PM | Open |

---

## P1 — Next minor releases (weeks)

| ID | Item | Notes |
|----|------|--------|
| P1-1 | **Web styled stragglers** — `Button.stories` demo, Sandpack sample deps, optional test-bridge cleanup | Non-blocking for consumers |
| P1-2 | **Confirm `@klear/klear360-core` `src/styles`** — UNCONFIRMED as canonical DS CSS source | Unblocks publish peer |
| P1-3 | **GenUI internal split** — `GenUIComponents.web.tsx` → `markdown/` + `renderers/` | Internal only; own PR |
| P1-4 | **Documentation freshness (P2)** — PR #162 | |
| P1-5 | **RN peer optional (P1 publish)** — PR #157 | |
| P1-6 | **Utils React-deps audit** — PR #156 | |
| P1-7 | **Formal pack-tarball smoke test** in CI or release checklist (optional policy) | Consumer install confidence |

---

## P2 — Next major or multi-sprint programs

| ID | Item | Notes |
|----|------|--------|
| P2-1 | **`on*Change` callback convention** — one major + codemod (Table, DatePicker, Accordion, TreeView, …) | Breaking |
| P2-2 | **React Native styling pass** — migrate `.native.tsx` off styled-components; then remove SC from package | Largest styling gap |
| P2-3 | **`@klear/klear360-core` published peer** | Blocked on Yarn 1 nohoist / vitest; see P0 notes in decisions |
| P2-4 | **React Native Jest stabilization** | Scale failures today |
| P2-5 | **Table row-selection re-render isolation** | `@table-library` limit; large Table change |
| P2-6 | **SideNav collapse → `useReducer`** | Only when SideNav is actively changed |
| P2-7 | **GenUI / heavy widgets code-split guidance** for consumer apps | Docs + optional export patterns |
| P2-8 | **Per-component a11y deep reference** (~90 components) | Central guide exists; per-component optional |
| P2-9 | **Dual CJS package** | **Not planned** — ESM-only by decision; raw `require()` documented |
| P2-10 | **Security / devDependency audit remainder** | Verify 2/84 deferred items vs doc; ongoing on bumps |

---

## Done (checklist — no action)

- Web SCSS modules + CSS variables (P2 + P3)
- Web styled-components bridge removed (P3 wave 4)
- Performance: TreeView, ActionList/Dropdown, Table context splits; bundle CI; tree-shaking (bundler path)
- Testing: Chromatic, jest-axe, keyboard tests on heavy interactives; Accessibility guide (Storybook)
- Architecture: circular deps (type-only); unnecessary abstractions sweep
- Versioning: Changesets, release notes process

---

## P3 waves (styled cutover)

| Wave | Status |
|------|--------|
| 1–4 | **Merged** on `main` |
| 5 | **This PR** — docs/storybook + `cssObject` |

**0 waves left** after wave 5 merges; remaining styling = **P2-2 (native)** + **P1-1 (stragglers)**.
