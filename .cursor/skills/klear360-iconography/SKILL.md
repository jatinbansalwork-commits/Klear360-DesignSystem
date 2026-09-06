---
name: klear360-iconography
description: >-
  Guides Klear360 iconography — Icon components, sizes, semantic color tokens,
  brand marks (KlearLogoIcon, KlearAgentIcon), filled vs stroked variants, and
  integration with Button, IconButton, Badge, and other hosts. Use when picking,
  sizing, coloring, or adding icons in Klear360 UI.
---

# Klear360 Iconography

## Source of truth

| Layer | Location |
|-------|----------|
| Icon components | `packages/klear360/src/components/Icons/` |
| Size map | `packages/klear360/src/components/Icons/useIconProps/iconSizeMap.ts` |
| Color tokens | `surface.icon.*`, `feedback.icon.*`, `interactive.icon.*` in theme |
| MCP catalog | `packages/klear360-mcp/knowledgebase/general/AvailableIcons.md` |
| MCP API | `packages/klear360-mcp/knowledgebase/components/Icons.md` |

All icons export from `@klear/klear360/components`. **Never** import `_Svg` or build raw SVGs in product code.

## Icon API

Every icon is an `IconComponent` with the same props:

```tsx
import { ArrowRightIcon, CheckCircleIcon } from '@klear/klear360/components';

<ArrowRightIcon size="medium" color="surface.icon.gray.normal" />
<CheckCircleIcon size="large" color="feedback.icon.positive.intense" />
```

| Prop | Type | Default |
|------|------|---------|
| `size` | `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` \| `2xlarge` | `medium` |
| `color` | Icon color token or `'currentColor'` | `surface.icon.gray.normal` |

`currentColor` lets the icon inherit color from a parent (useful inside tinted containers).

## Size scale

Icons map to global **size tokens** (not typography):

| Size | px | Typical use |
|------|-----|-------------|
| `xsmall` | 8 | Dense meta, inline badges |
| `small` | 12 | Compact UI, table cells, chips |
| `medium` | 16 | **Default** — buttons, inputs, nav |
| `large` | 20 | Emphasized inline actions |
| `xlarge` | 24 | Standalone indicators, avatars |
| `2xlarge` | 32 | Hero marks, empty states |

Match icon size to the **host component** size (Button `size`, TextInput height, nav item density). Do not oversize icons relative to adjacent text — pair with **klear360-typography** for alignment.

## Color tokens

Use semantic paths only — no hex/hsl in icon props.

### Surface icons (default UI)

| Token | Use |
|-------|-----|
| `surface.icon.gray.normal` | Default icon color |
| `surface.icon.gray.subtle` | De-emphasized / secondary |
| `surface.icon.gray.muted` | Tertiary, disabled-adjacent |
| `surface.icon.gray.disabled` | Disabled state |
| `surface.icon.primary.normal` | Product primary (azure) actions |
| `surface.icon.onSea.onSubtle` | Icons on sea-tinted backgrounds |
| `surface.icon.onCloud.onSubtle` | Icons on cloud-tinted backgrounds |
| `surface.icon.staticWhite.normal` | Icons on dark/intense surfaces |
| `surface.icon.staticBlack.normal` | Icons on light surfaces |

### Feedback icons

| Token | Use |
|-------|-----|
| `feedback.icon.positive.intense` | Success |
| `feedback.icon.negative.intense` | Error / destructive |
| `feedback.icon.notice.intense` | Warning |
| `feedback.icon.information.intense` | Info |
| `feedback.icon.*.subtle` | Soft feedback backgrounds |

### Interactive icons

Use `interactive.icon.*` when the icon is part of a control state (hover/pressed) wired through interactive tokens.

**AI surfaces:** There is no `ai.icon.*` tier. For chat/copilot, use **klear360-ai-ui** — typically `KlearAgentIcon` with `surface.icon.onSea.onSubtle` on agent `ChatMessage` leading slots. Do **not** use product primary (azure) for AI-branded icons.

## Brand marks

| Icon | Role |
|------|------|
| `KlearLogoIcon` | Klear wordmark — nav headers, cards, marketing shells |
| `KlearAgentIcon` | Single canonical AI agent mark — chat leading, copilot avatars |

Do not substitute generic bot/sparkle icons for `KlearAgentIcon` in AI experiences. Do not alter the agent path geometry — maintain the locked mark.

## Filled vs stroked variants

Many icons ship as pairs:

