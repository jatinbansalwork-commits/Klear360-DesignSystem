/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import styles from './ActionList.module.scss';

type StyledListBoxWrapperProps = BaseBoxProps & {
  isInBottomSheet: boolean;
  className?: string;
};

const StyledListBoxWrapper = React.forwardRef<HTMLElement, StyledListBoxWrapperProps>(
  ({ isInBottomSheet, className, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[
        isInBottomSheet ? styles.wrapperInSheet : styles.wrapper,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  ),
);

StyledListBoxWrapper.displayName = 'StyledListBoxWrapper';

export { StyledListBoxWrapper };
