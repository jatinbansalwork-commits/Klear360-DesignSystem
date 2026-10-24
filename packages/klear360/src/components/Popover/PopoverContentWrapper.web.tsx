import React from 'react';
import { getPopoverContentWrapperStyles } from './getPopoverContentWrapperStyles';
import type { PopoverContentWrapperProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import type { Klear360ElementRef } from '~utils/types';

const PopoverContentWrapper = React.forwardRef<Klear360ElementRef, PopoverContentWrapperProps>(
  ({ children, styles: stylesProp, isMobile, colorScheme, maxWidth, style, ...boxProps }, ref) => {
    const { theme } = useTheme();
    const wrapperStyles = getPopoverContentWrapperStyles({
      theme,
      styles: stylesProp,
      isMobile,
      colorScheme,
      maxWidth: maxWidth as Parameters<typeof getPopoverContentWrapperStyles>[0]['maxWidth'],
    });

    return (
      <BaseBox
        ref={ref}
        elevation="lowRaised"
        {...(maxWidth !== undefined &&
        (typeof maxWidth === 'string' || typeof maxWidth === 'number')
          ? { maxWidth }
          : {})}
        style={{ ...(wrapperStyles as React.CSSProperties), ...style }}
        {...boxProps}
      >
        {children}
      </BaseBox>
    );
  },
);

PopoverContentWrapper.displayName = 'PopoverContentWrapper';

export { PopoverContentWrapper };
