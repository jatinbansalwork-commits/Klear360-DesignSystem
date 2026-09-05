---
name: klear360-ds-adoption
description: >-
  Routes Owl-Listener designer-skills ideas into Klear360 DS layers (tokens.css,
  components.css, MCP). Use when adopting design-systems plugin topics — not
  product UX skills. Skip conversational-ux, onboarding, critique-*, personas.
---

# Klear360 DS Adoption (from designer-skills)

Reference: [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) — **structure only**, do not vendor all 111 skills.

## In scope

| Layer | Files |
|-------|--------|
| Token source (React) | `packages/klear360-core/src/tokens/` |
| Vanilla CSS reference | `tokens.css`, `components.css` (sample apps) |
| MCP docs | `packages/klear360-mcp/knowledgebase/` |
| Cursor skills | `.cursor/skills/klear360-*` |

## Out of scope (product — never import into DS)

- `conversational-ux`, `onboarding-design`, `form-design` (ISF field chunking)
- `critique-*`, `behavioural-analytics`, `user-persona`
- Broker JS: `agentic-broker.js`, `*-assistant.js`, dialog scripts

## Topic routing

| designer-skills topic | DS action | Load skill |
|----------------------|-----------|------------|
| `design-token` / `tokenize` | Token tiers in `tokens.css`; divider/color/spacing semantics | **klear360-tokens** |
| `color-system` | Semantic `surface.border.*`, `ai.*` palette | **klear360-tokens**, **klear360-ai-ui** |
| `typography-scale` | Type utilities in `tokens.css` + `components.css` | **klear360-typography** |
| `spacing-system` | GenUI spacing contract (`.kn-genui__item--*`) | **klear360-tokens** |
| `theming-system` | Light/dark `--theme-*` blocks (when adding dark mode) | **klear360-tokens** |
| `motion-system` | `--kn-motion-*` / `--theme-motion-*`; GenUI ring, Spark | **klear360-motion** |
| `component-spec` | MCP component docs; `.kn-*` in `components.css` | **klear360-components** |
| `pattern-library` | `docs/components.md` patterns → MCP pattern docs | **klear360-components** |
| `icon-system` | Single AI mark (`#klear-assist-ray`) — already locked | maintain only |
| `accessibility-audit` | Contrast, focus rings, `prefers-reduced-motion` | audit pass (later) |
| `documentation-template` | MCP `get_klear360_*_docs` knowledgebase shape | sync MCP |
| `naming-convention` | `--kn-*` / `.kn-*` naming in tokens + components | **klear360-tokens** |

## Token tier audit (vanilla CSS)

Three tiers — **never skip a layer in component CSS**:

```
Tier 1  --kn-primitive-*     Raw palette (hex/hsla). Never in components.css.
Tier 2  --theme-colors-*    Semantic roles (surface.border.gray.muted, ai.*).
Tier 3  --kn-color-*        Product aliases for CSS consumption.
Tier 4  --kn-divider-*      Component-scoped aliases (Divider default chain).
```

React monorepo equivalent:

```
Global   packages/klear360-core/src/tokens/global/
Semantic packages/klear360-core/src/tokens/theme/klear360Theme.ts
CSS vars packages/klear360-core/src/tokens/theme.css
```

## Divider chain (canonical)

```
surface.border.gray.muted  →  blueGrayLight.a917 (light) / blueGrayDark.a523 (dark)
  React/CSS: hsla(222, 47%, 11%, 0.038) light / hsla(215, 25%, 27%, 0.057) dark

--theme-colors-surface-border-gray-muted
  → --kn-color-border-surface-gray-muted
  → --kn-divider-color-muted
  → --kn-divider-color          (.kn-divider default)
```

## GenUI spacing contract

Applied by `KNGenUI` via modifier classes on `.kn-genui__item`:

| Modifier | Token |
|----------|-------|
| `--h3`, `--after-h3-block`, `--after-text-block` | `--theme-spacing-7` |
| `--after-block-action` | `--theme-spacing-4` |
| `--after-action` | `--theme-spacing-2` |
| Stack gaps `small/medium/large` | `--theme-spacing-2/4/5` |

Verify: `tests/genui-spacing-contract-verify.mjs`

## Workflow

```
1. Identify designer-skills topic (or user table row)
2. Route via table above → load klear360-* skill
3. Edit tokens.css / theme source / MCP only — not broker logic
4. Run klear360-audit
5. PR (mandatory)
```

## Already in DS — maintain, do not re-import

- Divider tokens (`--kn-divider-*`)
- ChatMessage / ChatInput / GenUI primitives
- `klear360-audit` gate after every DS change
