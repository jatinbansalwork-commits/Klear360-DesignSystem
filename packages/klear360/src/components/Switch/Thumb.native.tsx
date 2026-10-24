/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from 'styled-components';
import type { ThumbProps } from './types';
import { switchSizes } from './switchTokens';
import getIn from '~utils/lodashButBetter/get';
import isNumber from '~utils/lodashButBetter/isNumber';
import BaseBox from '~components/Box/BaseBox';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';

const Thumb = styled(BaseBox)<ThumbProps>(({ theme, size = 'medium', deviceType }) => {
  const width = switchSizes.thumb[deviceType][size].width;
  const height = switchSizes.thumb[deviceType][size].height;

  const finalWidth = isNumber(width) ? makeSize(width) : makeSpace(getIn(theme, width));
  const finalHeight = isNumber(height) ? makeSize(height) : makeSpace(getIn(theme, height));

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: finalWidth,
    height: finalHeight,
    position: 'absolute',
    left: 0,
    margin: makeSpace(theme.spacing[1]),
  };
});

export { Thumb };
