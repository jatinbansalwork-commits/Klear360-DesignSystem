import { cva } from 'class-variance-authority';
import type { SegmentedControlSize } from './types';
import styles from './SegmentedControl.module.scss';

const containerStyles = cva(styles.container, {
  variants: {
    size: {
      small: styles.containerSizeSmall,
      medium: styles.containerSizeMedium,
      large: styles.containerSizeLarge,
    },
  },
  defaultVariants: { size: 'medium' },
});

const itemStyles = cva(styles.item, {
  variants: {
    size: {
      small: styles.itemSizeSmall,
      medium: styles.itemSizeMedium,
      large: styles.itemSizeLarge,
    },
    isSelected: {
      true: styles.itemSelected,
      false: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    isSelected: false,
  },
});

export const getSegmentedControlContainerClasses = (size: SegmentedControlSize): string =>
  containerStyles({ size });

export const getSegmentedControlItemClasses = (props: {
  size: SegmentedControlSize;
  isSelected: boolean;
  className?: string;
}): string => {
  const { className, ...cvaProps } = props;
  return [itemStyles(cvaProps), className].filter(Boolean).join(' ');
};
