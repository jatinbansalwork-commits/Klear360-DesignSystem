import React from 'react';
import type { RadioRectProps } from './RadioIconWrapperStyles';
import { getRadioIconModuleClasses } from './getRadioIconModuleClasses';

type RadioIconWrapperProps = RadioRectProps &
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

const RadioIconWrapper = React.forwardRef<HTMLDivElement, RadioIconWrapperProps>(
  ({ isChecked, isDisabled, isNegative, size, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={[
        getRadioIconModuleClasses({ isChecked, isDisabled, isNegative, size }),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  ),
);

RadioIconWrapper.displayName = 'RadioIconWrapper';

export { RadioIconWrapper };
