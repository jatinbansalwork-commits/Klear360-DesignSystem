import React from 'react';
import type { AvatarButtonProps } from './types';
import { getAvatarButtonClasses } from './getAvatarModuleClasses';
import styles from './Avatar.module.scss';

type WebAvatarButtonProps = Omit<AvatarButtonProps, 'as' | 'onClick'> & {
  isInteractive?: boolean;
  className?: string;
  children?: React.ReactNode;
  as?: 'a' | 'button' | 'div';
  accessibilityProps?: React.HTMLAttributes<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: 'button';
};

const StyledAvatarButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLDivElement,
  WebAvatarButtonProps
>(
  (
    {
      size = 'medium',
      variant = 'circle',
      color = 'neutral',
      isSelected,
      isInteractive,
      className,
      children,
      as = 'button',
      href,
      target,
      rel,
      type = 'button',
      accessibilityProps,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      getAvatarButtonClasses({ color, isSelected, isInteractive }),
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      variant === 'square' ? styles[`square-${size}`] : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (as === 'a') {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={classes}
          {...accessibilityProps}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    if (as === 'div') {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={classes}
          {...accessibilityProps}
          {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        >
          {children}
        </div>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        {...accessibilityProps}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

StyledAvatarButton.displayName = 'StyledAvatarButton';

export { StyledAvatarButton };
