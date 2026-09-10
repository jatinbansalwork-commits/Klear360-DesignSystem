import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './badge.module.css';

/** @typedef {'xsmall' | 'small' | 'medium' | 'large'} BadgeSize */
/** @typedef {'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary'} BadgeColor */
/** @typedef {'subtle' | 'intense'} BadgeEmphasis */

/**
 * @typedef {Object} BadgeVariants
 * @property {BadgeSize} [size]
 * @property {BadgeColor} [color]
 * @property {BadgeEmphasis} [emphasis]
 */

/**
 * Badge height tokens mapped to size
 * @type {Record<BadgeSize, number>}
 */
export const badgeHeight = {
  xsmall: 14,
  small: 16,
  medium: 20,
  large: 24,
};

/**
 * Badge horizontal padding tokens mapped to size
 * @type {Record<BadgeSize, string>}
 */
export const badgeHorizontalPadding = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
};

/**
 * Badge text horizontal margin tokens mapped to size
 * Applied as marginX on the text element for spacing between icon and text edges
 * @type {Record<BadgeSize, string>}
 */
export const badgeTextHorizontalMargin = {
  xsmall: 'spacing.1',
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

/**
 * Badge icon padding tokens mapped to size
 * @type {Record<BadgeSize, string>}
 */
export const badgeIconPadding = {
  xsmall: 'spacing.1',
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

/**
 * Badge icon size mapped to badge size
 * @type {Record<BadgeSize, 'xsmall' | 'small'>}
 */
export const badgeIconSize = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'small',
};

/**
 * Badge text size mapping
 * Returns fontSize and lineHeight values for BaseText
 * Maps to React's Text component: variant='body' with size='xsmall'|'small'
 * - body xsmall: fontSize 25, lineHeight 25
 * - body small: fontSize 75, lineHeight 75
 * @type {Record<BadgeSize, { fontSize: 25 | 75, lineHeight: 25 | 75 }>}
 */
export const badgeTextSizes = {
  xsmall: { fontSize: 25, lineHeight: 25 },
  small: { fontSize: 25, lineHeight: 25 },
  medium: { fontSize: 75, lineHeight: 75 },
  large: { fontSize: 75, lineHeight: 75 },
};

/**
 * Get text color token based on color and emphasis
 * @param {{ color: BadgeColor, emphasis: BadgeEmphasis }} params
 * @returns {string}
 */
export function getBadgeTextColorToken({ color, emphasis }) {
  if (color === 'primary') {
    return emphasis === 'intense'
      ? 'surface.text.staticWhite.normal'
      : 'surface.text.primary.normal';
  }

  // Feedback colors
  return emphasis === 'intense'
    ? 'surface.text.staticWhite.normal'
    : `feedback.text.${color}.intense`;
}

/**
 * Get icon color token based on color and emphasis
 * @param {{ color: BadgeColor, emphasis: BadgeEmphasis }} params
 * @returns {string}
 */
export function getBadgeIconColorToken({ color, emphasis }) {
  if (color === 'primary') {
    return emphasis === 'intense'
      ? 'surface.icon.staticWhite.normal'
      : 'surface.icon.primary.normal';
  }

  // Feedback colors
  return emphasis === 'intense'
    ? 'surface.icon.staticWhite.normal'
    : `feedback.icon.${color}.intense`;
}

/**
 * CVA-based badge styles
 */
export const badgeStyles = cva(styles.badge, {
  variants: {
    size: {
      xsmall: styles.xsmall,
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    color: {
      neutral: styles['color-neutral'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      information: styles['color-information'],
      primary: styles['color-primary'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
  },
  // Checkout-scoped shape variants:
  // subtle → pill (border-radius-max)
  // intense + large → border-radius-small; intense + xsmall/small/medium → border-radius-xsmall
  compoundVariants: [
    { emphasis: 'subtle', class: styles['shape-pill'] },
    { emphasis: 'intense', size: 'large', class: styles['shape-size-large'] },
    { emphasis: 'intense', size: 'xsmall', class: styles['shape-size-default'] },
    { emphasis: 'intense', size: 'small', class: styles['shape-size-default'] },
    { emphasis: 'intense', size: 'medium', class: styles['shape-size-default'] },
  ],
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
    emphasis: 'subtle',
  },
});

// Export content and icon classes for use in component templates
export const badgeContentClass = styles.content;
export const badgeIconClass = styles.icon;

/**
 * Get icon padding class based on size
 * @param {BadgeSize} size
 * @returns {string}
 */
export function getBadgeIconPaddingClass(size) {
  return styles[`icon-padding-${size}`];
}

/**
 * Get text margin class based on size, using utility classes
 * @param {BadgeSize} size
 * @returns {string}
 */
export function getBadgeTextMarginClass(size) {
  /** @type {Record<BadgeSize, string>} */
  const marginMap = {
    xsmall: 'margin-x-spacing-1',
    small: 'margin-x-spacing-1',
    medium: 'margin-x-spacing-2',
    large: 'margin-x-spacing-2',
  };
  return utilityClasses[/** @type {keyof typeof utilityClasses} */ (marginMap[size])];
}

/**
 * Get all Badge component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 * @returns {Record<string, string>}
 */
export function getBadgeTemplateClasses() {
  return {
    content: badgeContentClass,
    icon: badgeIconClass,
    iconPaddingXsmall: styles['icon-padding-xsmall'],
    iconPaddingSmall: styles['icon-padding-small'],
    iconPaddingMedium: styles['icon-padding-medium'],
    iconPaddingLarge: styles['icon-padding-large'],
    shapePill: styles['shape-pill'],
    shapeSizeLarge: styles['shape-size-large'],
    shapeSizeDefault: styles['shape-size-default'],
  };
}

/**
 * Generate all classes for Badge component
 * This is the single source of truth for all Badge styling
 * @param {BadgeVariants & { className?: string }} props
 * @returns {string}
 */
export function getBadgeClasses(props) {
  const { className, ...cvaProps } = props;

  const classes = [badgeStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
