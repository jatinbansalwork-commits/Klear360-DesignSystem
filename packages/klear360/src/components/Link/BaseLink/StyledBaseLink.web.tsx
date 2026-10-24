import React from 'react';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './types';
import styles from './BaseLink.module.scss';
import { useTheme } from '~components/Klear360Provider';
import { useStyledProps } from '~components/Box/styledProps';

type WebStyledBaseLinkProps = StyledBaseLinkProps & {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

const StyledBaseLink = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  WebStyledBaseLinkProps
>((props, ref) => {
  const { theme } = useTheme();
  const styledPropsCSSObject = useStyledProps({ ...props, theme });
  const linkStyles = getStyledLinkStyles({ cursor: props.cursor });

  const {
    as,
    focusRingColor,
    setCurrentInteraction: _setCurrentInteraction,
    accessibilityProps,
    motionDuration: _motionDuration,
    motionEasing: _motionEasing,
    variant: _variant,
    className,
    style,
    children,
    title,
    href,
    target,
    rel,
    disabled,
    type,
    onClick,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
    onMouseDown,
    onMouseUp,
  } = props;

  const dataAttributes = Object.fromEntries(
    Object.entries(props).filter(([key]) => key.startsWith('data-')),
  );

  return React.createElement(
    as,
    {
      ref,
      className: [styles.base, className].filter(Boolean).join(' '),
      style: {
        ...linkStyles,
        ...(styledPropsCSSObject as React.CSSProperties),
        ...style,
        ['--base-link-focus-ring' as string]: focusRingColor,
      },
      href,
      target,
      rel,
      disabled,
      type,
      title,
      onClick,
      onBlur,
      onFocus,
      onMouseLeave,
      onMouseMove,
      onPointerDown,
      onPointerEnter,
      onTouchStart,
      onTouchEnd,
      onKeyDown,
      onMouseDown,
      onMouseUp,
      ...dataAttributes,
      ...accessibilityProps,
    },
    children,
  );
});

StyledBaseLink.displayName = 'StyledLink';

export default StyledBaseLink;
