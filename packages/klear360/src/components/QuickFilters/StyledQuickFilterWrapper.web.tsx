import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import styles from './QuickFilters.module.scss';

type StyledQuickFilterWrapperProps = BaseBoxProps & {
  isSelected?: boolean;
  as?: React.ElementType;
};

const StyledQuickFilterWrapper = React.forwardRef<HTMLElement, StyledQuickFilterWrapperProps>(
  ({ isSelected, className, ...rest }, ref) => (
    <BaseBox
      ref={ref as never}
      {...rest}
      className={[styles.wrapper, isSelected ? styles.wrapperSelected : null, className]
        .filter(Boolean)
        .join(' ')}
    />
  ),
);

StyledQuickFilterWrapper.displayName = 'StyledQuickFilterWrapper';

export { StyledQuickFilterWrapper };
