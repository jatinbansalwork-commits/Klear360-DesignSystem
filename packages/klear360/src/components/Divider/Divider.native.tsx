import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeBorderSize } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { Klear360ElementRef } from '~utils/types';
import type { DividerProps } from './types';

const StyledDivider = styled(BaseBox)<{
  borderPosition: 'borderBottom' | 'borderLeft';
  dividerStyle: NonNullable<DividerProps['dividerStyle']>;
  thickness: NonNullable<DividerProps['thickness']>;
  height: DividerProps['height'];
  width: DividerProps['width'];
  isDividerHorizontal: boolean;
}>(({ theme, borderPosition, dividerStyle, thickness, isDividerHorizontal, width, height }) => ({
  borderWidth: 0,
  [`${borderPosition}Style`]: dividerStyle,
  [`${borderPosition}Width`]: makeBorderSize(theme.border.width[thickness]),
  ...(isDividerHorizontal ? { flexGrow: 1, width } : { alignSelf: 'stretch', height }),
}));

const _Divider = (
  {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    height,
    width,
    testID,
    ...styledProps
  }: DividerProps,
  ref: React.Ref<Klear360ElementRef>,
): React.ReactElement => {
  const isDividerHorizontal = orientation === 'horizontal';
  const borderPosition = isDividerHorizontal ? 'borderBottom' : 'borderLeft';
  const borderColor = { [`${borderPosition}Color`]: `surface.border.gray.${variant}` };

  return (
    <StyledDivider
      ref={ref as never}
      borderPosition={borderPosition}
      isDividerHorizontal={isDividerHorizontal}
      dividerStyle={dividerStyle}
      thickness={thickness}
      height={height}
      width={width}
      {...borderColor}
      {...metaAttribute({ name: MetaConstants.Divider, testID })}
      {...getStyledProps(styledProps)}
    />
  );
};

const Divider = React.forwardRef(_Divider);

export { Divider };
