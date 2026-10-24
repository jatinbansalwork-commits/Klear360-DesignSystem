import type { CheckboxRectProps } from './CheckboxIconWrapperStyles';
import styles from './Checkbox.module.scss';

type CheckboxIconClassProps = Pick<
  CheckboxRectProps,
  'isChecked' | 'isDisabled' | 'isNegative' | 'size' | 'isIndeterminate'
>;

export const getCheckboxIconModuleClasses = ({
  isChecked,
  isDisabled,
  isNegative,
  size,
  isIndeterminate,
}: CheckboxIconClassProps): string => {
  let variant: 'default' | 'disabled' | 'negative' = 'default';
  if (isDisabled) variant = 'disabled';
  if (isNegative) variant = 'negative';
  const checked = isChecked ? 'checked' : 'unchecked';

  return [
    styles.icon,
    styles[`icon-${size}`],
    size === 'small' && !isIndeterminate ? styles['icon-small-pad'] : undefined,
    styles[`${variant}-${checked}`],
  ]
    .filter(Boolean)
    .join(' ');
};
