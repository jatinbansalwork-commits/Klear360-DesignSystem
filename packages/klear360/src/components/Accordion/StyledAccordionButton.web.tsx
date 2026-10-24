import React from 'react';
import type { StyledAccordionButtonProps } from './types';
import { getAccordionButtonModuleClasses } from './getAccordionButtonModuleClasses';

type WebStyledAccordionButtonProps = StyledAccordionButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledAccordionButton = React.forwardRef<HTMLButtonElement, WebStyledAccordionButtonProps>(
  (
    {
      isExpanded,
      variant,
      isFirstItem,
      isLastItem,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={[
        getAccordionButtonModuleClasses({
          isExpanded,
          variant,
          isFirstItem,
          isLastItem,
          disabled,
        }),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  ),
);

StyledAccordionButton.displayName = 'StyledAccordionButton';

export { StyledAccordionButton };
