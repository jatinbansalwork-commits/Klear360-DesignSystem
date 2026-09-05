---
name: klear360-typography
description: >-
  Guides Klear360 typography — Text, Heading, Display, Code components, global type
  tokens, font families, line heights, and makeTypographySize. Use when building or
  changing text UI, type hierarchy, font sizing, captions, headings, hero display
  type, inline code, or reviewing hardcoded font values.
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

## Type hierarchy (top → bottom)

```
Display  →  Heading  →  Text (body)  →  Text (caption)  →  Code
```

Do not skip levels visually (e.g. Display for a form label) or invert hierarchy (caption larger than body).

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
  textDecorationLine="dotted"  // abbreviations with Tooltip only
/>
```

| Variant | Size | Token keys (fontSize / lineHeight / letterSpacing) |
|---------|------|-----------------------------------------------------|
| body | xsmall | 25 / 25 / 50 |
| body | small | 75 / 75 / 50 |
| body | medium | 100 / 100 / 50 |
| body | large | 200 / 200 / 25 |
| caption | small | 50 / 50 / 50 |
| caption | medium | 100 / 50 / 50 |

Caption always forces `weight="regular"`.

### Heading

```tsx
<Heading
  size="medium"           // small | medium | large | xlarge | 2xlarge
  weight="semibold"       // regular | medium | semibold (default: semibold)
  as="h2"                 // auto-mapped by size if omitted
  color="surface.text.gray.normal"
/>
```

| Size | Token keys | Default `as` |
|------|------------|--------------|
| small | 300 / 300 | h6 |
| medium | 400 / 400 | h5 |
| large | 500 / 500 | h4 |
| xlarge | 600 / 600 | h3 |
| 2xlarge | 700 / 700 | h2 |

- `fontFamily`: `heading`
- Override `as` only when visual level ≠ semantic level

### Display

```tsx
<Display
  size="medium"           // small | medium | large | xlarge
  weight="semibold"
  as="h1"                 // default h1 on web
  color="surface.text.gray.normal"
/>
```

| Size | Token keys (fontSize / lineHeight) |
|------|-----------------------------------|
| small | 800 / 800 |
| medium | 900 / 900 |
| large | 1000 / 1000 |
| xlarge | 1100 / 1100 |

Letter spacing: `50` when weight is regular/medium, else `100`.

### Code

```tsx
<Code size="small" isHighlighted />           // default — subtle bg
<Code size="medium" isHighlighted={false} color="surface.text.gray.normal" />
```

| Size | Token keys |
|------|------------|
| small | 25 / 25 / 100 |
| medium | 75 / 75 / 100 |

`color` is only valid when `isHighlighted={false}`. Default highlight uses `feedback.background.neutral.subtle`.

## Page structure example

```tsx
import { Display, Heading, Text, Code, Box } from '@klear/klear360/components';

<Box display="flex" flexDirection="column" gap="spacing.4">
  <Display size="medium">Welcome to Klear360</Display>
  <Heading size="large">Account Settings</Heading>
  <Text size="medium" color="surface.text.gray.normal">
    Manage your profile and preferences.
  </Text>
  <Text variant="caption" size="small" color="surface.text.gray.subtle">
    Last updated 2 minutes ago
  </Text>
  <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start">
    <Text size="medium">Your key is </Text>
    <Code size="small">API_KEY</Code>
  </Box>
</Box>
```

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

Prefer typography components. When building custom styled text outside components, use **`makeTypographySize`** from the public API — never raw px/rem:

```tsx
import { makeTypographySize } from '@klear/klear360/utils';

const StyledLabel = styled.span`
  font-size: ${({ theme }) => makeTypographySize(theme.typography.fonts.size[100])};
  line-height: ${({ theme }) => makeTypographySize(theme.typography.lineHeights[100])};
  font-family: ${({ theme }) => theme.typography.fonts.family.text};
  font-weight: ${({ theme }) => theme.typography.fonts.weight.medium};
`;
```

- Web: `makeTypographySize` → rem
- Native: `makeTypographySize` → px
- Letter spacing is handled internally by typography components — do not hand-roll unless extending `BaseText`

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

## File map

| Change type | Edit these |
|-------------|------------|
| Global type scale | `packages/klear360-core/src/tokens/global/typography.ts` |
| Font families | `packages/klear360-core/src/tokens/global/fontFamily/` |
| Component presets | `packages/klear360/src/components/Typography/` |
| MCP docs | `packages/klear360-mcp/knowledgebase/components/{Text,Heading,Display,Code}.md` |
| Storybook | `packages/klear360/docs/tokens/Typography.mdx` |

## Rules

1. **Prefer components** over manual token wiring.
2. **Never hardcode** font-size, line-height, or letter-spacing in px/rem/em.
3. **Never hardcode** text colors — use semantic paths.
4. **Respect hierarchy:** Display → Heading → Text → Code.
5. **Semantic HTML:** Let Heading auto-map size→h-tag; override `as` only when visual level ≠ semantic level.
6. **Caption constraint:** `variant="caption"` accepts only `size="small"|"medium"`.
7. **Layout on typography:** use styled props — `margin="spacing.3"`, `textAlign="center"`.
8. **Don't use Display for body copy** or **Heading for hero text**.

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
