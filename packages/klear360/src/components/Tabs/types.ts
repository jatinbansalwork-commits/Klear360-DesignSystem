import type React from 'react';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import type { DataAnalyticsAttribute } from '~utils/types';

type TabsProps = {
  /**
   * The content of the component, accepts `TabsList` and `TabsPanel` components.
   */
  children: React.ReactNode;
  /**
   * The value of the tab panel same as the corresponding TabItem's value to match the selected TabItem.
   */
  value?: string;
  /**
   * The default value of the selected tab, in case the Tabs component is uncontrolled.
   */
  defaultValue?: string;
  /**
   * Callback fired when the value changes.
   */
  onChange?: (value: string) => void;
  /**
   * The orientation of the tabs.
   *
   * @default 'horizontal' (always horizontal on react-native)
   */
  orientation?: Platform.Select<{
    web: 'horizontal' | 'vertical';
    native: 'horizontal';
  }>;
  /**
   * The size of the tabs.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * The variant of the tabs.
   *
   * @default 'bordered'
   */
  variant?: 'bordered' | 'borderless' | 'filled';
  /**
   * How strongly the selected tab stands out. Applies to `variant="filled"` only.
   *
   * - `subtle`: the selected tab is a white pill on the track.
   * - `intense`: the selected tab is a primary-filled pill with white label/icon - for a top-level
   *   content switcher that has to read at a glance (e.g. a page's main views). Unselected tabs
   *   stay unfilled either way.
   *
   * @default 'subtle'
   */
  selectedEmphasis?: 'subtle' | 'intense';
  /**
   * If `true`, the TabItems will grow to use all the available space.
   *
   * @default false
   */
  isFullWidthTabItem?: boolean;
  /**
   * If `true`, the TabPanel will be rendered only when it becomes active.
   *
   * @default false
   */
  isLazy?: boolean;
} & DataAnalyticsAttribute;

type TabItemCommonProps = {
  /**
   * The value of the tab item.
   */
  value: string;
  /**
   * Trailing element of the tab item.
   * Can be used to render a Badge/Counter component.
   */
  trailing?: React.ReactNode;
  /**
   * Internal prop used to pass size from Tabs to TabsItem.
   */
  /**
   * If `true`, the tab item will be disabled.
   */
  isDisabled?: boolean;
  /**
   * If set the tab item will be rendered as a link.
   * This can be used to create a tab item that redirects to another page or integrate with react-router.
   *
   * @default undefined
   */
  href?: string;
  /**
   * Callback fired when the tab item is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;
};

type TabItemWithoutLeadingProps = TabItemCommonProps & {
  /**
   * The content of the tab item.
   */
  children: React.ReactNode;
  /**
   * Leading element of the tab item.
   * Can be used to render an Icon.
   */
  leading?: undefined;
};

type TabItemWithOutChildrenProps = TabItemCommonProps & {
  /**
   * Leading element of the tab item.
   * Can be used to render an Icon.
   */
  leading: IconComponent;
  /**
   * The content of the tab item.
   */
  children?: React.ReactNode;
};

type TabItemProps = TabItemWithoutLeadingProps | TabItemWithOutChildrenProps;

type TabPanelProps = {
  /**
   * The value of the tab panel. This will be used to match the selected tab.
   */
  value: string;
  /**
   * The content of the tab panel.
   */
  children: React.ReactNode;
} & DataAnalyticsAttribute;

export type { TabsProps, TabItemProps, TabPanelProps };
