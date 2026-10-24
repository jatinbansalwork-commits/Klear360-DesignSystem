/**
 * CVA class map for web BaseButton — aligned with klear360-core Button styles (reference only).
 */
import { cva } from 'class-variance-authority';
import styles from './BaseButton.module.scss';

export type BaseButtonModuleVariants = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?:
    | 'primary'
    | 'white'
    | 'positive'
    | 'negative'
    | 'information'
    | 'notice'
    | 'neutral'
    | 'transparent';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isIconOnly?: boolean;
};

const baseButtonModuleStyles = cva(styles.btn, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      tertiary: styles.tertiary,
    },
    color: {
      primary: styles['color-primary'],
      white: styles['color-white'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      information: styles['color-information'],
      notice: styles['color-notice'],
      neutral: styles['color-neutral'],
      transparent: styles['color-transparent'],
    },
    size: {
      xsmall: styles.xsmall,
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    isDisabled: {
      true: styles['cursor-not-allowed'],
      false: styles['cursor-pointer'],
    },
    isFullWidth: {
      true: styles['width-full'],
      false: '',
    },
    isIconOnly: {
      true: styles['icon-only'],
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    color: 'primary',
    size: 'medium',
    isDisabled: false,
    isFullWidth: false,
    isIconOnly: false,
  },
});

export const getBaseButtonModuleClasses = (
  props: BaseButtonModuleVariants & { className?: string },
): string => {
  const { className, ...cvaProps } = props;
  return [baseButtonModuleStyles(cvaProps), className].filter(Boolean).join(' ');
};
