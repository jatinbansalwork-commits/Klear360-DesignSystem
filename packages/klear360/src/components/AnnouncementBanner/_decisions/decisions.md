# AnnouncementBanner

`AnnouncementBanner` is a slim, full-bleed banner used to surface a single short, system-wide promotional or informational message (e.g. feature announcements, offers, maintenance notices) at the very top or bottom edge of a page. It is single-line, has an optional leading icon, and is optimised for marketing-style broadcast messaging rather than contextual, inline feedback. Unlike `Alert`, it has no title/description hierarchy, no actions, and no dismiss button — it is intentionally minimal.

## Design

- [Figma - AnnouncementBanner](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Klear360-DSL?node-id=123476-17024&t=al61hwUh8Ms2HXUw-4)

The Figma component exposes exactly these properties:

| Figma property | Values            |
| -------------- | ----------------- |
| `Theme`        | `Dark` \| `Light` |
| `Alignment`    | `Center` \| `Left`|
| `showIcon`     | `true` \| `false` |
| `text`         | string            |

There is **no** action button, **no** dismiss/close affordance, and **no** feedback-colour set in the design. The two themes are the only colour treatments.

> **Note on `Theme`:** In Figma the `Dark`/`Light` treatment is modelled as a component property, but in code it is **not** a prop. The banner derives its treatment from the app's `colorScheme` (set on `Klear360Provider`) — a dark app renders the dark treatment and a light app the light treatment. See [Q1](#open-questions) for the rationale.

## API

The component is prop-driven. The message is passed as `children` (text or inline `Link`) and layout by `alignment`. The colour treatment (dark/light) is resolved automatically from the app `colorScheme` via `useTheme`, so there is no `theme` prop. The leading icon is rendered when an `icon` is provided; omit the prop to render without an icon.

```jsx
import { AnnouncementBanner } from '@klear/klear360/components';
import { BankAccountVerificationIcon } from '@klear/klear360/components';

<AnnouncementBanner icon={BankAccountVerificationIcon} alignment="center">
  Enter promotional text here
</AnnouncementBanner>;
```

This maps the Figma to code as: `Alignment` → `alignment`, `showIcon` → presence/absence of the `icon` prop (no separate `showIcon` boolean), `text` → `children`. The Figma `Theme = Dark | Light` is not a prop — it follows the app `colorScheme`.

<details>
  <summary>Alternate APIs considered</summary>

### Alternate API 1 — `theme="dark" | "light"` prop (1:1 with Figma)

```jsx
<AnnouncementBanner theme="dark" alignment="center">…</AnnouncementBanner>
```

- Pros
  - Maps the Figma `Theme` property 1:1.
- Cons
  - Duplicates `Klear360Provider`'s `colorScheme` as a second, independent source of truth for light/dark. A dark-mode app could render a light banner (and vice-versa), which looks broken and is inconsistent with every other Klear360 component.
  - The banner is page-level chrome; like `TopNav`/`Toast` its scheme should be derived from theme context, not hand-set per usage.
- Decision: **rejected** — derive the treatment from the app `colorScheme` instead of a `theme` prop.

### Alternate API 2 — `emphasis` instead of `theme`

```jsx
<AnnouncementBanner emphasis="intense" alignment="center">…</AnnouncementBanner>
```

- Pros
  - Consistent with `Alert` / `Badge` (`emphasis: 'subtle' | 'intense'`).
- Cons
  - The Figma `Dark`/`Light` is a colour-scheme treatment, not an emphasis ramp over a `color`. If a future requirement needs a deliberately high-contrast banner that ignores app theme, an intent prop (`color`/`emphasis`) can be added then — but it should not be conflated with the light/dark mode treatment.
- Decision: **deferred** — not needed for v1; the treatment follows `colorScheme`.

### Alternate API 3 — `text` prop instead of `children`

```jsx
<AnnouncementBanner text="Enter promotional text here" theme="dark" />
```

- Pros
  - Mirrors the Figma prop name 1:1; guarantees a string.
- Cons
  - Cannot embed an inline `Link` in the message (a common need for promo banners — "Know more", "Terms apply").
  - Diverges from Klear360's WYSIWYG philosophy where message content is `children`.
- Decision: **rejected** — use `children`, which still accepts a plain string.

### Alternate API 4 — Compound component

```jsx
<AnnouncementBanner theme="dark">
  <AnnouncementBanner.Icon icon={SomeIcon} />
  <AnnouncementBanner.Text>…</AnnouncementBanner.Text>
</AnnouncementBanner>
```

- Cons: overkill for a single-line banner with a fixed slot order; low discoverability; inconsistent with `Alert`.
- Decision: **rejected**.

</details>

### Props

#### AnnouncementBanner

