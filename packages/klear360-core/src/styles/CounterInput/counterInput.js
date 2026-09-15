import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './counterInput.module.css';

/** @typedef {'xsmall' | 'medium' | 'large'} CounterInputSize */
/** @typedef {'subtle' | 'intense'} CounterInputEmphasis */
/** @typedef {'decrement' | 'increment'} CounterInputButtonDirection */

/**
 * @typedef {Object} CounterInputContainerVariants
 * @property {CounterInputSize} [size]
 * @property {CounterInputEmphasis} [emphasis]
 */

/**
 * @typedef {Object} CounterInputButtonVariants
 * @property {CounterInputSize} [size]
 * @property {CounterInputEmphasis} [emphasis]
 * @property {CounterInputButtonDirection} [direction]
 */

/**
 * @typedef {Object} CounterInputInputVariants
 * @property {CounterInputSize} [size]
 * @property {CounterInputEmphasis} [emphasis]
 */

/**
 * Container styles. `size` drives width/height/radius, `emphasis` drives border
 * color. The `[data-disabled]` attribute selector in the CSS module covers the
 * disabled/loading background + border overrides, so they need no compound variant.
 */
export const counterInputContainerStyles = cva(styles.container, {
  variants: {
    size: {
      xsmall: styles['container-xsmall'],
      medium: styles['container-medium'],
      large: styles['container-large'],
    },
    emphasis: {
      subtle: styles['container-subtle'],
      intense: styles['container-intense'],
    },
  },
  defaultVariants: {
    size: 'medium',
    emphasis: 'subtle',
  },
});

/**
 * @param {CounterInputContainerVariants} props
 * @returns {string}
 */
export function getCounterInputContainerClasses(props) {
  return counterInputContainerStyles(props);
}

/**
 * Button styles. `size` drives padding/radius, `emphasis` drives idle/hover/disabled
 * icon color, `direction` drives the asymmetric outer margins.
 */
export const counterInputButtonStyles = cva(styles.button, {
  variants: {
    size: {
      xsmall: styles['button-xsmall'],
      medium: styles['button-medium'],
      large: styles['button-large'],
    },
    emphasis: {
      subtle: styles['button-subtle'],
      intense: styles['button-intense'],
    },
    direction: {
      decrement: styles['button-decrement'],
      increment: styles['button-increment'],
    },
  },
  defaultVariants: {
    size: 'medium',
    emphasis: 'subtle',
    direction: 'decrement',
  },
});

/**
 * @param {CounterInputButtonVariants} props
 * @returns {string}
 */
export function getCounterInputButtonClasses(props) {
  return counterInputButtonStyles(props);
}

/**
 * Native input styles. `size` drives font-size/line-height, `emphasis` drives
 * text color (idle + disabled via `[disabled]`).
 */
export const counterInputInputStyles = cva(styles.input, {
  variants: {
    size: {
      xsmall: styles['input-xsmall'],
      medium: styles['input-medium'],
      large: styles['input-large'],
    },
    emphasis: {
      subtle: styles['input-subtle'],
      intense: styles['input-intense'],
    },
  },
  defaultVariants: {
    size: 'medium',
    emphasis: 'subtle',
  },
});

/**
 * @param {CounterInputInputVariants} props
 * @returns {string}
 */
export function getCounterInputInputClasses(props) {
  return counterInputInputStyles(props);
}

/**
 * Get all CounterInput structural template classes as an object. Calling this
 * from the Svelte component prevents tree-shaking from dropping classes that are
 * only referenced inside the template (`counterInput`, `layout`, `controls`, etc.).
 *
 * @example
 * const counterInputClasses = getCounterInputTemplateClasses();
 * // counterInputClasses.counterInput, counterInputClasses.controls
 * @returns {{
 *   counterInput: string,
 *   layout: string,
 *   layoutLeft: string,
 *   controls: string,
 *   inputWrapper: string,
 *   animateSlideUp: string,
 *   animateSlideDown: string,
 *   progressBarWrapper: string,
 *   progressBar: string,
 *   progressBarSubtle: string,
 *   progressBarIntense: string,
 * }}
 */
export function getCounterInputTemplateClasses() {
  return {
    counterInput: styles['counter-input'],
    layout: styles.layout,
    layoutLeft: styles['layout-left'],
    controls: styles.controls,
    inputWrapper: styles['input-wrapper'],
    animateSlideUp: styles['animate-slide-up'],
    animateSlideDown: styles['animate-slide-down'],
    progressBarWrapper: styles['progress-bar-wrapper'],
    progressBar: styles['progress-bar'],
    progressBarSubtle: styles['progress-bar-subtle'],
    progressBarIntense: styles['progress-bar-intense'],
  };
}
