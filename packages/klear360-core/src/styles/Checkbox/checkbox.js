import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './checkbox.module.css';

/** @typedef {'small' | 'medium' | 'large'} CheckboxSize */
/** @typedef {'default' | 'disabled' | 'negative'} CheckboxIconVariant */

/**
 * @typedef {Object} CheckboxIconVariants
 * @property {CheckboxSize} [size]
 * @property {CheckboxIconVariant} [variant]
 * @property {boolean} [isChecked]
 * @property {boolean} [isIndeterminate]
 */

/**
 * Icon-wrapper (the visible box) classes. Combines `size` (width/height +
 * border-width + small padding) with `variant` × `isChecked` compounds that
 * drive background-color and border-color. `isIndeterminate` only affects the
 * small padding-top (suppressed when indeterminate, mirroring React).
 */
export const checkboxIconCva = cva(styles.icon, {
  variants: {
    size: {
      small: styles['icon-small'],
      medium: styles['icon-medium'],
      large: styles['icon-large'],
    },
    variant: {
      default: null,
      disabled: null,
      negative: null,
    },
    isChecked: {
      true: styles.checked,
      false: styles.unchecked,
    },
    isIndeterminate: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    { variant: 'default', isChecked: true, class: styles['default-checked'] },
    { variant: 'default', isChecked: false, class: styles['default-unchecked'] },
    { variant: 'disabled', isChecked: true, class: styles['disabled-checked'] },
    { variant: 'disabled', isChecked: false, class: styles['disabled-unchecked'] },
    { variant: 'negative', isChecked: true, class: styles['negative-checked'] },
    { variant: 'negative', isChecked: false, class: styles['negative-unchecked'] },
    { size: 'small', isIndeterminate: false, class: styles['icon-small-pad'] },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'default',
    isChecked: false,
    isIndeterminate: false,
  },
});

/**
 * @param {CheckboxIconVariants} props
 * @returns {string}
 */
export function getCheckboxIconClasses(props) {
  return checkboxIconCva(props);
}

/**
 * Resolve the icon variant from disabled/negative flags (React precedence).
 * @param {boolean} [isDisabled]
 * @param {boolean} [isNegative]
 * @returns {CheckboxIconVariant}
 */
export function getCheckboxIconVariant(isDisabled, isNegative) {
  if (isDisabled) return 'disabled';
  if (isNegative) return 'negative';
  return 'default';
}

/**
 * @typedef {Object} CheckboxSvgVariants
 * @property {CheckboxSize} [size]
 * @property {boolean} [isDisabled]
 */

