import React from 'react';
import type { CheckboxRectProps } from './CheckboxIconWrapperStyles';
import { getCheckboxIconModuleClasses } from './getCheckboxIconModuleClasses';

type CheckboxIconWrapperProps = CheckboxRectProps &
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
  };

const CheckboxIconWrapper = React.forwardRef<HTMLDivElement, CheckboxIconWrapperProps>(
  (
    { isChecked, isDisabled, isNegative, isIndeterminate, size, className, children, ...rest },
    ref,
  ) => (
    <div
      ref={ref}
      className={[
        getCheckboxIconModuleClasses({
          isChecked,
          isDisabled,
          isNegative,
          size,
          isIndeterminate,
        }),
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

CheckboxIconWrapper.displayName = 'CheckboxIconWrapper';

export { CheckboxIconWrapper };
