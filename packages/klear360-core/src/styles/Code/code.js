import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './code.module.css';

/**
 * @typedef {Object} CodeVariants
 * @property {boolean} [isHighlighted]
 */

/** @typedef {'small' | 'medium'} CodeSize */

/**
 * Font size and line height types matching BaseText
 * @typedef {25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100} FontSize
 */
/**
 * @typedef {0 | 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100} LineHeight
 */

/**
 * Get Code font size and line height based on size prop
 * These values correspond to BaseText utility classes (font-size-25, font-size-75, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 * @param {CodeSize} [size]
 * @returns {{ fontSize: FontSize, lineHeight: LineHeight, letterSpacing: 100 }}
 */
export function getCodeFontSizeAndLineHeight(size = 'small') {
  switch (size) {
    case 'medium':
      return { fontSize: 75, lineHeight: 75, letterSpacing: 100 };
    case 'small':
      return { fontSize: 25, lineHeight: 25, letterSpacing: 100 };
    default:
      return { fontSize: 25, lineHeight: 25, letterSpacing: 100 };
  }
}

/**
 * Get Code color token based on isHighlighted and color props
 * Returns the color token string that BaseText CVA uses for colors
 * @param {{ isHighlighted: boolean, color?: string }} params
 * @returns {string}
 */
export function getCodeColor({ isHighlighted, color }) {
  if (isHighlighted) {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (color) {
        console.error(
          '[Klear360: Code]: `color` prop cannot be used without `isHighlighted={false}`',
        );
      }
    }
    return 'surface.text.gray.subtle';
  }

  if (color) {
    return color;
  }

  return 'surface.text.gray.normal';
}

export const codeStyles = cva(styles.base, {
  variants: {
    isHighlighted: {
      true: styles.highlighted,
      false: '',
    },
  },
  defaultVariants: {
    isHighlighted: true,
  },
});

/**
 * Generate all classes for Code component
 * This is the single source of truth for all Code styling
 * @param {CodeVariants & { className?: string }} props
 * @returns {string}
 */
export function getCodeClasses(props) {
  const { className, ...cvaProps } = props;

  const classes = [codeStyles(cvaProps), className].filter(Boolean).join(' ');

  return classes;
}
