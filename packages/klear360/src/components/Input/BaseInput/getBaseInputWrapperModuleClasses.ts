import { cva } from 'class-variance-authority';
import type { BaseInputWrapperProps } from './types';
import styles from './BaseInput.module.scss';

const animatedBaseInputWrapperCva = cva(styles['input-wrapper'], {
  variants: {
    validationState: {
      none: null,
      error: styles['validation-error'],
      success: null,
    },
    borderRadius: {
      small: null,
      medium: styles['radius-medium'],
    },
    isTableInputCell: {
      true: styles['table-input-cell'],
      false: null,
    },
    isTextArea: {
      true: styles['text-area-align'],
      false: null,
    },
    isDropdownTrigger: {
      true: styles['dropdown-trigger-height'],
      false: null,
    },
  },
  defaultVariants: {
    validationState: 'none',
    borderRadius: 'small',
    isTableInputCell: false,
    isTextArea: false,
    isDropdownTrigger: false,
  },
});

type AnimatedBaseInputWrapperClassProps = Pick<
  BaseInputWrapperProps,
  'validationState' | 'borderRadius' | 'isTableInputCell' | 'isTextArea' | 'isDropdownTrigger'
>;

export const getAnimatedBaseInputWrapperModuleClasses = (
  props: AnimatedBaseInputWrapperClassProps,
): string =>
  animatedBaseInputWrapperCva({
    validationState:
      props.validationState === 'error'
        ? 'error'
        : props.validationState === 'success'
        ? 'success'
        : 'none',
    borderRadius: props.borderRadius === 'medium' ? 'medium' : 'small',
    isTableInputCell: Boolean(props.isTableInputCell),
    isTextArea: Boolean(props.isTextArea),
    isDropdownTrigger: Boolean(props.isDropdownTrigger),
  });

export const getBaseInputWrapperDataAttributes = (
  isDisabled: boolean,
): { 'data-disabled'?: true } => (isDisabled ? { 'data-disabled': true } : {});

export const getBaseInputTagSlotClass = (): string => styles.tagSlotContainer;

/** @deprecated Use getAnimatedBaseInputWrapperModuleClasses */
export const getBaseInputWrapperClass = (): string => styles['input-wrapper'];

export const getBaseInputExpandAnimationClass = (): string => styles.expandAnimation;

export const getBaseInputCollapseAnimationClass = (): string => styles.collapseAnimation;
