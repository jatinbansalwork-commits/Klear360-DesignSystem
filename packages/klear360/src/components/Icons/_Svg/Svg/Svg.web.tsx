import type { ReactElement } from 'react';
import type { SvgProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { filterForwardableDomProps } from '~components/Box/BaseBox/filterForwardableDomProps';
import { useTheme } from '~components/Klear360Provider';

const Svg = ({
  children,
  height,
  viewBox,
  width,
  fill,
  testID,
  display,
  fillOpacity,
  ...styledProps
}: SvgProps): ReactElement => {
  const { theme } = useTheme();
  const styledPropsCSSObject = useStyledProps({ ...styledProps, display, theme });
  const domProps = filterForwardableDomProps(styledProps as Record<string, unknown>);

  return (
    <svg
      {...makeAccessible({ hidden: true })}
      {...metaAttribute({ name: MetaConstants.Icon, testID })}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
      fillOpacity={fillOpacity}
      style={styledPropsCSSObject as React.CSSProperties}
      {...domProps}
    >
      {children}
    </svg>
  );
};

export default Svg;
