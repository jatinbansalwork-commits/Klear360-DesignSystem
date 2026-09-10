import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import chipStyles from './chip.module.css';
// @ts-expect-error - CSS modules may not have type definitions in build
import chipGroupStyles from './chipGroup.module.css';

/** @typedef {'xsmall' | 'small' | 'medium' | 'large'} ChipSize */
/** @typedef {'primary' | 'positive' | 'negative'} ChipColor */

/**
 * @typedef {'unchecked' | 'primaryChecked' | 'positiveChecked' | 'negativeChecked' | 'uncheckedDisabled' | 'primaryDisabled' | 'positiveDisabled' | 'negativeDisabled'} ChipColorVariant
 */

// ── AnimatedChip (outer): border + scale animation ──

/**
 * @typedef {Object} AnimatedChipVariants
 * @property {ChipSize} [size]
 * @property {ChipColorVariant} [colorVariant]
 */

// Base class + shared outer border-width come from the chip module + utilities.
const animatedChipBase = [chipStyles.animatedChip, utilityClasses['border-width-thin']].join(' ');

export const animatedChipCva = cva(animatedChipBase, {
  variants: {
    size: {
      xsmall: utilityClasses['border-radius-small'],
      small: utilityClasses['border-radius-small'],
      medium: utilityClasses['border-radius-small'],
      large: utilityClasses['border-radius-medium'],
    },
    colorVariant: {
      unchecked: utilityClasses['border-interactive-border-gray-faded'],
      primaryChecked: utilityClasses['border-interactive-border-primary-default'],
      positiveChecked: utilityClasses['border-interactive-border-positive-default'],
      negativeChecked: utilityClasses['border-interactive-border-negative-default'],
      uncheckedDisabled: utilityClasses['border-interactive-border-gray-disabled'],
      primaryDisabled: utilityClasses['border-interactive-border-primary-disabled'],
      positiveDisabled: utilityClasses['border-interactive-border-positive-disabled'],
      negativeDisabled: utilityClasses['border-interactive-border-negative-disabled'],
    },
  },
  defaultVariants: {
    size: 'small',
    colorVariant: 'unchecked',
  },
});

/**
 * @param {AnimatedChipVariants} props
 * @returns {string}
 */
export function getAnimatedChipClasses(props) {
  return animatedChipCva(props);
}

// ── StyledChipWrapper (inner): background + inner border + hover ──

/**
 * @typedef {Object} ChipInnerVariants
 * @property {ChipSize} [size]
 * @property {ChipColorVariant} [colorVariant]
 * @property {boolean} [isDisabled]
 */

export const chipInnerCva = cva(chipStyles.chipInner, {
  variants: {
    size: {
      xsmall: [chipStyles.innerXsmall, utilityClasses['border-width-thinner']].join(' '),
      small: [chipStyles.innerSmall, utilityClasses['border-width-thinner']].join(' '),
      medium: [chipStyles.innerMedium, utilityClasses['border-width-thin']].join(' '),
      large: [chipStyles.innerLarge, utilityClasses['border-width-thin']].join(' '),
    },
    colorVariant: {
      unchecked: chipStyles.innerUnchecked,
      primaryChecked: chipStyles.innerPrimaryChecked,
      positiveChecked: chipStyles.innerPositiveChecked,
      negativeChecked: chipStyles.innerNegativeChecked,
      uncheckedDisabled: [chipStyles.innerUncheckedDisabled, chipStyles.disabled].join(' '),
      primaryDisabled: [chipStyles.innerPrimaryDisabled, chipStyles.disabled].join(' '),
      positiveDisabled: [chipStyles.innerPositiveDisabled, chipStyles.disabled].join(' '),
      negativeDisabled: [chipStyles.innerNegativeDisabled, chipStyles.disabled].join(' '),
    },
    isDisabled: {
      true: chipStyles.disabled,
      false: null,
    },
  },
  defaultVariants: {
    size: 'small',
    colorVariant: 'unchecked',
    isDisabled: false,
  },
});

/**
 * @param {ChipInnerVariants} props
 * @returns {string}
 */
export function getChipInnerClasses(props) {
  return chipInnerCva(props);
}

/** @returns {Record<string, string>} */
export function getChipTemplateClasses() {
  return {
    chipWrapper: chipStyles.chipWrapper,
    label: chipStyles.label,
    labelDisabled: chipStyles.labelDisabled,
    srOnly: chipStyles.srOnly,
    animatedChip: chipStyles.animatedChip,
    chipInner: chipStyles.chipInner,
    pressed: chipStyles.pressed,
    chipIcon: chipStyles.chipIcon,
    chipText: chipStyles.chipText,
  };
}

