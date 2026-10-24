import React from 'react';
import styles from './CounterInput.module.scss';
import { getCounterInputRootClass } from './getCounterInputModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';

const COUNTER_INPUT_CLASS = '__klear360-counter-input';

type StyledCounterInputProps = BaseBoxProps & {
  children?: React.ReactNode;
  className?: string;
};

const StyledCounterInput = React.forwardRef<HTMLElement, StyledCounterInputProps>(
  ({ className, children, ...rest }, ref) => (
    <BaseBox
      ref={ref as never}
      {...rest}
      className={[getCounterInputRootClass(), COUNTER_INPUT_CLASS, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </BaseBox>
  ),
);

StyledCounterInput.displayName = 'StyledCounterInput';

type StyledNumberWrapperProps = BaseBoxProps & {
  $width: string;
  $fontFamily: string;
  $fontSize: string;
  $fontWeight: string | number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const StyledNumberWrapper = ({
  $width,
  $fontFamily,
  $fontSize,
  $fontWeight,
  className,
  children,
  style,
  ...rest
}: StyledNumberWrapperProps): React.ReactElement => (
  <BaseBox
    {...rest}
    className={[styles['input-wrapper'], className].filter(Boolean).join(' ')}
    style={{
      flex: 'none',
      width: $width,
      fontFamily: $fontFamily,
      fontSize: $fontSize,
      fontWeight: $fontWeight,
      fontVariantNumeric: 'tabular-nums',
      ...style,
    }}
  >
    {children}
  </BaseBox>
);

export { StyledCounterInput, StyledNumberWrapper };
