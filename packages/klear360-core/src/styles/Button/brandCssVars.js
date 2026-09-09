/**
 * @typedef {Object} BrandCssVarsOptions
 * @property {string} bg Brand fill color — hex, rgb/hsl, or `var(--merchant-*)` reference
 * @property {string} [highlighted] Hover / active / focus fill. Default: `color-mix(in srgb, bg 80%, black)`
 * @property {string} [disabled] Disabled fill. Default: `color-mix(in srgb, bg 18%, transparent)`
 */

/** @typedef {'primary' | 'positive' | 'negative'} AccentBrand */

/**
 * @param {string} bg
 * @returns {string}
 */
const defaultHighlighted = (bg) => `color-mix(in srgb, ${bg} 80%, black)`;

/**
 * @param {string} bg
 * @returns {string}
 */
const defaultDisabled = (bg) => `color-mix(in srgb, ${bg} 18%, transparent)`;

/**
 * @param {BrandCssVarsOptions} options
 * @returns {{ bg: string, highlighted: string, disabled: string }}
 */
const resolveBrandCssVarValues = ({ bg, highlighted, disabled }) => ({
  bg,
  highlighted: highlighted ?? defaultHighlighted(bg),
  disabled: disabled ?? defaultDisabled(bg),
});

/**
 * @param {AccentBrand} accent
 * @param {BrandCssVarsOptions} opts
 * @returns {Record<string, string>}
 */
const getInteractiveAccentCssVars = (accent, opts) => {
  const { bg, highlighted, disabled } = resolveBrandCssVarValues(opts);

  return {
    [`--interactive-background-${accent}-default`]: bg,
    [`--interactive-background-${accent}-highlighted`]: highlighted,
    [`--interactive-background-${accent}-disabled`]: disabled,
    [`--interactive-border-${accent}-default`]: bg,
    [`--interactive-border-${accent}-highlighted`]: highlighted,
  };
};

/**
 * CSS custom properties safe to set on `Button` `styleOverride.root` for filled primary CTAs.
 * Override these — not painted `background-color` — so Klear360 layered `:hover` / `:focus-visible` /
 * `[disabled]` rules keep working.
 *
 * **Stroke / border width:** filled primary uses inset `box-shadow`, not `border-width`.
 * Checkout "stroke" on a filled CTA cannot be expressed as a simple border override; use
 * `variant="secondary"` for an outlined CTA, or accept the inset shadow frame.
 */
export const SAFE_FILLED_BUTTON_ROOT_TOKEN_OVERRIDES = /** @type {const} */ ([
  '--interactive-background-primary-default',
  '--interactive-background-primary-highlighted',
  '--interactive-background-primary-disabled',
  '--interactive-border-primary-default',
  '--interactive-border-primary-highlighted',
  '--interactive-background-positive-default',
  '--interactive-background-positive-highlighted',
  '--interactive-background-positive-disabled',
  '--interactive-border-positive-default',
  '--interactive-border-positive-highlighted',
  '--interactive-background-negative-default',
  '--interactive-background-negative-highlighted',
  '--interactive-background-negative-disabled',
  '--interactive-border-negative-default',
  '--interactive-border-negative-highlighted',
  '--btn-progress-surface-backing',
]);

/**
 * Token bundle for a merchant-branded filled primary CTA (`color="primary"` +
 * `variant="primary"`). Maps to the same cluster as `Button.stories.svelte` brand playground
 * and `createTheme({ brandColor })` primary interactive tokens.
 *
 * Pair with `background-image: none` on the same node to drop the radial highlight without
 * painting over stateful `background-color`.
 *
 * @example
 * ```ts
 * const tokens = getPrimaryBrandCssVars({ bg: 'var(--merchant-cta-bg)' });
 * // Apply tokens on styleOverride.root class or ancestor inline style, plus:
 * // background-image: none;
 * ```
 * @param {BrandCssVarsOptions} opts
 * @returns {Record<string, string>}
 */
export const getPrimaryBrandCssVars = (opts) => getInteractiveAccentCssVars('primary', opts);

/**
 * Accent-aware token bundle for filled primary-variant buttons (`primary`, `positive`, `negative`).
 * For `primary`, delegates to {@link getPrimaryBrandCssVars}.
 * @param {AccentBrand} accent
 * @param {BrandCssVarsOptions} opts
 * @returns {Record<string, string>}
 */
export const getAccentBrandCssVars = (accent, opts) => {
  if (accent === 'primary') {
    return getPrimaryBrandCssVars(opts);
  }

  return getInteractiveAccentCssVars(accent, opts);
};
