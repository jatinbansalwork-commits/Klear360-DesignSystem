import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { StyledActionListProps } from './getBaseActionListStyles';
import styles from './ActionList.module.scss';

type StyledActionListWebProps = StyledActionListProps & {
  className?: string;
};

const StyledActionList = React.forwardRef<HTMLElement, StyledActionListWebProps>(
  ({ isInBottomSheet, className, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[!isInBottomSheet ? styles.panel : undefined, className].filter(Boolean).join(' ')}
    />
  ),
);

StyledActionList.displayName = 'StyledActionList';

export { StyledActionList };
