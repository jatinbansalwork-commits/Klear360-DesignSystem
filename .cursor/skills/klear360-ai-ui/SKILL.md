---
name: klear360-ai-ui
description: >-
  Guides Klear360 AI UI — ChatInput, ChatMessage, GenUI (Generative UI), AI color
  palette experience, assistant/model/discussion tokens (purple). Use when building
  chat, copilot, streaming UI, schema-driven generative interfaces, model pickers, or
  any AI-branded surface. Do not use product primary (azure) for AI experiences.
---

# Klear360 AI UI

## Chat interface — ChatInput + ChatMessage

Use **`ChatInput`** and **`ChatMessage`** as the standard pair for AI chat UIs. Do not substitute `TextArea` + custom bubbles.

| Component | Role |
|-----------|------|
| `ChatInput` | User prompt — textarea, file upload, ghost suggestions, submit/stop |
| `ChatMessage` | Message thread — user (`self`) and agent (`other`) bubbles |

### ChatInput essentials

- **`isGenerating`** + **`onStop`** — swap submit for stop while AI streams
- **`onSubmit`** — receives `{ value, fileList }`; wire to your AI API
- **`suggestions`** + **`onSuggestionAccept`** — must be used together
- **`fileList`** / **`onFileChange`** — controlled attachments for multimodal prompts
- Do not use `TextInput` or `TextArea` for AI chat — use `ChatInput`

### ChatMessage essentials

- **`senderType="self"`** — user messages (right-aligned)
- **`senderType="other"`** — agent/AI messages (left-aligned); use `leading={<KlearAgentIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}`
- **`isLoading`** + **`loadingText`** — streaming state; pass string array for rolling animation
- **`footerActions`** — copy/thumbs/share on agent messages only (not self)
- **`validationState="error"`** + **`errorText`** — failed send/receive
- Put **GenUI** or rich JSX as `children` on agent `ChatMessage` for structured AI responses

### Full chat layout pattern

```tsx
import {
  Box,
  ChatInput,
  ChatMessage,
  KlearAgentIcon,
  GenUIProvider,
  GenUISchemaRenderer,
} from '@klear/klear360/components';

function AIChatPanel({ messages, isGenerating, onSubmit, onStop }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      backgroundColor="ai.discussion.background.subtle"
    >
      {/* Message thread */}
      <Box flex={1} overflow="auto" padding="spacing.4" display="flex" flexDirection="column" gap="spacing.3">
        {messages.map((msg) =>
          msg.senderType === 'other' ? (
            <ChatMessage
              key={msg.id}
              senderType="other"
              leading={<KlearAgentIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
              isLoading={msg.isLoading}
              loadingText={msg.loadingText}
              footerActions={msg.footerActions}
            >
              {msg.genUI ? (
                <GenUIProvider config={{ onActionClick: msg.onAction }}>
                  <GenUISchemaRenderer components={msg.genUI.components} />
                </GenUIProvider>
              ) : (
                msg.text
              )}
            </ChatMessage>
          ) : (
            <ChatMessage key={msg.id} senderType="self">
              {msg.text}
            </ChatMessage>
          ),
        )}
      </Box>

      {/* Input */}
      <Box padding="spacing.4" borderTopWidth="thin" borderTopColor="ai.discussion.border.subtle">
        <ChatInput
          placeholder="Ask anything…"
          isGenerating={isGenerating}
          onSubmit={onSubmit}
          onStop={onStop}
        />
      </Box>
    </Box>
  );
}
```

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
| Chat / generated content | `ai.discussion.*` | Message bubbles, thread panels, ChatMessage, ChatInput border |

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

- `get_klear360_component_docs` with `componentsList: "ChatInput, ChatMessage"` — chat UI API
- `get_klear360_general_docs` with `topicsList: "Tokens"` — **AI Colors** section
- `get_klear360_component_docs` with `componentsList: "GenUI"` — when available; otherwise read `packages/klear360/src/components/GenUI/` source and stories

## After edits

Always run the **klear360-audit** skill before finishing.