/**
 * @param {boolean} isChecked
 * @param {ChipColor | undefined} color
 * @param {boolean} isDisabled
 * @returns {ChipColorVariant}
 */
export function getChipColorVariant(isChecked, color, isDisabled) {
  if (isDisabled) {
    if (!isChecked) return 'uncheckedDisabled';
    switch (color) {
      case 'primary':
        return 'primaryDisabled';
      case 'positive':
        return 'positiveDisabled';
      case 'negative':
        return 'negativeDisabled';
      default:
        return 'uncheckedDisabled';
    }
  }
  if (!isChecked) return 'unchecked';
  switch (color) {
    case 'primary':
      return 'primaryChecked';
    case 'positive':
      return 'positiveChecked';
    case 'negative':
      return 'negativeChecked';
    default:
      return 'unchecked';
  }
}

/**
 * @param {boolean} isChecked
 * @param {ChipColor | undefined} color
 * @param {boolean} isDisabled
 * @returns {string}
 */
export function getChipTextColorToken(isChecked, color, isDisabled) {
  if (isDisabled) return 'interactive.text.gray.disabled';
  if (isChecked && color) return `interactive.text.${color}.normal`;
  return 'interactive.text.gray.subtle';
}

/**
 * @param {boolean} isChecked
 * @param {ChipColor | undefined} color
 * @param {boolean} isDisabled
 * @returns {string}
 */
export function getChipIconColorToken(isChecked, color, isDisabled) {
  if (isDisabled) return 'interactive.icon.gray.disabled';
  if (isChecked && color) return `interactive.icon.${color}.normal`;
  return 'interactive.icon.gray.subtle';
}

/**
 * @returns {{
 *   fontSize: Record<ChipSize, 75 | 100 | 200>,
 *   lineHeight: Record<ChipSize, 75 | 100 | 200>,
 *   letterSpacing: Record<ChipSize, 25 | 50>,
 * }}
 */
export function getChipTextSizes() {
  return {
    fontSize: { xsmall: 75, small: 100, medium: 200, large: 200 },
    lineHeight: { xsmall: 75, small: 100, medium: 200, large: 200 },
    letterSpacing: { xsmall: 50, small: 50, medium: 25, large: 25 },
  };
}

/** @returns {Record<ChipSize, 'small' | 'medium' | 'large'>} */
export function getChipIconSizes() {
  return { xsmall: 'small', small: 'small', medium: 'medium', large: 'large' };
}

// ── ChipGroup styles ──

/**
 * @typedef {Object} ChipGroupVariants
 * @property {ChipSize} [size]
 * @property {'top' | 'left'} [labelPosition]
 */

export const chipGroupFieldCva = cva(chipGroupStyles.chipGroupField, {
  variants: {
    labelPosition: {
      top: chipGroupStyles.labelTop,
      left: chipGroupStyles.labelLeft,
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

export const chipGroupGapCva = cva(chipGroupStyles.chipsContainer, {
  variants: {
    size: {
      xsmall: chipGroupStyles.gapXsmall,
      small: chipGroupStyles.gapSmall,
      medium: chipGroupStyles.gapMedium,
      large: chipGroupStyles.gapLarge,
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

/**
 * @param {{ labelPosition?: 'top' | 'left' }} props
 * @returns {string}
 */
export function getChipGroupFieldClasses(props) {
  return chipGroupFieldCva(props);
}

/**
 * @param {{ size?: ChipSize }} props
 * @returns {string}
 */
export function getChipGroupGapClasses(props) {
  return chipGroupGapCva(props);
}

/** @returns {Record<string, string>} */
export function getChipGroupTemplateClasses() {
  return {
    chipGroupField: chipGroupStyles.chipGroupField,
    groupLabel: chipGroupStyles.groupLabel,
    labelSmall: chipGroupStyles.labelSmall,
    labelMedium: chipGroupStyles.labelMedium,
    labelLarge: chipGroupStyles.labelLarge,
    necessityRequired: chipGroupStyles.necessityRequired,
    necessityOptional: chipGroupStyles.necessityOptional,
    helpText: chipGroupStyles.helpText,
    errorText: chipGroupStyles.errorText,
    srOnly: chipGroupStyles.srOnly,
  };
}

/**
 * @param {ChipSize} size
 * @returns {string}
 */
export function getChipGroupLabelSizeClass(size) {
  /** @type {Record<ChipSize, string>} */
  const map = {
    xsmall: chipGroupStyles.labelSmall,
    small: chipGroupStyles.labelMedium,
    medium: chipGroupStyles.labelLarge,
    large: chipGroupStyles.labelLarge,
  };
  return map[size];
}
