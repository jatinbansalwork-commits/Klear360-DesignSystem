import type { IconButtonEmphasis, IconButtonProps } from './IconButton';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute, RemoveUndefinedFromUnion, TestID } from '~utils/types';
import type { Klear360CommonEvents } from '~components/types';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { AccessibilityProps } from '~utils/makeAccessible';
import type { Platform } from '~utils';

export type StyledIconButtonProps = {
  icon: IconComponent;
  size: RemoveUndefinedFromUnion<IconButtonProps['size']>;
  emphasis: IconButtonEmphasis;
  accessibilityLabel: string;
  accessibilityProps?: Partial<AccessibilityProps>;
  isDisabled?: IconButtonProps['isDisabled'];
  isHighlighted?: IconButtonProps['isHighlighted'];
  tabIndex?: IconButtonProps['_tabIndex'];
  onClick?: IconButtonProps['onClick'];
  onKeyDown?: Platform.Select<{
    web: React.KeyboardEventHandler;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    native: undefined | ((event: any) => void);
  }>;
} & TestID &
  Klear360CommonEvents &
  DataAnalyticsAttribute &
  StyledPropsKlear360;
