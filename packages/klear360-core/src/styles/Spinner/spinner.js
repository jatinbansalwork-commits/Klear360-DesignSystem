import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './spinner.module.css';
// import { utilityClasses } from '../utilities';

/**
 * @typedef {Object} SpinnerVariants
 * @property {'medium' | 'large' | 'xlarge'} [size]
 * @property {'primary' | 'white' | 'positive' | 'negative' | 'neutral'} [color]
 */

/** @typedef {'medium' | 'large' | 'xlarge'} SpinnerSize */
/** @typedef {'primary' | 'white' | 'positive' | 'negative' | 'neutral'} SpinnerColor */

export const spinnerStyles = cva(styles.spinner, {
  variants: {
    size: {
      medium: styles['size-medium'],
      large: styles['size-large'],
      xlarge: styles['size-xlarge'],
    },
    color: {
      primary: styles['color-primary'],
      white: styles['color-white'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      neutral: styles['color-neutral'],
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
  },
});

// Export class names for use in component templates
export const spinnerClass = styles.spinner;
export const spinnerBoxClass = styles['spinner-box'];
export const spinnerIconClass = styles['spinner-icon'];

/**
 * Generate all classes for Spinner component
 * This is the single source of truth for all Spinner styling
 * Everything is class-based - no data attributes or inline styles
 * @param {SpinnerVariants & { className?: string }} props
 * @returns {string}
 */
export function getSpinnerClasses(props) {
  const { className, ...cvaProps } = props;

  const classes = [spinnerStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
