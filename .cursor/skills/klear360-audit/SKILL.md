---
name: klear360-audit
description: >-
  Runs a post-change audit gate for Klear360 work — typecheck, tests, lint, token drift,
  MCP doc sync, and snapshot updates. Use after every design system code change, before
  committing, or when the user asks to verify or audit changes.
---

# Klear360 Audit (Post-Change Gate)

**Run this skill after every code change.** Do not mark work complete until audit passes or you report specific blockers.

## Audit checklist

Copy and track progress:

```
Audit Progress:
- [ ] Scope identified (packages touched)
- [ ] Token compliance (no hardcoded colors/spacing)
- [ ] theme.css regenerated (if tokens changed)
- [ ] MCP knowledgebase synced (if public API/docs changed)
- [ ] Typecheck passed
- [ ] Tests passed
- [ ] Snapshots updated (if intentional UI change)
- [ ] Lint clean on touched files
```

## 1. Token compliance scan

On touched UI files, reject:

- Hardcoded hex/rgb/hsl colors (except in token definition files)
- Raw pixel spacing where a token exists
- Product primary (azure) used for AI UI
- Hand-edited token head in `theme.css`

If tokens changed in `klear360-core`:

```sh
cd packages/klear360-core && yarn generate:tokens-css
```

Verify committed `theme.css` matches generator output.

## 2. MCP knowledgebase sync

If you changed component APIs, tokens, or patterns, update matching files in:

`packages/klear360-mcp/knowledgebase/`

Then:

```sh
cd packages/klear360-mcp && yarn test --run
```

Update snapshots if test output changed intentionally: `yarn test:updateSnapshots`

## 3. Package verification commands

Run commands for **each touched package**:

### klear360-core

```sh
cd packages/klear360-core
yarn typecheck
yarn test
```

### klear360 (components)

```sh
cd packages/klear360
yarn typecheck
yarn test:react          # web components touched
yarn test:react-native   # native components touched
# yarn test:react -u     # only if snapshot change is intentional
```

### klear360-mcp

```sh
cd packages/klear360-mcp
yarn typecheck
yarn test --run
yarn build               # if src/ changed
```

## 4. Lint (when scope is broad)

```sh
# From repo root, scoped to touched package
yarn lint:klear360-core   # or lint:klear360, lint:klear360-mcp
```

## 5. Report format

```markdown
## Audit Report

**Status:** PASS | FAIL | PARTIAL

### Checks run
- [list commands executed]

### Failures (if any)
- [error + file + suggested fix]

### Skipped (if any)
- [what was skipped and why]
```

## Failure handling

1. Fix the root cause — do not skip failing tests.
2. Re-run failed checks only after fixing.
3. If blocked (env, permissions, flaky CI), report clearly — do not claim PASS.

## When to run

- After implementing any feature or fix
- Before git commit (when user requests commit)
- After token, component, motion, or AI UI changes
- After MCP knowledgebase edits
