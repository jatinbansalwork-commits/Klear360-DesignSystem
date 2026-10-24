import type { RadioRectProps } from './RadioIconWrapperStyles';
import styles from './Radio.module.scss';

const sizeClassMap = {
  small: styles.iconSmall,
  medium: styles.iconMedium,
  large: styles.iconLarge,
} as const;

export const getRadioIconModuleClasses = ({
  isChecked,
  isDisabled,
  isNegative,
  size,
}: Pick<RadioRectProps, 'isChecked' | 'isDisabled' | 'isNegative' | 'size'>): string => {
  let variant: 'default' | 'disabled' | 'negative' = 'default';
  if (isDisabled) variant = 'disabled';
  if (isNegative) variant = 'negative';
  const checked = isChecked ? 'Checked' : 'Unchecked';
  const variantClassKey = `${variant}${checked}` as keyof typeof styles;

  return [styles.iconWrapper, sizeClassMap[size], styles[variantClassKey]]
    .filter(Boolean)
    .join(' ');
};
