import React from 'react';
import type { StyledBaseMenuItemContainerProps } from '../types';
import BaseBox from '~components/Box/BaseBox';
import actionListStyles from '../../ActionList/styles/ActionList.module.scss';

const StyledMenuItemContainer = React.forwardRef<HTMLElement, StyledBaseMenuItemContainerProps>(
  ({ color, isVisible, isKeydownPressed: _isKeydownPressed, className, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[
        actionListStyles.item,
        color === 'negative' ? actionListStyles.itemNegative : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ display: isVisible ? 'flex' : 'none' }}
    />
  ),
);

StyledMenuItemContainer.displayName = 'StyledMenuItemContainer';

export { StyledMenuItemContainer };
