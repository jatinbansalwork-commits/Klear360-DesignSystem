import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './radio.module.css';
// @ts-expect-error - CSS modules may not have type definitions in build
import groupStyles from './radioGroup.module.css';

/** @typedef {'small' | 'medium' | 'large'} RadioSize */
/** @typedef {'default' | 'disabled' | 'negative'} RadioVariant */

// ── RadioIcon wrapper: size + (variant × checked) compound colors ──

/**
 * @typedef {Object} RadioIconWrapperVariants
 * @property {RadioSize} [size]
 * @property {RadioVariant} [variant]
 * @property {boolean} [isChecked]
 */

/**
 * CVA for the radio icon (circle) wrapper. `size` drives dimensions; the
 * `variant` × `isChecked` compound drives background + border color, mirroring
 * `radioIconColors` from the React source.
 */
export const radioIconWrapperStyles = cva(styles.iconWrapper, {
  variants: {
    size: {
      small: styles.iconSmall,
      medium: styles.iconMedium,
      large: styles.iconLarge,
    },
    variant: {
      default: null,
      disabled: null,
      negative: null,
    },
    isChecked: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    { variant: 'default', isChecked: false, class: styles.defaultUnchecked },
    { variant: 'default', isChecked: true, class: styles.defaultChecked },
    { variant: 'disabled', isChecked: false, class: styles.disabledUnchecked },
    { variant: 'disabled', isChecked: true, class: styles.disabledChecked },
    { variant: 'negative', isChecked: false, class: styles.negativeUnchecked },
    { variant: 'negative', isChecked: true, class: styles.negativeChecked },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'default',
    isChecked: false,
  },
});

/**
 * @param {RadioIconWrapperVariants} props
 * @returns {string}
 */
export function getRadioIconWrapperClasses(props) {
  return radioIconWrapperStyles(props);
}

/**
 * Resolve the icon variant from disabled/negative flags.
 * Precedence matches React: negative wins over disabled.
 * @param {boolean} [isDisabled]
 * @param {boolean} [isNegative]
 * @returns {RadioVariant}
 */
export function getRadioIconVariant(isDisabled, isNegative) {
  if (isNegative) return 'negative';
  if (isDisabled) return 'disabled';
  return 'default';
}

// ── Per-radio title (label text) size ──

