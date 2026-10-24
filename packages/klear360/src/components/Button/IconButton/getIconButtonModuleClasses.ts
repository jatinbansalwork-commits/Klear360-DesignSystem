import { cva } from 'class-variance-authority';
import type { IconButtonEmphasis } from './IconButton';
import type { StyledIconButtonProps } from './types';
import styles from './IconButton.module.scss';

type IconButtonSize = NonNullable<StyledIconButtonProps['size']>;

const iconButtonStyles = cva(styles['icon-button'], {
  variants: {
    emphasis: {
      intense: styles['emphasis-intense'],
      subtle: styles['emphasis-subtle'],
      moderate: styles['emphasis-moderate'],
    },
    size: {
      small: null,
      medium: null,
      large: null,
    },
    isHighlighted: {
      true: styles.highlighted,
      false: null,
    },
  },
  compoundVariants: [
    { isHighlighted: true, size: 'small', class: styles['highlighted-small'] },
    { isHighlighted: true, size: 'medium', class: styles['highlighted-medium'] },
    { isHighlighted: true, emphasis: 'intense', class: styles['highlighted-intense'] },
    { isHighlighted: true, emphasis: 'subtle', class: styles['highlighted-subtle'] },
    { emphasis: 'moderate', size: 'small', class: styles['moderate-small'] },
    { emphasis: 'moderate', size: 'medium', class: styles['moderate-medium'] },
  ],
  defaultVariants: {
    emphasis: 'intense',
    size: 'medium',
    isHighlighted: false,
  },
});

export const getIconButtonModuleClasses = (props: {
  emphasis: IconButtonEmphasis;
  size: IconButtonSize;
  isHighlighted: boolean;
  className?: string;
}): string => {
  const { className, ...cvaProps } = props;
  return [iconButtonStyles(cvaProps), className].filter(Boolean).join(' ');
};
