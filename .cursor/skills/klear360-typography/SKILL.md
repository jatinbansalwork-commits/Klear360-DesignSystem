---
name: klear360-typography
description: >-
  Guides Klear360 typography — Text, Heading, Display, Code components, global type
  tokens, font families, line heights, and makeTypographySize. Use when building or
  changing text UI, type hierarchy, font sizing, or reviewing hardcoded font values.
---

# Klear360 Typography

## Two layers

| Layer | What it is | Where |
|-------|------------|-------|
| **Global tokens** | Numeric scales (size, weight, line-height, letter-spacing) | `packages/klear360-core/src/tokens/global/typography.ts` |
| **Components** | Presets that map human sizes → tokens | `packages/klear360/src/components/Typography/` |

Typography tokens are **global only** — no semantic typography tier. Meaning comes from choosing the right component and color token.

## Component selection

| Use case | Component | Example |
|----------|-----------|---------|
| Hero / landing / max impact | `Display` | `<Display size="large">Welcome</Display>` |
| Section headings | `Heading` | `<Heading size="medium">Settings</Heading>` |
| Body / paragraphs | `Text` | `<Text size="medium">Description</Text>` |
| Labels / meta / fine print | `Text variant="caption"` | `<Text variant="caption" size="small">Updated 2m ago</Text>` |
| Inline code / tokens | `Code` | `<Code size="small">API_KEY</Code>` |

**Never expose `BaseText`** to consumers — it is internal.

## Component APIs

### Text

```tsx
<Text
  variant="body"          // default — or "caption"
  size="medium"           // body: xsmall | small | medium | large
                          // caption: small | medium only
  weight="regular"        // regular | medium | semibold
  color="surface.text.gray.normal"
  as="p"                  // p | span | div | label | cite | q | abbr | figcaption
  truncateAfterLines={2}
/>
```

### Heading

```tsx
<Heading
  size="medium"           // small | medium | large | xlarge | 2xlarge
  weight="semibold"       // regular | medium | semibold (default: semibold)
  as="h2"                 // auto-mapped by size if omitted (small→h6 … 2xlarge→h2)
  color="surface.text.gray.normal"
/>
```

### Display

```tsx
<Display
  size="medium"           // small | medium | large | xlarge
  weight="semibold"
  as="h1"                 // default h1 on web
  color="surface.text.gray.normal"
/>
```

### Code

```tsx
<Code size="small" isHighlighted />           // default — subtle bg
<Code size="medium" isHighlighted={false} color="surface.text.gray.normal" />
```

`color` is only valid when `isHighlighted={false}`.

## Color tokens for text

Use semantic text paths — never hex:

| Path prefix | Use |
|-------------|-----|
| `surface.text.gray.*` | Default body/heading text |
| `surface.text.primary.*` | Brand-accent text |
| `interactive.text.*` | Links, clickable labels |
| `feedback.text.*` | Success, error, info states |
| `currentColor` | Inherit from parent |

Default on Text, Heading, Display: `surface.text.gray.normal`.

## Global token scales

Source: `packages/klear360-core/src/tokens/global/typography.ts`

```
typography: { onDesktop, onMobile }   // resolved by Klear360Provider — don't read manually
```

| Scale | Keys |
|-------|------|
| Font sizes | `25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100` |
| Font weights | `regular` (400), `medium` (500), `semibold` (600), `bold` (700) |
| Font families | `text`, `heading`, `code` |
| Line heights | Same numeric keys as font sizes + `0` |
| Letter spacings | `25` (-3.3%), `50` (-1.3%), `100` (0%) |

**Mobile diverges from desktop** at scale 300+ — never assume numeric keys are monotonic across platforms.

## Custom styled text (advanced)

When typography components aren't enough, use token utilities — never raw px/rem:

```tsx
import { makeTypographySize, makeLetterSpacing } from '@klear/klear360/utils';

const StyledLabel = styled.span`
  font-size: ${({ theme }) => makeTypographySize(theme.typography.fonts.size[100])};
  line-height: ${({ theme }) => makeTypographySize(theme.typography.lineHeights[100])};
  letter-spacing: ${({ theme }) =>
    makeLetterSpacing(theme.typography.fonts.size[100], theme.typography.letterSpacings[50])};
  font-family: ${({ theme }) => theme.typography.fonts.family.text};
`;
```

- Web: `makeTypographySize` → rem
- Native: `makeTypographySize` → px

## Theme customization (white-label)

```tsx
createTheme({
  fontFamily: { text: 'Inter', heading: 'Inter', code: 'JetBrains Mono' },
  fontSizeOverrides: { 100: 15 },   // override specific scale step
  fontSizeScaleFactor: 1.05,        // scale all sizes
});
```

After token source changes:

```sh
cd packages/klear360-core && yarn generate:tokens-css
```

## Rules

1. **Prefer components** over manual token wiring.
2. **Never hardcode** font-size, line-height, or letter-spacing in px/rem/em.
3. **Never hardcode** text colors — use semantic paths.
4. **Respect hierarchy:** Display → Heading → Text → Code. Don't use Display for body copy.
5. **Semantic HTML:** Let Heading auto-map size→h-tag; override `as` only when visual level ≠ semantic level.
6. **Caption constraint:** `variant="caption"` accepts only `size="small"|"medium"`.
7. **Layout on typography:** use styled props — `margin="spacing.3"`, `textAlign="center"`.

## MCP & docs

Before implementing:

```
get_klear360_component_docs → Text, Heading, Display, Code
get_klear360_general_docs → topicsList: "Tokens" (Typography section)
```

Storybook: `Components/Typography/*` and `docs/tokens/Typography.mdx`

Decisions: `packages/klear360/src/components/Typography/_decisions/decisions.md`

## After edits

Always run **klear360-audit**, then raise a PR per `.cursor/rules/klear360-pr-policy.mdc`.
