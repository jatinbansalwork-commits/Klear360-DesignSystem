import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: string;
  viewBox: string;
  width: string;
  fillOpacity?: number;
} & TestID &
  Omit<StyledPropsKlear360, 'order' | 'visibility'>; // Order prop on SVG has different meaning so removing this prop from styledProps
