---
name: klear360-motion
description: >-
  Guides Klear360 motion tokens and animation components — duration, delay, easing,
  Fade, Slide, Move, Scale, Stagger, Morph. Use when adding transitions, entrance/exit
  animations, or micro-interactions in Klear360 UI.
---

# Klear360 Motion

## Prefer animation components

Use Klear360 animation primitives over raw CSS transitions:

| Component | Use for |
|-----------|---------|
| `Fade` | Opacity enter/exit |
| `Slide` | Directional panel movement |
| `Move` | Position shifts |
| `Scale` | Size changes |
| `Stagger` | Sequenced child animations |
| `Morph` | Shape/state morphing |

```tsx
<Fade motionTriggers={['mount']}>
  <Card>Content</Card>
</Fade>
```

## Motion tokens

Source: `packages/klear360-core/src/tokens/global/motion.ts`

### Duration (ms)

| Token | Value | Use |
|-------|-------|-----|
| `duration.2xquick` | 80 | Micro-interactions |
| `duration.quick` | 200 | Hover, small reveals |
| `duration.moderate` | 280 | Panel slides |
| `duration.gentle` | 480 | Large reveals |
| `duration.2xgentle` | 960 | Full-screen transitions |

### Easing

| Token | Use |
|-------|-----|
| `easing.entrance` | Modals, drawers, dropdowns opening |
| `easing.exit` | Modals, drawers, dropdowns closing |
| `easing.standard` | General state changes |
| `easing.emphasized` | Hover, focused attention |
| `easing.overshoot` | Toasts, bouncy entries |
| `easing.shake` | Error feedback |

### String format in props

`"duration.quick"`, `"easing.entrance"`, `"delay.moderate"`

### styled-components

```ts
transition: transform ${theme.motion.duration.quick}ms ${theme.motion.easing.standard};
```

## Platform note

Web uses CSS `cubic-bezier()` strings; React Native uses `EasingFactoryFn` from reanimated. Klear360 components handle this — do not platform-branch in product code.

## Rules

1. Never invent arbitrary durations or-bezier curves.
2. Match easing to intent: entrance for open, exit for close, shake for errors only.
3. Respect `prefers-reduced-motion` — animation components handle this internally.

## MCP reference

Call `get_klear360_general_docs` with `topicsList: "Tokens"` — see **Motion Tokens** section.

## After edits

Always run the **klear360-audit** skill before finishing.
