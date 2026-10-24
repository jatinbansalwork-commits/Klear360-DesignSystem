import type { SwitchProps } from './types';
import styles from './Switch.module.scss';

export const getSwitchThumbWrapperClasses = (
  size: NonNullable<SwitchProps['size']>,
): string => [styles.thumb, styles[`size-${size}`]].filter(Boolean).join(' ');

export const getAnimatedThumbModuleClasses = ({
  isChecked,
  isPressed,
}: {
  isChecked?: boolean;
  isPressed?: boolean;
}): string =>
  [
    styles['animated-thumb'],
    isChecked ? styles.checked : null,
    isPressed ? styles.pressed : null,
  ]
    .filter(Boolean)
    .join(' ');

export const getAnimatedThumbDataAttributes = (
  isDisabled?: boolean,
): { 'data-disabled'?: true } => (isDisabled ? { 'data-disabled': true } : {});

export const getSwitchThumbIconModuleClasses = ({
  size,
  isEffectivelyChecked,
}: {
  size: NonNullable<SwitchProps['size']>;
  isEffectivelyChecked: boolean;
}): string =>
  [
    styles['thumb-icon'],
    styles[`size-${size}`],
    isEffectivelyChecked ? styles['effective-checked'] : null,
  ]
    .filter(Boolean)
    .join(' ');
