---
name: klear360-tokens
description: >-
  Guides Klear360 token architecture — global vs semantic tokens, spacing, color,
  typography, border, elevation, and theme.css generation. Use when adding or changing
  design tokens, theme files, CSS variables, or when reviewing hardcoded values in UI code.
---

# Klear360 Tokens

## Architecture

Klear360 uses a **two-tier token system**:

| Tier | Location | Examples |
|------|----------|----------|
| **Global** (raw) | `packages/klear360-core/src/tokens/global/` | `spacing`, `colors.chromatic.*`, `motion`, `border`, `opacity` |
| **Semantic** (contextual) | `packages/klear360-core/src/tokens/theme/klear360Theme.ts` | `surface.*`, `interactive.*`, `feedback.*`, `ai.*`, `data.*` |

Light/dark modes live under `colors.onLight` and `colors.onDark`.

## File map

| Change type | Edit these |
|-------------|------------|
| New chromatic scale | `global/colors.ts` |
| New semantic color | `theme/klear360Theme.ts`, `theme/klear360NeutralTheme.ts`, `theme/theme.ts` (types) |
| CSS variables | Regenerate — do not hand-edit token head in `theme.css` |
| MCP docs | `packages/klear360-mcp/knowledgebase/general/Tokens.md` |

## Rules

1. **Never hardcode** hex/rgba/hsla in components — use semantic token paths.
2. **Colors** → semantic paths: `surface.background.gray.moderate`, `interactive.background.primary.normal`, `ai.assistant.accent`.
3. **Spacing / border / motion** → global tokens: `spacing.5`, `border.radius.medium`, `motion.duration.quick`.
4. **String prop format** in components: `padding="spacing.5"`, `backgroundColor="surface.background.gray.subtle"`.
5. **Responsive props**: `padding={{ base: 'spacing.3', m: 'spacing.5' }}`.

## Regenerate theme.css

After token source changes:

```sh
cd packages/klear360-core && yarn generate:tokens-css
```

The generator owns the token-derived head of `theme.css`. The utility-class tail after `@layer klear360 {` is hand-authored — never overwrite it.

## MCP reference

Call `get_klear360_general_docs` with `topicsList: "Tokens"` for full token tables before making changes.

## After edits

Always run the **klear360-audit** skill before finishing.
