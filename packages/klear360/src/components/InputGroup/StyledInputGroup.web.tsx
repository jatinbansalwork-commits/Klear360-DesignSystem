import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import styles from './InputGroup.module.scss';

type StyledInputGroupProps = BaseBoxProps & {
  className?: string;
};

const StyledInputGroup = React.forwardRef<HTMLElement, StyledInputGroupProps>(
  ({ className, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[styles['input-group'], className].filter(Boolean).join(' ')}
    />
  ),
);

StyledInputGroup.displayName = 'StyledInputGroup';

export { StyledInputGroup };
