import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './inputGroup.module.css';

/** @typedef {'top' | 'left'} InputGroupLabelPosition */

/**
 * @typedef {Object} InputGroupFieldVariants
 * @property {InputGroupLabelPosition} [labelPosition]
 */

/**
 * Classes for the label + inputs box. `left` switches to a row layout on desktop
 * (`@media (min-width: 768px)`); on mobile it falls back to the column layout.
 */
export const inputGroupFieldCva = cva(styles['field-box'], {
  variants: {
    labelPosition: {
      top: null,
      left: styles['field-box-left'],
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

/**
 * @param {InputGroupFieldVariants} props
 * @returns {string}
 */
export function getInputGroupFieldClasses(props) {
  return inputGroupFieldCva(props);
}

/*
 * Left-label hint indent per size (mirrors React `formHintLeftLabelMarginLeft`):
 * xsmall/small/medium → 136px, large → 192px. The margin only applies on desktop
 * (the class carries the value inside the `@media` query).
 */
/** @type {Record<import('../Input/baseInputTokens').BaseInputSize, string>} */
const hintIndentBySize = {
  xsmall: styles['hint-indent-medium'],
  small: styles['hint-indent-medium'],
  medium: styles['hint-indent-medium'],
  large: styles['hint-indent-large'],
};

/**
 * @param {import('../Input/baseInputTokens').BaseInputSize} size
 * @returns {string}
 */
export function getInputGroupHintIndentClass(size) {
  return hintIndentBySize[size];
}

/**
 * Structural classes referenced only inside Svelte templates. Calling this from
 * the component prevents CSS-module tree-shaking from dropping them (and the
 * corner-rounding rules scoped under `.input-group`).
 * @returns {{
 *   inputGroup: string,
 *   group: string,
 *   fieldBox: string,
 *   inputsWrapper: string,
 *   inputRow: string,
 *   hintBox: string,
 *   hintInner: string,
 * }}
 */
export function getInputGroupTemplateClasses() {
  return {
    inputGroup: styles['input-group'],
    group: styles.group,
    fieldBox: styles['field-box'],
    inputsWrapper: styles['inputs-wrapper'],
    inputRow: styles['input-row'],
    hintBox: styles['hint-box'],
    hintInner: styles['hint-inner'],
  };
}
