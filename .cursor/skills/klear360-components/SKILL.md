---
name: klear360-components
description: >-
  Guides correct Klear360 component selection, API usage, patterns, and styled props.
  Use when building or modifying UI with @klear/klear360 components, choosing between
  similar components, or implementing design system patterns.
---

# Klear360 Components

## Before writing UI

1. Call `create_klear360_skill` if `.agents/skills/ui-code-guidelines/SKILL.md` is missing or outdated.
2. Fetch docs via MCP **before** coding:
   - Components → `get_klear360_component_docs`
   - Patterns → `get_klear360_pattern_docs`
   - Setup / icons → `get_klear360_general_docs`

## Selection rules

Pick components by **behavior**, not appearance:

| Need | Component |
|------|-----------|
| Distinct content panels | `Tabs` |
| Re-filter same content (2–5 short options) | `SegmentedControl` |
| Binary instant toggle | `Switch` |
| Form single choice (2–5, long labels) | `Radio` |
| Form multi choice | `Checkbox` |
| Short inline options | `Chip` |
| 5+ options | `Dropdown` / `SelectInput` |
| Searchable large list | `AutoComplete` |
| Page navigation | `SideNav`, `TopNav`, `BottomNav` |
| Body / heading / hero text | `Text`, `Heading`, `Display`, `Code` — see **klear360-typography** |

Call `get_klear360_general_docs` with `topicsList: "ChoosingComponents"` for the full decision tree.

## Implementation rules

- Prefer Klear360 components over custom HTML/CSS.
- Use `Box` + styled props for layout — not raw divs with custom CSS.
- Spacing: `margin="spacing.3"` or `"24px"` — never `margin={0}` or `margin="0"`.
- Use minimal props unless the use case requires size/color/variant.
- Match existing component naming: `isLoading` not `loading`, no negative prop names.
- Break complex layouts into subtasks; build part-by-part.
- Fix TypeScript/ESLint errors; re-fetch component docs if prop types are unclear.

## Patterns

Fetch pattern docs when the task matches: `ListView`, `DetailedView`, `FormGroup`, `CreationView`, `Confirmation`, `Settings`, `Dashboard`, `SparkAnimation`.

## Styled props reference

See `.agents/skills/ui-code-guidelines/references/styled-props-types.md` (created by `create_klear360_skill`).

## After edits

Always run the **klear360-audit** skill before finishing.
