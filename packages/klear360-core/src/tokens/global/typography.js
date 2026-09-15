import { fontFamily } from './fontFamily';

/**
 * For font size and line-heights we can’t say from xl to 2xl the value will necessary increase.
 * it might decrease or remain same because these are alias tokens and we need aliases for cross platform.
 * so for example xl on mobile can be 32px and on desktop xl can be 34px,
 * similarly 2xl on mobile can be 34px but on desktop doesn’t necessarily mean 2xl will be more than xl(34px) it can be 32 as well since visually they make better hierarchy.
 */

/**
 * @typedef {{
 *   25: number,
 *   50: number,
 *   75: number,
 *   100: number,
 *   200: number,
 *   300: number,
 *   400: number,
 *   500: number,
 *   600: number,
 *   700: number,
 *   800: number,
 *   900: number,
 *   1000: number,
 *   1100: number,
 * }} FontSize
 * desktop/mobile px values (top to bottom): 10/10, 11/11, 12/12, 14/14, 16/16, 18/16, 20/18, 24/20, 32/24, 40/32, 48/34, 56/36, 64/38, 72/40
 */

/** @type {{regular: 400, medium: 500, semibold: 600, bold: 700}} */
const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/**
 * @typedef {Object} Typography
 * @property {{family: import('./fontFamily/types').FontFamily, size: FontSize, weight: {regular: 400, medium: 500, semibold: 600, bold: 700}}} fonts
 * @property {{
 *   0: number,
 *   25: number,
 *   50: number,
 *   75: number,
 *   100: number,
 *   200: number,
 *   300: number,
 *   400: number,
 *   500: number,
 *   600: number,
 *   700: number,
 *   800: number,
 *   900: number,
 *   1000: number,
 *   1100: number,
 * }} lineHeights desktop/mobile px values (top to bottom): 0/0, 13/13, 16/16, 17/17, 20/20, 24/24, 24/22, 26/24, 32/26, 38/32, 46/38, 56/40, 64/42, 70/46, 78/48
 * @property {{25: number, 50: number, 100: number}} letterSpacings 25: -3.3%, 50: -1.3%, 100: 0%
 */

/**
 * @typedef {'onDesktop' | 'onMobile'} TypographyPlatforms
 */

/**
 * @typedef {Record<TypographyPlatforms, Typography>} TypographyWithPlatforms
 */

/** @type {TypographyWithPlatforms} */
export const typography = {
  onDesktop: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        25: 10,
        50: 11,
        75: 12,
        100: 14,
        200: 16,
        300: 18,
        400: 20,
        500: 24,
        600: 32,
        700: 40,
        800: 48,
        900: 56,
        1000: 64,
        1100: 72,
      },
      weight: {
        ...fontWeight,
      },
    },
    lineHeights: {
      0: 0,
      25: 13,
      50: 16,
      75: 17,
      100: 20,
      200: 24,
      300: 24,
      400: 26,
      500: 32,
      600: 38,
      700: 46,
      800: 56,
      900: 64,
      1000: 70,
      1100: 78,
    },
    letterSpacings: {
      25: -3.3,
      50: -1.3,
      100: 0,
    },
  },
  onMobile: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        25: 10,
        50: 11,
        75: 12,
        100: 14,
        200: 16,
        300: 16,
        400: 18,
        500: 20,
        600: 24,
        700: 32,
        800: 34,
        900: 36,
        1000: 38,
        1100: 40,
      },
      weight: {
        ...fontWeight,
      },
    },
    lineHeights: {
      0: 0,
      25: 13,
      50: 16,
      75: 17,
      100: 20,
      200: 24,
      300: 22,
      400: 24,
      500: 26,
      600: 32,
      700: 38,
      800: 40,
      900: 42,
      1000: 46,
      1100: 48,
    },
    letterSpacings: {
      25: -3.3,
      50: -1.3,
      100: 0,
    },
  },
};
