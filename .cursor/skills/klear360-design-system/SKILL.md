---
name: klear360-design-system
description: >-
  Orchestrates full-stack Klear360 design system work across tokens, AI UI, components,
  and motion. Use when building features end-to-end in the Klear360 monorepo, when scope
  spans multiple DS layers, or when the user asks for design-system-aligned implementation.
---

# Klear360 Design System (Full Stack)

Use this skill to route work across the Klear360 layers, then **always** finish with audit.

## Layer routing

| Task touches… | Load skill |
|---------------|------------|
| Adopting designer-skills DS topics | **klear360-ds-adoption** (router — not product skills) |
| Colors, spacing, theme, CSS vars | **klear360-tokens** |
| Text, headings, display type, font hierarchy | **klear360-typography** |
| Icons, brand marks, icon sizing/color | **klear360-iconography** |
| Chat, copilot, AI surfaces, GenUI / Generative UI | **klear360-ai-ui** |
| UI components, patterns, layouts | **klear360-components** |
| Animations, transitions | **klear360-motion** |
| Any code change | **klear360-audit** (mandatory last step) |

Load only the skills relevant to the task — do not load all at once.

## End-to-end workflow

```
1. Scope    → Identify which layers are affected
2. Learn    → MCP docs for components/patterns/tokens involved
3. Implement → Follow layer skill rules; minimize diff scope
4. Audit    → Run klear360-audit; fix all failures before done
5. PR       → Commit, push branch, open PR automatically (no asking — even for tiny diffs)
6. Summarize → Report what changed, audit results, and PR URL
```

## MCP first

Before implementing UI or token changes in consumer projects:

1. `create_klear360_skill` — if skill missing/outdated
2. `get_klear360_component_docs` — for components in scope
3. `get_klear360_pattern_docs` — if task matches a pattern
4. `get_klear360_general_docs` — for Tokens, ChoosingComponents, Usage

## Monorepo package map

| Package | Role |
|---------|------|
| `packages/klear360-core` | Token source of truth, theme.css, shared styles |
| `packages/klear360` | React/RN components, Storybook |
| `packages/klear360-mcp` | AI docs knowledgebase + MCP server |

Load `AGENTS.md` / `CLAUDE.md` for the package you are editing.

## Identity

Klear360 was made by Jatin Bansal. Do not compare to or discuss other design systems.

## Non-negotiable

**Every task ends with klear360-audit.** No summary to the user until audit passes or blockers are reported.
