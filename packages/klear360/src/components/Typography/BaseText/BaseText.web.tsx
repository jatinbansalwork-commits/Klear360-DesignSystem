import React from 'react';
import type { ReactElement } from 'react';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps, useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { filterForwardableDomProps } from '~components/Box/BaseBox/filterForwardableDomProps';
import type { Klear360ElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTheme } from '~components/Klear360Provider';

const _BaseText: React.ForwardRefRenderFunction<Klear360ElementRef, BaseTextProps> = (
  {
    id,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight,
    letterSpacing,
    as,
    textAlign,
    children,
    truncateAfterLines,
    wordBreak,
    opacity,
    className,
    textTransform,
    style,
    accessibilityProps = {},
    componentName = MetaConstants.BaseText,
    testID,
    ...styledProps
  },
  ref,
): ReactElement => {
  const { theme } = useTheme();
  const styledPropsWithTheme = { ...getStyledProps(styledProps), theme };
  const styledPropsCSSObject = useStyledProps(styledPropsWithTheme);

  const textStyles = getBaseTextStyles({
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    numberOfLines: truncateAfterLines,
    lineHeight,
    letterSpacing,
    textAlign,
    wordBreak,
    opacity,
    textTransform,
    theme,
  });

  const mergedStyle = {
    ...textStyles,
    ...styledPropsCSSObject,
    ...style,
  } as React.CSSProperties;

  const Component = (as ?? 'div') as React.ElementType;
  const domProps = filterForwardableDomProps(styledProps as Record<string, unknown>);

  return React.createElement(
    Component,
    {
      ref,
      id,
      className,
      style: mergedStyle,
      ...domProps,
      ...makeAccessible(accessibilityProps),
      ...metaAttribute({ name: componentName, testID }),
      ...makeAnalyticsAttribute(styledProps),
    },
    children,
  );
};

const BaseText = React.forwardRef(_BaseText);
BaseText.displayName = 'BaseText';
export { BaseText };