```
StarIcon          →  outline / stroked (default UI)
StarFilledIcon    →  solid fill (selected, active, emphasis)
```

| Context | Variant |
|---------|---------|
| Default, unselected, navigation | Stroked (no `Filled` suffix) |
| Selected tab, active filter, toggled state | `*FilledIcon` |
| Product logos (KlearNow*, payments, etc.) | Often have dedicated filled pairs |

Search `AvailableIcons.md` or MCP before inventing a new icon name.

## Where icons belong (host components)

Icons are **communicative UI elements**, not illustrations. Pass the **component reference** (not JSX) to hosts:

| Need | Host | Pattern |
|------|------|---------|
| Icon-only action | `IconButton` | `icon={CloseIcon}` + required `accessibilityLabel` |
| Text + icon action | `Button` | `icon={PlusIcon}` |
| Link with icon | `Link` | `icon={ExternalLinkIcon}` |
| Status / count badge | `Badge` | `icon={CheckCircleIcon}` |
| Input adornment | `TextInput`, `SearchInput` | `icon={SearchIcon}` |
| Card / step chrome | `CardHeaderIcon`, `StepItemIcon` | `icon={KlearLogoIcon}` |
| Toast / alert leading | `Toast`, `Alert` | `leading={CheckCircleIcon}` |
| Standalone decorative | Rare — prefer `Box` + icon with semantic color |

**Don't**

- Use a bare icon as a clickable control — wrap in `IconButton` or `Button`.
- Use icons for large illustrations or marketing art — use proper media/assets.
- Hardcode SVG paths in product code.
- Export or import `_Svg`, `Path`, `Svg` from the icon internals.

## Finding the right icon

1. MCP: `get_klear360_general_docs` → topic **AvailableIcons** (full catalog with descriptions).
2. MCP: `get_klear360_component_docs` → **Icons** (props + examples).
3. Storybook: `Components/Icons/_KitchenSink.Icons` for visual browse.
4. Grep: `packages/klear360/src/components/Icons/iconMap.ts` for programmatic lookup.

Prefer an existing icon over adding a duplicate. Product-specific icons follow `*Icon` / `*FilledIcon` naming (PascalCase + `Icon` suffix).

## Adding a new icon (maintainers)

Use the plop generator — do not hand-copy folders:

```sh
cd packages/klear360
yarn plop icon
```

Generator templates: `packages/klear360/plop/icon/`. Each icon gets:

- `{Name}Icon.tsx` — uses `useIconProps`, `IconComponent`, `assignWithoutSideEffects`
- Web + native tests + snapshots
- Re-export in auto-generated `Icons/index.ts`
- Entry in `iconMap.ts` and MCP `AvailableIcons.md` (sync via audit)

ViewBox standard: **24×24**. Paths use `iconColor` from `useIconProps` for theming.

## Vanilla CSS sample apps

Sample apps (`tokens.css` / `components.css`) use inline SVG in markup, not React icons. Rules:

- Size via `--theme-size-*` or host component classes (`.icon-btn svg { width/height }`).
- Color via `currentColor` on SVG and semantic `--kn-color-text-*` / `--kn-color-icon-*` on the parent.
- For the AI agent mark in vanilla HTML, use the locked `#klear-assist-ray` SVG — do not redraw.

## Cross-skill routing

| Task | Load |
|------|------|
| Icon colors / new semantic icon token | **klear360-tokens** |
| AI chat agent avatar / copilot | **klear360-ai-ui** |
| Button vs IconButton vs Link choice | **klear360-components** |
| Adopting designer-skills icon-system topic | **klear360-ds-adoption** |

## MCP before implementing

```
get_klear360_general_docs  → AvailableIcons
get_klear360_component_docs → Icons, IconButton
```

## Rules

1. **Import from `@klear/klear360/components`** — one barrel, tree-shakeable.
2. **Semantic colors only** — `surface.icon.*`, `feedback.icon.*`, `interactive.icon.*`.
3. **Default size `medium`** unless density requires `small` / `xsmall`.
4. **Accessible icon actions** — `IconButton` always needs `accessibilityLabel`.
5. **Brand consistency** — `KlearLogoIcon` for product wordmark, `KlearAgentIcon` for AI.
6. **No custom SVGs** in consumers; extend the DS icon set via plop if truly missing.

## After edits

Run **klear360-audit**, then raise a PR per `.cursor/rules/klear360-pr-policy.mdc`.
