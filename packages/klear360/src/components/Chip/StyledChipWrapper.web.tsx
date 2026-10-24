import React from 'react';
import type { StyledChipWrapperProps } from './types';
import { chipBorderRadiusTokens } from './chipTokens';
import { getChipInnerModuleClasses } from './getChipModuleClasses';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type WebStyledChipWrapperProps = Omit<StyledChipWrapperProps, 'theme'> &
  BaseBoxProps & {
    style?: React.CSSProperties;
  };

const StyledChipWrapper = ({
  borderColor,
  isChecked,
  isDisabled,
  color,
  size = 'small',
  className,
  style,
  children,
  ...rest
}: WebStyledChipWrapperProps): React.ReactElement => {
  const { theme } = useTheme();
  const borderRadiusKey = chipBorderRadiusTokens[size];
  const outerRadius = theme.border.radius[borderRadiusKey];
  const isMediumOrLarge = size === 'medium' || size === 'large';
  const outerBorderWidth = getIn(theme, 'border.width.thin') as number;

  const innerStyle: React.CSSProperties = {
    borderRadius: makeBorderSize(outerRadius - outerBorderWidth),
    borderColor:
      isChecked && !isMediumOrLarge ? getIn(theme.colors, borderColor) : 'transparent',
    ...(isMediumOrLarge ? { borderWidth: 0 } : {}),
    overflow: 'visible',
  };

  return (
    <BaseBox
      {...rest}
      className={[getChipInnerModuleClasses({ isChecked, isDisabled, color }), className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...innerStyle, ...style }}
    >
      {children}
    </BaseBox>
  );
};

export { StyledChipWrapper };
