---
name: klear360-ai-ui
description: >-
  Guides Klear360 AI UI — GenUI (Generative UI), AI color palette experience,
  assistant/model/discussion tokens (purple). Use when building chat, copilot,
  streaming UI, schema-driven generative interfaces, model pickers, or any AI-branded
  surface. Do not use product primary (azure) for AI experiences.
---

# Klear360 AI UI

## GenUI — Generative UI Design System

**GenUI** is Klear360's **Generative UI** layer for rendering AI-produced interfaces from JSON schema.

Use GenUI when the AI agent returns structured UI (charts, tables, cards, text, actions) rather than hand-built JSX:

```tsx
import { GenUIProvider, GenUISchemaRenderer } from '@klear/klear360/components';

<GenUIProvider config={{ onActionClick: handleAction }}>
  <GenUISchemaRenderer components={aiGeneratedSchema.components} />
</GenUIProvider>
```

### GenUI rules

1. Wrap GenUI output in **AI-colored surfaces** — use `ai.discussion.*` or `ai.assistant.*` tokens for the container, panel, and chrome around generated content.
2. Prefer built-in GenUI component types (`TEXT`, `CHART`, `TABLE`, `CARD`, `STACK`, `BUTTON`, etc.) over custom renderers unless the schema requires extension.
3. Register custom components via `GenUIProvider` `config.components` only when built-ins are insufficient.
4. Use `gradient-ring-entry` animation for block-level streaming components (CARD, TABLE) — GenUI handles the animated reveal.
5. Respect `genUISpacingContract` — do not override GenUI internal spacing with arbitrary values.
6. Study `packages/klear360/src/components/GenUI/GenUI.stories.tsx` for schema patterns before inventing new structures.

## AI color palette experience

Every AI-branded surface should feel cohesive through the **purple AI palette** — separate from product primary (azure).

| Experience layer | Tokens | Visual intent |
|------------------|--------|---------------|
| Copilot chrome / streaming | `ai.assistant.*` | Accent rings, chips, brand highlights |
| Model selection | `ai.model.*` | Picker cards, badges, borders |
| Chat / generated content | `ai.discussion.*` | Message bubbles, thread panels, metadata |

**Compose GenUI inside AI surfaces:**

```tsx
<Box
  backgroundColor="ai.discussion.background.subtle"
  borderColor="ai.discussion.border.subtle"
  padding="spacing.5"
  borderRadius="medium"
>
  <GenUIProvider>
    <GenUISchemaRenderer components={components} />
  </GenUIProvider>
</Box>
```

## Core rule

**Purple is the AI accent.** Never use `interactive.background.primary.*` or azure chromatic colors for AI UI or GenUI containers.

## Token groups

| Group | Use for |
|-------|---------|
| `ai.assistant.*` | Copilot chrome, streaming rings, AI chips, brand highlights |
| `ai.model.*` | Model picker, model badges, model cards |
| `ai.discussion.*` | Chat threads, message bubbles, discussion panels |

Each group exposes: `accent`, `accentText`, `background.subtle/moderate`, and (model/discussion) `border.*`, `text.*`.

## Usage

```tsx
// Component props
<Box
  backgroundColor="ai.discussion.background.subtle"
  borderColor="ai.discussion.border.subtle"
>
  <Text color="ai.discussion.text.normal">AI response</Text>
</Box>

// CSS variables
background: var(--ai-assistant-background-subtle);
color: var(--kn-color-ai-accent-text);
```

## Global purple scale

Raw chromatic scale: `globalColors.chromatic.purple[50–1000]`. Semantic AI tokens map to these — prefer semantic paths in product code.

## Light vs dark

Both modes are defined in `klear360Theme.ts` / `klear360NeutralTheme.ts` under `colors.onLight.ai` and `colors.onDark.ai`. Verify both when adding new AI tokens.

## MCP reference

- `get_klear360_general_docs` with `topicsList: "Tokens"` — **AI Colors** section
- `get_klear360_component_docs` with `componentsList: "GenUI"` — when available; otherwise read `packages/klear360/src/components/GenUI/` source and stories

## After edits

Always run the **klear360-audit** skill before finishing.