```typescript
type AnnouncementBannerProps = {
  /**
   * The banner message. Pass a string, or inline content such as `Link`.
   * Keep it short — the banner is single-line.
   */
  children: React.ReactNode;

  /**
   * Horizontal alignment of the banner content.
   *
   * @default center
   */
  alignment?: 'center' | 'left';

  /**
   * Leading icon shown before the message. Omit to render the banner without an icon.
   *
   * @default -
   */
  icon?: IconComponent;

  /**
   * Accessible label for the banner region, announced by screen readers.
   *
   * @default "Announcement"
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsKlear360 &
  DataAnalyticsAttribute;
```

## Examples

### Basic Usage

A simple, centered promotional banner with a leading icon. In a light-themed app this renders the light treatment.

```jsx
<AnnouncementBanner icon={BankAccountVerificationIcon}>
  Enter promotional text here
</AnnouncementBanner>
```

### Dark color scheme

The banner follows the app `colorScheme`. Inside a `Klear360Provider` with `colorScheme="dark"` (e.g. a dark-themed app or section), it renders the dark treatment automatically — no prop needed.

```jsx
<Klear360Provider themeTokens={klear360Theme} colorScheme="dark">
  <AnnouncementBanner icon={BankAccountVerificationIcon}>
    Enter promotional text here
  </AnnouncementBanner>
</Klear360Provider>
```

### Left aligned

```jsx
<AnnouncementBanner alignment="left" icon={BankAccountVerificationIcon}>
  Switch to the new dashboard experience today.
</AnnouncementBanner>
```

### Without icon

```jsx
<AnnouncementBanner>
  Enter promotional text here
</AnnouncementBanner>
```

### With inline link

The message can contain an inline `Link` for in-context navigation.

```jsx
<AnnouncementBanner>
  Your KYC is verified. <Link href="/settings">View details</Link>
</AnnouncementBanner>
```

## Token mapping (from Figma)

The treatment is selected by the app `colorScheme` (`useTheme().colorScheme`), not a prop. `colorScheme="dark"` → dark treatment, `colorScheme="light"` → light treatment.

| Slot                 | dark color scheme                                          | light color scheme                       |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| Background           | `interactive.background.staticBlack.fadedHighlighted`      | `surface.background.gray.subtle`         |
| Text color           | `surface.text.staticWhite.subtle`                          | `surface.text.gray.subtle`               |
| Icon color           | `surface.icon.staticWhite.subtle`                          | `surface.icon.gray.subtle`               |
| Padding              | `spacing.3` (8px) vertical, `spacing.5` (16px) horizontal  | same                                     |
| Icon→text gap        | `spacing.2` (4px)                                          | same                                     |
| Text                 | size `small` (12px), weight `medium`, lineHeight 18         | same                                     |

`alignment="center"` → `justify-content: center`; `alignment="left"` → `justify-content: flex-start`. Width is always `100%` (full-bleed).

## Accessibility

- The banner container uses `role="region"` with an `aria-label` (from `accessibilityLabel`, default `"Announcement"`) so screen-reader users can locate and skip it as a landmark.
- The leading icon is decorative and hidden from assistive tech (`aria-hidden`); the message text carries the meaning.
- Colour is never the sole carrier of meaning — the content text conveys the message.

## Open Questions

- **Q1. How is the Dark/Light treatment selected?** Figma models the visual with `Theme = Dark | Light`. Should this be a `theme` prop (1:1 with Figma) or be derived from the app theme?
  - **A1.** Decision: **derive it from the app `colorScheme`** (`useTheme().colorScheme`) — there is no `theme` prop. Light/dark is owned by `Klear360Provider` and read by every Klear360 component; a separate `theme` prop on the banner would be a second source of truth that can disagree with the app (e.g. a light banner in a dark app) and is inconsistent with components like `TopNav`/`Toast`. No feedback `color` and no `emphasis` props in v1. If a deliberately theme-independent, high-contrast banner is needed later, that is a separate intent prop (`color`/`emphasis`), not `theme`.
- **Q2. `showIcon` vs `icon`.** Figma has a boolean `showIcon` and the icon is shown in all default variants. Should the API expose a separate `showIcon` boolean alongside an optional `icon`?
  - **A2.** Decision: **drop `showIcon`**; the icon is rendered when (and only when) the `icon` prop is provided. A separate boolean is redundant given `icon` is already optional, and aligns with `Alert` / `Badge` / `Button` which take only an optional `icon`. Consumers omit `icon` to render without one.
- **Q3. Actions / dismiss.** Not present in Figma. Deliberately excluded from v1 to keep parity with the design and avoid the centered-alignment layout problem that a trailing control would introduce. Can be revisited in a future iteration if product needs it.
  - **A3.** Decision: no `action`, no `isDismissible`, no `onDismiss` in v1.

## References

Prior art:

- [Klear360 `Alert`](../../Alert/_decisions/decisions.md) — closest analog (token scheme, full-bleed layout, a11y region semantics).
- [Polaris Banner](https://polaris.shopify.com/components/feedback-indicators/banner)
- [GitHub Primer Banner](https://primer.style/components/banner)
