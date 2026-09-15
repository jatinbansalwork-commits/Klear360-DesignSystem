/**
 * @typedef {Object} CreateThemeFontFace
 * @property {string} fontFamily
 * @property {string | string[]} src
 * @property {number | string} [fontWeight]
 * @property {'normal' | 'italic'} [fontStyle]
 * @property {'auto' | 'block' | 'swap' | 'fallback' | 'optional'} [fontDisplay]
 * @property {string} [format] Passed to `format()` when src has no format hint, e.g. `woff2`.
 */

/**
 * @typedef {Partial<import('~tokens/global/fontFamily/types').FontFamily>} CreateThemeFontFamilyOverride
 */

/**
 * @typedef {Partial<Record<keyof import('~tokens/global/typography').FontSize, number>>} CreateThemeFontSizeOverride
 */

/**
 * Merchant-friendly surface background overrides (hex / hsl / css colors).
 * `page` maps to `surface.background.gray.moderate` (checkout canvas).
 * @typedef {Partial<{
 *   page: string,
 *   graySubtle: string,
 *   grayIntense: string,
 *   primarySubtle: string,
 *   primaryIntense: string,
 *   seaSubtle: string,
 *   seaIntense: string,
 *   cloudSubtle: string,
 *   cloudIntense: string,
 * }>} CreateThemeSurfaceBackgroundOverride
 */

/**
 * @typedef {Object} CreateThemeSurfaceOverride
 * @property {CreateThemeSurfaceBackgroundOverride} [background] Applied to both color modes unless `onLight` / `onDark` are set.
 * @property {{background?: CreateThemeSurfaceBackgroundOverride}} [onLight]
 * @property {{background?: CreateThemeSurfaceBackgroundOverride}} [onDark]
 */

/**
 * @typedef {Object} CreateThemeConfig
 * @property {import('tinycolor2').ColorInput} brandColor
 * @property {import('./theme').ThemeTokens} [baseTheme] Base theme tokens to build on top of. Defaults to `klear360Theme`. Pass `klear360NeutralTheme` when the neutral checkout theme should remain the base even after brand-color overrides.
 * @property {Partial<import('~tokens/global').Border['radius']>} [borderRadius]
 * @property {CreateThemeFontFamilyOverride} [fontFamily]
 * @property {CreateThemeFontFace[]} [fontFaces] `@font-face` rules emitted as `fontFaceCSS` on the result. Pair with `fontFamily` names that match `fontFamily` on each face.
 * @property {CreateThemeFontSizeOverride} [fontSizeOverrides] Overrides named font-size tokens on desktop + mobile scales.
 * @property {number} [fontSizeScaleFactor] Multiplies every font-size token on both platforms (applied after `fontSizeOverrides`).
 * @property {CreateThemeSurfaceOverride} [surface]
 */

/**
 * @typedef {Object} CreateThemeResult
 * @property {import('./theme').ThemeTokens} theme
 * @property {import('~tokens/global/colors').ColorChromaticScale} brandColors
 * @property {string} [fontFaceCSS] Inject once (e.g. `<style>` or Klear360Provider) before themed UI renders.
 */

export {};
