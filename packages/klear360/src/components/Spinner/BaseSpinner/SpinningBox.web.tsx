import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import styles from './Spinner.module.scss';

type SpinningBoxProps = BaseBoxProps & {
  className?: string;
};

const SpinningBox = React.forwardRef<HTMLElement, SpinningBoxProps>(
  ({ className, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[styles['spinner-box'], className].filter(Boolean).join(' ')}
    />
  ),
);

SpinningBox.displayName = 'SpinningBox';

export { SpinningBox };
