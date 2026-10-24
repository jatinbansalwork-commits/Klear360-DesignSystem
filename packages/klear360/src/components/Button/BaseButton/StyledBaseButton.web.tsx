import React from 'react';
import type { StyledBaseButtonProps } from './types';
import { getBaseButtonModuleClasses } from './getBaseButtonModuleClasses';
import { useStyledProps } from '~components/Box/styledProps';

type StyledBaseButtonWebProps = StyledBaseButtonProps & {
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  isIconOnly?: boolean;
  className?: string;
};

const StyledBaseButton = React.forwardRef<HTMLButtonElement, StyledBaseButtonWebProps>(
  (props, ref) => {
    const {
      as: Component = 'button',
      variant = 'primary',
      color = 'primary',
      size = 'medium',
      disabled,
      isFullWidth,
      isIconOnly = false,
      borderRadii,
      borderRadius,
      isGroupBorderCollapsed,
      isInsideFullWidthButtonGroup,
      href,
      target,
      rel,
      type,
      children,
      accessibilityProps,
      minHeight,
      height,
      width,
      onClick,
      onBlur,
      onFocus,
      onMouseLeave,
      onMouseMove,
      onMouseDown,
      onMouseUp,
      onKeyDown,
      onPointerDown,
      onPointerEnter,
      onTouchStart,
      onTouchEnd,
      tabIndex,
      id,
      // styled-components token props — web SCSS handles these; do not pass to DOM
      defaultBackgroundColor: _defaultBackgroundColor,
      defaultBoxShadow: _defaultBoxShadow,
      hoverBackgroundColor: _hoverBackgroundColor,
      hoverBoxShadow: _hoverBoxShadow,
      focusBackgroundColor: _focusBackgroundColor,
      focusBoxShadow: _focusBoxShadow,
      focusRingColor: _focusRingColor,
      hoverIconColor: _hoverIconColor,
      motionDuration: _motionDuration,
      motionEasing: _motionEasing,
      shadowHighlightColor: _shadowHighlightColor,
      shadowHighlightHeight: _shadowHighlightHeight,
      shadowBottomColor: _shadowBottomColor,
      shadowBottomHeight: _shadowBottomHeight,
      shadowBorderColor: _shadowBorderColor,
      focusShadowBorderColor: _focusShadowBorderColor,
      shadowRingWidth: _shadowRingWidth,
      isShadowGradientVisible: _isShadowGradientVisible,
      isPressed: _isPressed,
      isLoading: _isLoading,
      defaultBorderColor: _defaultBorderColor,
      focusBorderColor: _focusBorderColor,
      hoverBorderColor: _hoverBorderColor,
      borderWidth: _borderWidth,
      isInsetShadowSidesFlattened: _isInsetShadowSidesFlattened,
      buttonPaddingTop: _buttonPaddingTop,
      buttonPaddingBottom: _buttonPaddingBottom,
      buttonPaddingLeft: _buttonPaddingLeft,
      buttonPaddingRight: _buttonPaddingRight,
      className: propClassName,
      ...rest
    } = props;

    const styledPropsCSSObject = useStyledProps(
      props as unknown as Parameters<typeof useStyledProps>[0],
    );
    const className = getBaseButtonModuleClasses({
      variant,
      color,
      size,
      isDisabled: disabled,
      isFullWidth,
      isIconOnly,
      className: propClassName,
    });

    const borderRadiusStyle = borderRadii
      ? {
          borderTopLeftRadius: borderRadii.topLeft,
          borderTopRightRadius: borderRadii.topRight,
          borderBottomLeftRadius: borderRadii.bottomLeft,
          borderBottomRightRadius: borderRadii.bottomRight,
        }
      : borderRadius !== undefined
        ? { borderRadius }
        : {};

    const inlineStyle: React.CSSProperties = {
      ...styledPropsCSSObject,
      ...borderRadiusStyle,
      ...(isGroupBorderCollapsed ? { marginLeft: -1 } : {}),
      ...(isInsideFullWidthButtonGroup ? { flex: 1, alignSelf: 'stretch' } : {}),
      ...(minHeight ? { minHeight } : {}),
      ...(height ? { height } : {}),
      ...(width ? { width } : {}),
    };

    return (
      <Component
        ref={ref as never}
        id={id}
        style={inlineStyle}
        disabled={Component === 'button' ? disabled : undefined}
        href={Component === 'a' ? href : undefined}
        target={Component === 'a' ? target : undefined}
        rel={Component === 'a' ? rel : undefined}
        type={Component === 'button' ? type : undefined}
        aria-disabled={Component === 'a' && disabled ? true : undefined}
        tabIndex={tabIndex}
        onClick={(disabled ? undefined : onClick) as React.MouseEventHandler<HTMLElement>}
        onBlur={onBlur as React.FocusEventHandler<HTMLElement>}
        onFocus={onFocus as React.FocusEventHandler<HTMLElement>}
        onMouseLeave={onMouseLeave as React.MouseEventHandler<HTMLElement>}
        onMouseMove={onMouseMove as React.MouseEventHandler<HTMLElement>}
        onMouseDown={onMouseDown as React.MouseEventHandler<HTMLElement>}
        onMouseUp={onMouseUp as React.MouseEventHandler<HTMLElement>}
        onMouseOut={
          (props as { onMouseOut?: React.MouseEventHandler<HTMLElement> }).onMouseOut
        }
        onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLElement>}
        onKeyUp={(props as { onKeyUp?: React.KeyboardEventHandler<HTMLElement> }).onKeyUp}
        onPointerDown={onPointerDown as React.PointerEventHandler<HTMLElement>}
        onPointerEnter={onPointerEnter as React.PointerEventHandler<HTMLElement>}
        onTouchStart={onTouchStart as React.TouchEventHandler<HTMLElement>}
        onTouchEnd={onTouchEnd as React.TouchEventHandler<HTMLElement>}
        {...accessibilityProps}
        {...rest}
        className={className}
      >
        {children}
      </Component>
    );
  },
);

StyledBaseButton.displayName = 'StyledBaseButton';

export default StyledBaseButton;