export const radioTitleStyles = cva(styles.title, {
  variants: {
    size: {
      small: styles.titleSmall,
      medium: styles.titleMedium,
      large: styles.titleLarge,
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * @param {{ size?: RadioSize }} props
 * @returns {string}
 */
export function getRadioTitleClasses(props) {
  return radioTitleStyles(props);
}

// ── Per-radio support text (helpText) offset + size ──

export const radioSupportTextWrapperStyles = cva(styles.supportTextWrapper, {
  variants: {
    size: {
      small: styles.supportSmall,
      medium: styles.supportMedium,
      large: styles.supportLarge,
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * @param {{ size?: RadioSize }} props
 * @returns {string}
 */
export function getRadioSupportTextWrapperClasses(props) {
  return radioSupportTextWrapperStyles(props);
}

export const radioSupportTextStyles = cva(styles.supportText, {
  variants: {
    size: {
      small: styles.supportTextSizeSmall,
      medium: styles.supportTextSizeMedium,
      large: styles.supportTextSizeLarge,
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * @param {{ size?: RadioSize }} props
 * @returns {string}
 */
export function getRadioSupportTextClasses(props) {
  return radioSupportTextStyles(props);
}

/**
 * Structural classes for the Radio template. Calling this from the Svelte
 * component prevents tree-shaking from dropping classes only referenced in
 * the template (label, input, dot, etc.).
 * @returns {{
 *   radioWrapper: string,
 *   label: string,
 *   column: string,
 *   row: string,
 *   input: string,
 *   iconWrapper: string,
 *   dot: string,
 *   dotChecked: string,
 *   dotCircle: string,
 * }}
 */
export function getRadioTemplateClasses() {
  return {
    radioWrapper: styles.radioWrapper,
    label: styles.label,
    column: styles.column,
    row: styles.row,
    input: styles.input,
    iconWrapper: styles.iconWrapper,
    dot: styles.dot,
    dotChecked: styles.checked,
    dotCircle: styles.dotCircle,
  };
}

// ── RadioGroup styles ──

export const radioGroupFieldStyles = cva(groupStyles.radioGroupField, {
  variants: {
    labelPosition: {
      top: groupStyles.fieldTop,
      left: groupStyles.fieldLeft,
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

/**
 * @param {{ labelPosition?: 'top' | 'left' }} props
 * @returns {string}
 */
export function getRadioGroupFieldClasses(props) {
  return radioGroupFieldStyles(props);
}

export const radioGroupItemsStyles = cva(groupStyles.itemsContainer, {
  variants: {
    orientation: {
      vertical: groupStyles.orientationVertical,
      horizontal: groupStyles.orientationHorizontal,
    },
    size: {
      small: groupStyles.gapSmall,
      medium: groupStyles.gapMedium,
      large: groupStyles.gapLarge,
    },
    flexWrap: {
      nowrap: groupStyles['flex-wrap-nowrap'],
      wrap: groupStyles['flex-wrap-wrap'],
      'wrap-reverse': groupStyles['flex-wrap-wrap-reverse'],
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'medium',
    flexWrap: 'nowrap',
  },
});

/**
 * @param {{
 *   orientation?: 'vertical' | 'horizontal',
 *   size?: RadioSize,
 *   flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse',
 * }} props
 * @returns {string}
 */
export function getRadioGroupItemsClasses(props) {
  return radioGroupItemsStyles(props);
}

/**
 * @param {RadioSize} size
 * @param {'top' | 'left'} [labelPosition]
 * @returns {string}
 */
export function getRadioGroupLabelSizeClass(size, labelPosition = 'top') {
  if (labelPosition === 'left') {
    /** @type {Record<RadioSize, string>} */
    const leftMap = {
      small: `${groupStyles.labelLeft} ${groupStyles.labelLeftSmall}`,
      medium: `${groupStyles.labelLeft} ${groupStyles.labelLeftMedium}`,
      large: `${groupStyles.labelLeft} ${groupStyles.labelLeftLarge}`,
    };
    return leftMap[size];
  }
  /** @type {Record<RadioSize, string>} */
  const map = {
    small: groupStyles.labelSmall,
    medium: groupStyles.labelMedium,
    large: groupStyles.labelLarge,
  };
  return map[size];
}

/**
 * @param {RadioSize} size
 * @returns {string}
 */
export function getRadioGroupHintTextClass(size) {
  /** @type {Record<RadioSize, string>} */
  const map = {
    small: groupStyles.hintTextSmall,
    medium: groupStyles.hintTextMedium,
    large: groupStyles.hintTextLarge,
  };
  return map[size];
}

/**
 * @param {RadioSize} size
 * @returns {string}
 */
export function getRadioGroupHintMarginClass(size) {
  /** @type {Record<RadioSize, string>} */
  const map = {
    small: groupStyles.hintMarginSmall,
    medium: groupStyles.hintMarginMedium,
    large: groupStyles.hintMarginLarge,
  };
  return map[size];
}

/**
 * @returns {{
 *   groupLabel: string,
 *   necessityRequired: string,
 *   necessityOptional: string,
 *   helpText: string,
 *   errorText: string,
 *   hintWrapper: string,
 *   hintIcon: string,
 *   srOnly: string,
 * }}
 */
export function getRadioGroupTemplateClasses() {
  return {
    groupLabel: groupStyles.groupLabel,
    necessityRequired: groupStyles.necessityRequired,
    necessityOptional: groupStyles.necessityOptional,
    helpText: groupStyles.helpText,
    errorText: groupStyles.errorText,
    hintWrapper: groupStyles.hintWrapper,
    hintIcon: groupStyles.hintIcon,
    srOnly: groupStyles.srOnly,
  };
}
