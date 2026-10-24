import type { ButtonGroupProps } from './types';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import type { Theme } from '~components/Klear360Provider';
import { getBackgroundColorToken } from '~components/Button/BaseButton/BaseButton';

export const getDividerColorToken = ({
  color,
  variant,
  isDisabled,
}: Pick<ButtonGroupProps, 'color' | 'isDisabled' | 'variant'>): DotNotationToken<
  Theme['colors']
> => {
  if (variant === 'primary') {
    return 'surface.border.gray.subtle';
  }

  if (variant === 'secondary') {
    return getBackgroundColorToken({
      variant,
      color,
      state: isDisabled ? 'disabled' : 'default',
    });
  }

  return 'surface.border.gray.muted';
};
