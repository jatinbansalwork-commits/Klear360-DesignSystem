import type { CSSProperties } from 'react';
import {
  inputDropdownButtonBorderRadius,
  baseInputHeight,
  inputDropdownButtonPadding,
} from '~components/Input/BaseInput/baseInputTokens';
import type { BaseInputProps } from '~components/Input/BaseInput/BaseInput';
import type { Theme } from '~components/Klear360Provider';
import { makeSpace } from '~utils';
import { spacing } from '~tokens/global';

const getInputDropdownButtonStyleVars = ({
  theme,
  size,
}: {
  theme: Theme;
  size: NonNullable<BaseInputProps['size']>;
}): CSSProperties => {
  const paddingValue = inputDropdownButtonPadding[size];
  const wrapperVerticalPadding = spacing[paddingValue] * 2;
  const buttonHeight = baseInputHeight[size] - wrapperVerticalPadding;
  return {
    ['--input-dropdown-button-height' as string]: makeSpace(buttonHeight),
    ['--input-dropdown-button-radius' as string]: inputDropdownButtonBorderRadius[size],
  } as CSSProperties;
};

export { getInputDropdownButtonStyleVars };
