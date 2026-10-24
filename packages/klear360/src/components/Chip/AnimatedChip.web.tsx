import React from 'react';
import type { AnimatedChipProps } from './types';
import { chipBorderRadiusTokens } from './chipTokens';
import { getChipAnimatedModuleClasses } from './getChipModuleClasses';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type WebAnimatedChipProps = Omit<AnimatedChipProps, 'theme'> &
  Pick<BaseBoxProps, 'width' | 'maxWidth' | 'minWidth'>;

const AnimatedChip = ({
  borderColor,
  isPressed,
  isDesktop: _isDesktop,
  isDisabled: _isDisabled,
  isChecked: _isChecked,
  backgroundColor: _backgroundColor,
  size = 'small',
  children,
  width,
  maxWidth,
  minWidth,
}: WebAnimatedChipProps): React.ReactElement => {
  const { theme } = useTheme();
  const borderRadiusKey = chipBorderRadiusTokens[size];
  const outerRadius = theme.border.radius[borderRadiusKey];
  const outerBorderWidth = getIn(theme, 'border.width.thin') as number;

  return (
    <BaseBox
      width={width}
      maxWidth={maxWidth}
      minWidth={minWidth}
      className={getChipAnimatedModuleClasses(isPressed)}
      style={{
        borderRadius: makeBorderSize(outerRadius),
        borderColor: getIn(theme.colors, borderColor),
        borderWidth: outerBorderWidth,
      }}
    >
      {children}
    </BaseBox>
  );
};

export { AnimatedChip };
