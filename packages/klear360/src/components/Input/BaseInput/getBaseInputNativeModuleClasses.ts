import { cva } from 'class-variance-authority';
import type { BaseInputProps } from './BaseInput';
import type { StyledBaseInputProps } from './types';
import { getInputVisualsToBeRendered } from './BaseInputVisuals';
import styles from './BaseInput.module.scss';

const baseInputElementCva = cva(styles.input, {
  variants: {
    size: {
      xsmall: styles['size-xsmall'],
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
    },
    valueComponentType: {
      text: null,
      heading: styles['value-heading'],
    },
    textAlign: {
      left: styles['text-left'],
      center: styles['text-center'],
      right: styles['text-right'],
    },
  },
  defaultVariants: {
    size: 'medium',
    valueComponentType: 'text',
  },
});

const leftPadBySize = {
  xsmall: styles['pad-left-xsmall'],
  small: styles['pad-left-small'],
  medium: styles['pad-left-medium'],
  large: styles['pad-left-large'],
} as const;

const rightPadBySize = {
  xsmall: styles['pad-right-xsmall'],
  small: styles['pad-right-small'],
  medium: styles['pad-right-medium'],
  large: styles['pad-right-large'],
} as const;

type BaseInputNativeClassProps = Pick<
  StyledBaseInputProps,
  | 'leadingIcon'
  | 'prefix'
  | 'trailingInteractionElement'
  | 'leadingInteractionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'textAlign'
  | 'valueComponentType'
  | 'hasLeadingDropdown'
> & {
  $size: NonNullable<BaseInputProps['size']>;
};

export const getBaseInputNativeModuleClasses = (props: BaseInputNativeClassProps): string => {
  const {
    $size: size,
    valueComponentType,
    textAlign,
    hasLeadingDropdown,
    leadingIcon,
    prefix,
    trailingInteractionElement,
    leadingInteractionElement,
    suffix,
    trailingIcon,
  } = props;

  const { hasLeadingIcon, hasPrefix, hasTrailingInteractionElement, hasSuffix, hasTrailingIcon } =
    getInputVisualsToBeRendered({
      leadingIcon,
      prefix,
      trailingInteractionElement,
      leadingInteractionElement,
      suffix,
      trailingIcon,
      size,
    });

  const hasLeadingVisual = hasLeadingIcon || hasPrefix || Boolean(hasLeadingDropdown);
  const hasTrailingVisual = hasTrailingInteractionElement || hasSuffix || hasTrailingIcon;

  const leftPad = hasLeadingVisual ? styles['has-leading'] : leftPadBySize[size];
  const rightPad = hasTrailingVisual ? styles['has-trailing'] : rightPadBySize[size];

  return [
    baseInputElementCva({
      size,
      valueComponentType,
      textAlign: textAlign ?? 'left',
    }),
    leftPad,
    rightPad,
  ]
    .filter(Boolean)
    .join(' ');
};
