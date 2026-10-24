import React from 'react';
import type { StyledButtonGroupProps } from './types';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type StyledButtonGroupWebProps = StyledButtonGroupProps &
  BaseBoxProps &
  Pick<React.HTMLAttributes<HTMLElement>, 'role' | 'style' | 'className'>;
import {
  getButtonGroupDataAttributes,
  getButtonGroupRootClass,
} from './getButtonGroupModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import { buttonBorderRadius } from '~components/Button/BaseButton/buttonTokens';
import { makeBorderSize } from '~utils';

const StyledButtonGroup = React.forwardRef<HTMLElement, StyledButtonGroupWebProps>(
  ({ variant = 'primary', isFullWidth, size = 'medium', className, style, ...rest }, ref) => {
    const { theme } = useTheme();
    const borderRadiusToken = buttonBorderRadius[size];
    const borderRadius = makeBorderSize(theme.border.radius[borderRadiusToken]);

    return (
      <BaseBox
        ref={ref as never}
        {...rest}
        {...getButtonGroupDataAttributes(isFullWidth)}
        className={[getButtonGroupRootClass({ variant }), className].filter(Boolean).join(' ')}
        style={
          {
            ['--button-group-radius' as string]: borderRadius,
            ...style,
          } as React.CSSProperties
        }
      />
    );
  },
);

StyledButtonGroup.displayName = 'StyledButtonGroup';

export { StyledButtonGroup };
