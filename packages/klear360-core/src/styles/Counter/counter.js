import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './counter.module.css';

/** @typedef {'small' | 'medium' | 'large'} CounterSize */
/** @typedef {'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary'} CounterColor */
/** @typedef {'subtle' | 'intense'} CounterEmphasis */

/**
 * @typedef {Object} CounterVariants
 * @property {CounterSize} [size]
 * @property {CounterColor} [color]
 * @property {CounterEmphasis} [emphasis]
 */

/**
 * Counter text size mapping
 * Returns fontSize and lineHeight values for BaseText
 * Maps to React's Text component: variant='body' with size='xsmall'|'small'|'medium'
 * - body xsmall: fontSize 25, lineHeight 25
 * - body small: fontSize 75, lineHeight 75
 * - body medium: fontSize 100, lineHeight 100
 * @type {Record<CounterSize, { fontSize: 25 | 75 | 100, lineHeight: 25 | 75 | 100 }>}
 */
export const counterTextSizes = {
  small: { fontSize: 25, lineHeight: 25 },
  medium: { fontSize: 75, lineHeight: 75 },
  large: { fontSize: 100, lineHeight: 100 },
};

/**
 * Get text color token based on color and emphasis
 * @param {{ color: CounterColor, emphasis: CounterEmphasis }} params
 * @returns {string}
 */
export function getCounterTextColorToken({ color, emphasis }) {
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
 * CVA-based counter styles
 */
export const counterStyles = cva(styles.counter, {
  variants: {
    size: {
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
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
    emphasis: 'subtle',
  },
});

// Export content class for use in component templates
export const counterContentClass = styles.content;

/**
 * CSS module classes for conditional horizontal padding on the Counter content
 * wrapper.
 * @type {Record<CounterSize, string>}
 */
export const counterContentPaddingClass = {
  small: styles['content-padding-small'],
  medium: styles['content-padding-medium'],
  large: styles['content-padding-large'],
};

/**
 * Compute the class list for the Counter content wrapper.
 * Returns the base content class, plus the size-specific padding class when
 * the counter should render with horizontal padding (multi-digit values).
 * @param {{ size: CounterSize, hasHorizontalPadding: boolean }} params
 * @returns {string}
 */
export function getCounterContentClasses({ size, hasHorizontalPadding }) {
  const classes = [counterContentClass];
  if (hasHorizontalPadding) {
    classes.push(counterContentPaddingClass[size]);
  }
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate all classes for Counter component
 * This is the single source of truth for all Counter styling
 * @param {CounterVariants & { className?: string }} props
 * @returns {string}
 */
export function getCounterClasses(props) {
  const { className, ...cvaProps } = props;

  const classes = [counterStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
