import React from 'react';
import type { ButtonGroupProps } from './types';
import { getButtonGroupDividerClass } from './getButtonGroupModuleClasses';
import { getDividerColorToken } from './getButtonGroupDividerColorToken';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import getIn from '~utils/lodashButBetter/get';

type StyledButtonGroupDividerProps = Pick<ButtonGroupProps, 'color' | 'isDisabled' | 'variant'>;

const StyledButtonGroupDivider = ({
  color,
  variant,
  isDisabled,
}: StyledButtonGroupDividerProps): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <BaseBox
      className={getButtonGroupDividerClass()}
      style={
        {
          ['--button-group-divider-color' as string]: getIn(
            theme.colors,
            getDividerColorToken({ color, variant, isDisabled }),
          ),
        } as React.CSSProperties
      }
    />
  );
};

export { StyledButtonGroupDivider };
