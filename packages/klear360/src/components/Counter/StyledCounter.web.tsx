import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { StyledCounterProps } from './types';
import { getCounterModuleClasses } from './getCounterModuleClasses';

export const StyledCounter = React.forwardRef<HTMLElement, StyledCounterProps>(
  (
    {
      color,
      emphasis,
      size,
      backgroundColor: _backgroundColor,
      platform: _platform,
      minHeight: _minHeight,
      minWidth: _minWidth,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[
        getCounterModuleClasses({ color, emphasis, size }),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </BaseBox>
  ),
);

StyledCounter.displayName = 'StyledCounter';
