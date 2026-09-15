/** @typedef {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'} AmountSizes */

/**
 * @typedef {Object} AmountDisplayProps
 * @property {'display'} [type]
 * @property {Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge'>} [size]
 */

/**
 * @typedef {Object} AmountHeadingProps
 * @property {'heading'} [type]
 * @property {Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>} [size]
 */

/**
 * @typedef {Object} AmountBodyProps
 * @property {'body'} [type]
 * @property {Extract<AmountSizes, 'xsmall' | 'small' | 'medium' | 'large'>} [size]
 */

/** @typedef {AmountDisplayProps | AmountHeadingProps | AmountBodyProps} AmountTypeProps */

/**
 * @type {Record<
 *   'body' | 'heading' | 'display',
 *   Partial<Record<NonNullable<AmountTypeProps['size']>, keyof import('../../tokens/global').FontSize>>
 * >}
 */
const normalAmountSizes = {
  body: {
    xsmall: 25,
    small: 75,
    medium: 100,
    large: 200,
  },
  heading: {
    small: 300,
    medium: 400,
    large: 500,
    xlarge: 600,
    '2xlarge': 700,
  },
  display: {
    small: 800,
    medium: 900,
    large: 1000,
    xlarge: 1100,
  },
};

/**
 * Hardcoded pixel values for currency symbols to match exact Figma specifications.
 * These values provide precise visual alignment that standard tokens cannot achieve.
 *
 * Used when `isAffixSubtle={false}` - currency symbols are slightly smaller than main number.
 *
 * TODO: Reuse klear360-core common tokens across svelte and react codebases.
 * These tokens are currently duplicated — klear360-react should import and use these directly.
 * @type {Record<
 *   'body' | 'heading' | 'display',
 *   Partial<Record<NonNullable<AmountTypeProps['size']>, { desktop: number, mobile: number }>>
 * >}
 */
const currencyHardcodedSizes = {
  body: {
    xsmall: { desktop: 10, mobile: 10 },
    small: { desktop: 10, mobile: 10 },
    medium: { desktop: 10, mobile: 10 },
    large: { desktop: 12, mobile: 12 },
  },
  heading: {
    small: { desktop: 17, mobile: 15 },
    medium: { desktop: 19, mobile: 17 },
    large: { desktop: 22, mobile: 19 },
    xlarge: { desktop: 30, mobile: 22 },
    '2xlarge': { desktop: 37, mobile: 30 },
  },
  display: {
    small: { desktop: 45, mobile: 32 },
    medium: { desktop: 52, mobile: 34 },
    large: { desktop: 60, mobile: 37 },
    xlarge: { desktop: 66, mobile: 37 },
  },
};

/**
 * @type {Record<
 *   'body' | 'heading' | 'display',
 *   Partial<Record<NonNullable<AmountTypeProps['size']>, keyof import('../../tokens/global').FontSize>>
 * >}
 */
const subtleFontSizes = {
  body: {
    xsmall: normalAmountSizes.body.xsmall,
    small: normalAmountSizes.body.xsmall,
    medium: normalAmountSizes.body.xsmall,
    large: normalAmountSizes.body.small,
  },
  heading: {
    small: normalAmountSizes.body.small,
    medium: normalAmountSizes.body.medium,
    large: normalAmountSizes.body.large,
    xlarge: normalAmountSizes.heading.medium,
    '2xlarge': normalAmountSizes.heading.large,
  },
  display: {
    small: normalAmountSizes.heading.xlarge,
    medium: normalAmountSizes.heading['2xlarge'],
    large: normalAmountSizes.heading['2xlarge'],
    xlarge: normalAmountSizes.display.small,
  },
};

/**
 * @type {Record<
 *   'body' | 'heading' | 'display',
 *   Partial<Record<NonNullable<AmountTypeProps['size']>, keyof import('../../tokens/global').Typography['lineHeights']>>
 * >}
 */
const amountLineHeights = {
  body: {
    xsmall: 25,
    small: 75,
    medium: 100,
    large: 200,
  },
  heading: {
    small: 300,
    medium: 400,
    large: 500,
    xlarge: 600,
    '2xlarge': 700,
  },
  display: {
    small: 800,
    medium: 900,
    large: 1000,
    xlarge: 1100,
  },
};

export { subtleFontSizes, normalAmountSizes, currencyHardcodedSizes, amountLineHeights };
