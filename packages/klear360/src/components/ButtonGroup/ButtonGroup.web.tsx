/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { ButtonGroupProps } from './types';
import { StyledButtonGroup } from './StyledButtonGroup';
import { StyledButtonGroupDivider } from './StyledButtonGroupDivider.web';
import { ButtonGroupProvider } from './ButtonGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { Klear360ElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';

const _ButtonGroup = (
  {
    children,
    isDisabled = false,
    size = 'medium',
    color = 'primary',
    variant = 'primary',
    isFullWidth = false,
    testID,
    ...rest
  }: ButtonGroupProps,
  ref: React.Ref<Klear360ElementRef>,
): React.ReactElement => {
  const contextValue = {
    isDisabled,
    size,
    color,
    variant,
    isFullWidth,
  };

  useVerifyAllowedChildren({
    allowedComponents: ['Button', 'Dropdown', 'Tooltip', 'Popover'],
    componentName: 'ButtonGroup',
    children,
  });

  return (
    <ButtonGroupProvider value={contextValue}>
      <StyledButtonGroup
        ref={ref as never}
        color={color}
        variant={variant}
        size={size}
        isDisabled={isDisabled}
        isFullWidth={isFullWidth}
        {...metaAttribute({ name: MetaConstants.ButtonGroup, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
        role="group"
      >
        {React.Children.map(children, (child, index) => {
          const isLast = React.Children.count(children) - 1 === index;
          // Only show dividers for primary variant (secondary/tertiary have borders via box-shadow)
          const showDivider = variant === 'primary' && !isLast;

          return (
            <>
              {child}
              {showDivider && (
                <StyledButtonGroupDivider variant={variant} color={color} isDisabled={isDisabled} />
              )}
            </>
          );
        })}
      </StyledButtonGroup>
    </ButtonGroupProvider>
  );
};

/**
 * ### ButtonGroup Component
 *
 * The ButtonGroup component is used to group related buttons together.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
  const App = () => {
    return (
      <ButtonGroup>
        <Button icon={RefreshIcon}>Sync</Button>
        <Button icon={ShareIcon}>Share</Button>
        <Button icon={DownloadIcon}>Download</Button>
      </ButtonGroup>
    );
  }
 * ```
 *
 *  ---
 *
 * Checkout {@link https://klear360.klear.com/?path=/docs/components-buttongroup ButtonGroup Documentation}
 *
 */
const ButtonGroup = assignWithoutSideEffects(React.forwardRef(_ButtonGroup), {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
