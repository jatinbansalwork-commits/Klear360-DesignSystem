import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import labelStyles from './formLabel.module.css';
// @ts-expect-error - CSS modules may not have type definitions in build
import hintStyles from './formHint.module.css';

/** @typedef {import('./baseInputTokens').BaseInputSize} FormSize */
/** @typedef {'top' | 'left'} FormLabelPosition */
/** @typedef {'help' | 'error' | 'success'} FormHintType */

/* ── Token maps (ported from React formTokens.ts). Consumed by the Svelte
 *    FormLabel/FormHint to drive the migrated `Text` component. ── */

export const labelTextSize = /** @type {const} */ ({
  top: { xsmall: 'small', small: 'small', medium: 'small', large: 'medium' },
  left: { xsmall: 'small', small: 'small', medium: 'medium', large: 'large' },
});

/** @type {Record<FormSize, 'small' | 'medium'>} */
export const labelOptionalIndicatorTextSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

/** @type {Record<FormSize, string>} */
export const labelTextColor = {
  xsmall: 'surface.text.gray.muted',
  small: 'surface.text.gray.muted',
  medium: 'surface.text.gray.subtle',
  large: 'surface.text.gray.subtle',
};

/** @type {Record<FormSize, 'small' | 'medium'>} */
export const hintTextSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

/** @type {Record<FormSize, 'small' | 'medium'>} */
export const hintIconSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

/** @type {Record<FormHintType, string>} */
export const hintTextColor = {
  help: 'surface.text.gray.muted',
  error: 'feedback.text.negative.intense',
  success: 'feedback.text.positive.intense',
};

/* ── Label CVA ── */

export const formLabelCva = cva(labelStyles.label, {
  variants: {
    position: {
      top: null,
      left: labelStyles['label-left'],
    },
    size: {
      xsmall: labelStyles['size-xsmall'],
      small: labelStyles['size-small'],
      medium: labelStyles['size-medium'],
      large: labelStyles['size-large'],
    },
  },
  defaultVariants: {
    position: 'top',
    size: 'medium',
  },
});

/**
 * @param {{ position?: FormLabelPosition, size?: FormSize }} props
 * @returns {string}
 */
export function getFormLabelClasses(props) {
  return formLabelCva(props);
}

export const formLabelInnerCva = cva(labelStyles['label-inner'], {
  variants: {
    position: {
      top: null,
      left: labelStyles['label-left'],
    },
    size: {
      xsmall: labelStyles['size-xsmall'],
      small: labelStyles['size-small'],
      medium: labelStyles['size-medium'],
      large: labelStyles['size-large'],
    },
  },
  defaultVariants: {
    position: 'top',
    size: 'medium',
  },
});

/**
 * @param {{ position?: FormLabelPosition, size?: FormSize }} props
 * @returns {string}
 */
export function getFormLabelInnerClasses(props) {
  return formLabelInnerCva(props);
}

/* ── Hint CVA ── */

export const formHintCva = cva(hintStyles.hint, {
  variants: {
    size: {
      xsmall: null,
      small: null,
      medium: null,
      large: hintStyles['size-large'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * @param {{ size?: FormSize }} props
 * @returns {string}
 */
export function getFormHintClasses(props) {
  return formHintCva(props);
}

/**
 * Structural label/hint classes referenced only inside templates. Calling this
 * from the Svelte components prevents CSS-module tree-shaking.
 * @returns {{
 *   labelTextGroup: string,
 *   labelTextGroupTight: string,
 *   labelSuffix: string,
 *   labelTrailing: string,
 *   labelLeft: string,
 *   hintWrapper: string,
 *   hintIcon: string,
 *   hintTextLargeWithIcon: string,
 * }}
 */
export function getFormTemplateClasses() {
  return {
    labelTextGroup: labelStyles['label-text-group'],
    labelTextGroupTight: labelStyles['necessity-tight'],
    labelSuffix: labelStyles['label-suffix'],
    labelTrailing: labelStyles['label-trailing'],
    labelLeft: labelStyles['label-left'],
    hintWrapper: hintStyles['hint-wrapper'],
    hintIcon: hintStyles['hint-icon'],
    hintTextLargeWithIcon: hintStyles['hint-text-large-with-icon'],
  };
}
