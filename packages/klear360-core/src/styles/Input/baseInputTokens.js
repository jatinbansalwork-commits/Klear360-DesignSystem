/**
 * Token maps ported from React `Input/BaseInput/baseInputTokens.ts` (web subset).
 *
 * These are consumed by the `baseInput` CVA to pick the right CSS-module class
 * per `size` / `validationState`. Interaction states (hover/focus/disabled) are
 * handled by CSS pseudo-classes (`:hover`, `:focus-within`, `[disabled]`) in
 * `baseInput.module.css`, so the React `currentInteraction` state machine and
 * the borderless/table/counter maps are intentionally dropped.
 */

/** @typedef {'xsmall' | 'small' | 'medium' | 'large'} BaseInputSize */
/** @typedef {'none' | 'error' | 'success'} BaseInputValidationState */
/** @typedef {'text' | 'heading'} BaseInputValueComponentType */

/**
 * Input heights per size (px). xsmall 28 / small 32 / medium 36 / large 48.
 * @type {Record<BaseInputSize, number>}
 */
export const baseInputHeight = {
  xsmall: 28,
  small: 32,
  medium: 36,
  large: 48,
};

/**
 * Wrapper border-radius token per size. xsmall/small/medium → `small` (8px),
 * large → `medium` (12px).
 * @type {Record<BaseInputSize, 'small' | 'medium'>}
 */
export const baseInputBorderRadius = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

/**
 * Padding tokens (spacing scale index) per side/size. Consumed as
 * `var(--spacing-N)` in the CSS module.
 */
export const baseInputPaddingTokens = /** @type {const} */ ({
  top: { xsmall: 2, small: 2, medium: 3, large: 4 },
  bottom: { xsmall: 2, small: 2, medium: 3, large: 4 },
  left: { xsmall: 3, small: 3, medium: 4, large: 4 },
  right: { xsmall: 3, small: 3, medium: 4, large: 4 },
});

/**
 * `margin-left` (px) applied to the FormHint row when the label is
 * left-positioned, so the hint aligns under the input rather than the label.
 * @type {Record<BaseInputSize, number>}
 */
export const formHintLeftLabelMarginLeft = {
  xsmall: 136,
  small: 136,
  medium: 136,
  large: 192,
};
