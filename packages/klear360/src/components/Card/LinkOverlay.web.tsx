import React from 'react';
import type { LinkOverlayProps } from './types';
import styles from './Card.module.scss';

type WebLinkOverlayProps = LinkOverlayProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'a' | 'button';
  };

const LinkOverlay = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, WebLinkOverlayProps>(
  ({ as = 'a', className, children, ...rest }, ref) => {
    const classes = [styles.linkOverlay, className].filter(Boolean).join(' ');

    if (as === 'button') {
      return (
        <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={classes} {...rest}>
          {children}
        </button>
      );
    }

    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...rest}>
        {children}
      </a>
    );
  },
);

LinkOverlay.displayName = 'LinkOverlay';

export { LinkOverlay };
