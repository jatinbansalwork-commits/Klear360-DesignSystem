import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { StyledBadgeProps } from './types';
import { getBadgeModuleClasses } from './getBadgeModuleClasses';

export const StyledBadge = React.forwardRef<HTMLElement, StyledBadgeProps>(
  (
    {
      color,
      emphasis,
      size,
      backgroundColor: _backgroundColor,
      height: _height,
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
        getBadgeModuleClasses({ color, emphasis, size }),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </BaseBox>
  ),
);

StyledBadge.displayName = 'StyledBadge';
