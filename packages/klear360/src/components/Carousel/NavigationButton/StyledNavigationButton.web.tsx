import React from 'react';
import styles from './NavigationButton.module.scss';
import type { NavigationButtonProps } from './types';

type StyledNavigationButtonProps = Pick<NavigationButtonProps, 'variant'> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledNavigationButton = React.forwardRef<HTMLButtonElement, StyledNavigationButtonProps>(
  ({ variant = 'filled', className, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      data-variant={variant}
      className={[styles.root, className].filter(Boolean).join(' ')}
      {...rest}
    />
  ),
);

StyledNavigationButton.displayName = 'StyledNavigationButton';

export { StyledNavigationButton };
