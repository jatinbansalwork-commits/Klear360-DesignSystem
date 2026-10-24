import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize } from '~utils/makeBorderSize';

const getStyledBadgeStyles = ({ theme, backgroundColor }: StyledBadgeProps): CSSObject => {
  if (!theme) {
    return {};
  }
  return {
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.radius.max),
  display: 'flex',
  flexWrap: 'nowrap',
};
};

export { getStyledBadgeStyles };
