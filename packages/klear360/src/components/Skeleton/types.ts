import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { FlexboxProps } from '~components/Box/BaseBox/types/propsTypes';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';

type SkeletonProps = StyledPropsKlear360 &
  Pick<
    BaseBoxProps,
    'width' | 'maxWidth' | 'minWidth' | 'height' | 'maxHeight' | 'minHeight' | 'borderRadius'
  > &
  Partial<FlexboxProps> & {
    testID?: string;
  };

export type { SkeletonProps };
