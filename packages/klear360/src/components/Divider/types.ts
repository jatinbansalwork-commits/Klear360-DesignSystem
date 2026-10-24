import type { CSSObject } from 'styled-components';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

type DividerProps = {
  /**
   * Sets the orientation of divider
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Sets the style of divider
   *
   * @default 'solid'
   */
  dividerStyle?: 'solid' | 'dashed';
  /**
   * Sets the variant of divider
   *
   * @default 'muted'
   */
  variant?: 'normal' | 'subtle' | 'muted';
  /**
   * Sets the thickness of divider
   *
   * @default 'thin'
   */
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';
  /**
   * Sets the height of divider. Divider uses Flex by default, use height only when parent is not flex.
   */
  height?: CSSObject['height'];
  /**
   * Sets the width of divider. Divider uses Flex by default, use width only when parent is not flex.
   */
  width?: CSSObject['width'];
} & TestID &
  StyledPropsKlear360;

export type { DividerProps };
