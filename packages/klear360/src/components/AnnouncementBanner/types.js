/**
 * @typedef {'center' | 'left'} AnnouncementBannerAlignment
 */

/**
 * @typedef {{
 *   children: import('react').ReactNode,
 *   alignment?: AnnouncementBannerAlignment,
 *   icon?: import('~components/Icons').IconComponent,
 *   accessibilityLabel?: string,
 * } & import('~utils/types').TestID
 *   & import('~components/Box/styledProps').StyledPropsKlear360
 *   & import('~utils/types').DataAnalyticsAttribute} AnnouncementBannerProps
 *
 * - `children` — the banner message. Pass a string, or inline content such as `Link`.
 *   Keep it short — the banner is single-line.
 * - `alignment` — horizontal alignment of the banner content. Default `center`.
 * - `icon` — leading icon shown before the message. Omit to render the banner without an icon.
 * - `accessibilityLabel` — accessible label for the banner region, announced by screen readers.
 *   Default `"Announcement"`.
 */

/**
 * Internal styled-component props.
 *
 * The colour treatment follows the app's `colorScheme` (resolved via
 * `useTheme`) rather than a prop, so it is passed down as `isDark`.
 *
 * @typedef {{
 *   isDark: boolean,
 *   alignment: AnnouncementBannerAlignment,
 * } & import('~components/Box/styledProps').StyledPropsKlear360} StyledAnnouncementBannerProps
 */

export {};
