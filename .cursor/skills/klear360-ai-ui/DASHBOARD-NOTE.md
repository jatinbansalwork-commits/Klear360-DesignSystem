# Klear360 AI UI — Dashboard App Setup Note

Use this note when building AI features in your **dashboard app** with Klear360.

---

## 1. One-time setup in your dashboard project

### A. Copy the skill (pick one)

**Global (all projects):**
```sh
mkdir -p ~/.cursor/skills
cp -R /Users/jatinbansal/Desktop/4.0/Klear360/.cursor/skills/klear360-ai-ui ~/.cursor/skills/
```

**This project only:**
```sh
mkdir -p .cursor/skills
cp -R /Users/jatinbansal/Desktop/4.0/Klear360/.cursor/skills/klear360-ai-ui .cursor/skills/
```

### B. Enable Klear360 MCP

Create or update `.mcp.json` in your dashboard project root:

```json
{
  "mcpServers": {
    "klear360-mcp": {
      "command": "npx",
      "args": ["-y", "@klear/klear360-mcp@latest"]
    }
  }
}
```

### C. Scaffold UI guidelines (first time only)

In Cursor chat, with your dashboard folder open:

```
Hi klear360 — create_klear360_skill for this project
```

---

## 2. When to use `klear360-ai-ui`

Load this skill whenever your dashboard has:

- AI copilot / assistant panel
- Chat or discussion thread
- Model picker or AI provider selector
- **GenUI** — schema-driven UI from AI responses (charts, tables, cards)
- Streaming AI content with purple-branded surfaces

**Do not** use product primary (azure) for these — use the **AI purple palette**.

---

## 3. Prompt template (paste in Cursor chat)

```
Use klear360-ai-ui for this task.

Build [describe feature — e.g. "a copilot side panel with GenUI for AI responses"]
in this dashboard app.

Rules:
- Use ChatInput + ChatMessage for the chat thread (not TextArea)
- Wrap GenUI in ai.discussion.* or ai.assistant.* tokens inside agent ChatMessage
- isGenerating + onStop on ChatInput while AI streams
- Fetch MCP docs: ChatInput, ChatMessage before coding
- Run klear360-audit when done
```

---

## 4. Dashboard patterns to follow

### AI chat panel (ChatInput + ChatMessage + optional GenUI)

```tsx
import { Box, ChatInput, ChatMessage, Avatar, GenUIProvider, GenUISchemaRenderer } from '@klear/klear360/components';

// Thread: ChatMessage (self/other) → agent messages can embed GenUI as children
// Footer: ChatInput with isGenerating + onStop for streaming
```

See full pattern in `klear360-ai-ui/SKILL.md` → **Chat interface** section.

### AI copilot panel (GenUI-only sidebar)

```tsx
import { Box } from '@klear/klear360/components';
import { GenUIProvider, GenUISchemaRenderer } from '@klear/klear360/components';

function AICopilotPanel({ schema, onAction }) {
  return (
    <Box
      backgroundColor="ai.assistant.background.subtle"
      borderColor="ai.assistant.background.moderate"
      padding="spacing.5"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <GenUIProvider config={{ onActionClick: onAction }}>
        <GenUISchemaRenderer components={schema.components} />
      </GenUIProvider>
    </Box>
  );
}
```

### Chat message bubble (discussion layer)

```tsx
<Box
  backgroundColor="ai.discussion.background.subtle"
  borderColor="ai.discussion.border.subtle"
  padding="spacing.4"
  borderRadius="medium"
>
  <Text color="ai.discussion.text.normal">{message}</Text>
</Box>
```

### Model picker row

```tsx
<Box
  backgroundColor="ai.model.background.subtle"
  borderColor="ai.model.border.subtle"
  padding="spacing.3"
>
  <Text color="ai.model.text.normal">{modelName}</Text>
</Box>
```

---

## 5. AI token cheat sheet

| Surface | Token prefix | Example |
|---------|--------------|---------|
| Copilot chrome | `ai.assistant.*` | `ai.assistant.accent` |
| Model UI | `ai.model.*` | `ai.model.border.normal` |
| Chat / GenUI content | `ai.discussion.*` | `ai.discussion.background.subtle` |

CSS aliases: `--kn-color-ai-accent`, `--kn-color-ai-accent-text`

---

## 6. GenUI in dashboard context

- AI returns JSON schema → render with `GenUISchemaRenderer`
- Built-in types: `TEXT`, `CHART`, `TABLE`, `CARD`, `STACK`, `BUTTON`, `ALERT`, `AMOUNT`
- Streaming CARD/TABLE blocks use gradient-ring animation automatically
- Reference: `Klear360 monorepo → packages/klear360/src/components/GenUI/GenUI.stories.tsx`

---

## 7. Finish every task with audit

```
Use klear360-audit — typecheck and test the files we changed
```

---

## 8. Quick checklist

- [ ] Skill copied to `~/.cursor/skills/` or `.cursor/skills/`
- [ ] `.mcp.json` configured
- [ ] `create_klear360_skill` run once
- [ ] AI surfaces use purple tokens, not azure primary
- [ ] GenUI wrapped in `ai.discussion.*` or `ai.assistant.*` container
- [ ] MCP docs fetched before implementing new components
