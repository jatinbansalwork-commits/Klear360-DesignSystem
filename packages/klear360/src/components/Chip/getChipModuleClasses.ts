import type { ChipGroupProps } from './ChipGroup';
import styles from './Chip.module.scss';

type ChipInnerClassProps = {
  isChecked?: boolean;
  isDisabled?: boolean;
  color?: ChipGroupProps['color'];
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const getChipAnimatedModuleClasses = (isPressed?: boolean): string =>
  [styles.animatedChip, isPressed ? styles.pressed : undefined].filter(Boolean).join(' ');

export const getChipInnerModuleClasses = ({
  isChecked,
  isDisabled,
  color,
}: ChipInnerClassProps): string => {
  const classes = [styles.chipInner];

  if (isDisabled && isChecked && color) {
    classes.push(styles[`inner${capitalize(color)}Disabled` as keyof typeof styles]);
  } else if (isDisabled && !isChecked) {
    classes.push(styles.innerUncheckedDisabled);
  } else if (isChecked && color) {
    classes.push(styles[`inner${capitalize(color)}Checked` as keyof typeof styles]);
  } else {
    classes.push(styles.innerUnchecked);
  }

  return classes.filter(Boolean).join(' ');
};
