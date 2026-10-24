import React from 'react';
import styles from './IndicatorButton.module.scss';
import type { IndicatorButtonProps } from './types';

type StyledIndicatorButtonProps = Omit<IndicatorButtonProps, 'accessibilityLabel'> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledIndicatorButton = React.forwardRef<HTMLButtonElement, StyledIndicatorButtonProps>(
  ({ variant, isActive, className, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      data-variant={variant}
      data-active={isActive ? true : undefined}
      className={[styles.root, className].filter(Boolean).join(' ')}
      {...rest}
    />
  ),
);

StyledIndicatorButton.displayName = 'StyledIndicatorButton';

export { StyledIndicatorButton };