export const checkboxSvgCva = cva(styles.svg, {
  variants: {
    size: {
      small: styles['svg-small'],
      medium: styles['svg-medium'],
      large: styles['svg-large'],
    },
    isDisabled: {
      true: styles['svg-disabled'],
      false: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    isDisabled: false,
  },
});

/**
 * @param {CheckboxSvgVariants} props
 * @returns {string}
 */
export function getCheckboxSvgClasses(props) {
  return checkboxSvgCva(props);
}

/**
 * @typedef {Object} CheckboxTitleVariants
 * @property {CheckboxSize} [size]
 * @property {boolean} [isDisabled]
 */

export const checkboxTitleCva = cva(styles.title, {
  variants: {
    size: {
      small: styles['title-small'],
      medium: styles['title-medium'],
      large: styles['title-large'],
    },
    isDisabled: {
      true: styles['title-disabled'],
      false: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    isDisabled: false,
  },
});

/**
 * @param {CheckboxTitleVariants} props
 * @returns {string}
 */
export function getCheckboxTitleClasses(props) {
  return checkboxTitleCva(props);
}

/**
 * @typedef {Object} CheckboxSupportVariants
 * @property {CheckboxSize} [size]
 */

/**
 * Support-text block wrapper — carries the size-keyed left spacing only.
 * Font styling lives on the inline `.support-text` child (see below) so the
 * wrapper can establish React's taller line box for correct vertical leading.
 */
export const checkboxSupportCva = cva(styles.support, {
  variants: {
    size: {
      small: styles['support-spacing-small'],
      medium: styles['support-spacing-medium'],
      large: styles['support-spacing-large'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * @param {CheckboxSupportVariants} props
 * @returns {string}
 */
export function getCheckboxSupportClasses(props) {
  return checkboxSupportCva(props);
}

/** Inline support-text — caption font/line-height + color. */
export const checkboxSupportTextCva = cva(styles['support-text'], {
  variants: {
    size: {
      small: styles['support-small'],
      medium: styles['support-medium'],
      large: styles['support-large'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * @param {CheckboxSupportVariants} props
 * @returns {string}
 */
export function getCheckboxSupportTextClasses(props) {
  return checkboxSupportTextCva(props);
}

/**
 * @typedef {Object} CheckboxHintVariants
 * @property {CheckboxSize} [size]
 * @property {'help' | 'error'} [type]
 */

export const checkboxHintCva = cva(styles.hint, {
  variants: {
    size: {
      small: styles['hint-small'],
      medium: styles['hint-medium'],
      large: styles['hint-large'],
    },
    type: {
      help: styles['hint-help'],
      error: styles['hint-error'],
    },
  },
  compoundVariants: [
    // React offsets the large error Text 2px down to align with the larger icon.
    { size: 'large', type: 'error', class: styles['hint-large-error'] },
  ],
  defaultVariants: {
    size: 'medium',
    type: 'help',
  },
});

/**
 * @param {CheckboxHintVariants} props
 * @returns {string}
 */
export function getCheckboxHintClasses(props) {
  return checkboxHintCva(props);
}

/**
 * @typedef {Object} CheckboxHintWrapperVariants
 * @property {CheckboxSize} [size]
 */

/**
 * Form-hint wrapper classes — combines the structural `hint-wrapper` (flex row)
 * with the size-keyed top spacing that mirrors React's `hintMarginTop`.
 */
export const checkboxHintWrapperCva = cva(styles['hint-wrapper'], {
  variants: {
    size: {
      small: styles['hint-wrapper-spacing-small'],
      medium: styles['hint-wrapper-spacing-medium'],
      large: styles['hint-wrapper-spacing-large'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * @param {CheckboxHintWrapperVariants} props
 * @returns {string}
 */
export function getCheckboxHintWrapperClasses(props) {
  return checkboxHintWrapperCva(props);
}

/**
 * Get template/structural classes — call from Svelte to prevent tree-shaking.
 * @returns {{
 *   checkbox: string,
 *   label: string,
 *   field: string,
 *   row: string,
 *   input: string,
 *   fade: string,
 *   fadeShown: string,
 *   fadeIn: string,
 *   fadeOut: string,
 *   hintWrapper: string,
 *   hintIcon: string,
 * }}
 */
export function getCheckboxTemplateClasses() {
  return {
    checkbox: styles.checkbox,
    label: styles.label,
    field: styles.field,
    row: styles.row,
    input: styles.input,
    fade: styles.fade,
    fadeShown: styles['fade-shown'],
    fadeIn: styles['fade-in'],
    fadeOut: styles['fade-out'],
    hintWrapper: styles['hint-wrapper'],
    hintIcon: styles['hint-icon'],
  };
}

/* ───────────────────────── CheckboxGroup ───────────────────────── */

/**
 * @typedef {Object} CheckboxGroupFieldVariants
 * @property {'top' | 'left'} [labelPosition]
 */

export const checkboxGroupFieldCva = cva(styles['group-field'], {
  variants: {
    labelPosition: {
      top: styles['field-top'],
      left: styles['field-left'],
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

/**
 * @param {CheckboxGroupFieldVariants} props
 * @returns {string}
 */
export function getCheckboxGroupFieldClasses(props) {
  return checkboxGroupFieldCva(props);
}

/**
 * @typedef {Object} CheckboxGroupOptionsVariants
 * @property {'vertical' | 'horizontal'} [orientation]
 * @property {CheckboxSize} [size]
 * @property {'nowrap' | 'wrap' | 'wrap-reverse'} [flexWrap]
 */

export const checkboxGroupOptionsCva = cva(styles.options, {
  variants: {
    orientation: {
      vertical: styles['options-vertical'],
      horizontal: styles['options-horizontal'],
    },
    size: {
      small: styles['gap-small'],
      medium: styles['gap-medium'],
      large: styles['gap-large'],
    },
    flexWrap: {
      nowrap: styles['flex-wrap-nowrap'],
      wrap: styles['flex-wrap-wrap'],
      'wrap-reverse': styles['flex-wrap-wrap-reverse'],
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'medium',
    flexWrap: 'nowrap',
  },
});

/**
 * @param {CheckboxGroupOptionsVariants} props
 * @returns {string}
 */
export function getCheckboxGroupOptionsClasses(props) {
  return checkboxGroupOptionsCva(props);
}

/**
 * @param {CheckboxSize} size
 * @returns {string}
 */
export function getCheckboxGroupLabelSizeClass(size) {
  /** @type {Record<CheckboxSize, string>} */
  const map = {
    small: styles['group-label-small'],
    medium: styles['group-label-medium'],
    large: styles['group-label-large'],
  };
  return map[size];
}

/**
 * Get group template/structural classes — call from Svelte to prevent tree-shaking.
 * @returns {{
 *   groupLabel: string,
 *   labelRow: string,
 *   labelSuffix: string,
 *   labelTrailing: string,
 *   necessityRequired: string,
 *   necessityOptional: string,
 *   hint: string,
 *   hintHelp: string,
 *   hintError: string,
 *   hintWrapper: string,
 *   hintIcon: string,
 *   srOnly: string,
 * }}
 */
export function getCheckboxGroupTemplateClasses() {
  return {
    groupLabel: styles['group-label'],
    labelRow: styles['label-row'],
    labelSuffix: styles['label-suffix'],
    labelTrailing: styles['label-trailing'],
    necessityRequired: styles['necessity-required'],
    necessityOptional: styles['necessity-optional'],
    hint: styles.hint,
    hintHelp: styles['hint-help'],
    hintError: styles['hint-error'],
    hintWrapper: styles['hint-wrapper'],
    hintIcon: styles['hint-icon'],
    srOnly: styles['sr-only'],
  };
}
