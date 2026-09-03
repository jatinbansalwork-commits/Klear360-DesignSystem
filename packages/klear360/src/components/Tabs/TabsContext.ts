import React from 'react';
import type { TabsProps } from './types';
import { throwKlear360Error } from '~utils/logger';
import type { ControllableStateSetter } from '~utils/useControllable';

type TabsContextProps =
  | (Pick<TabsProps, 'size' | 'variant' | 'isFullWidthTabItem' | 'isLazy'> & {
      isVertical: boolean;
      baseId: string;
      selectedValue: string;
      setSelectedValue?: ControllableStateSetter<string>;
    })
  | null;

const TabsContext = React.createContext<TabsContextProps>(null);

const useTabsContext = (): NonNullable<TabsContextProps> => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throwKlear360Error({
      moduleName: 'Tabs',
      message: 'useTabsContext must be used within Tabs',
    });
  }

  return context!;
};

export { TabsContext, useTabsContext };
