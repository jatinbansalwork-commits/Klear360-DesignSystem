import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledAlertProps } from './types';
import { getAlertModuleClasses } from './getAlertModuleClasses';

type StyledAlertWebProps = StyledAlertProps &
  Pick<BaseBoxProps, 'maxWidth' | 'textAlign'> & {
    className?: string;
  };

export const StyledAlert = React.forwardRef<HTMLElement, StyledAlertWebProps>(
  ({ color, emphasis, isFullWidth, isDesktop: _isDesktop, className, children, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[getAlertModuleClasses({ color, emphasis, isFullWidth }), className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </BaseBox>
  ),
);

StyledAlert.displayName = 'StyledAlert';
