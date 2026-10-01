import React from 'react';
import type { TabsProps } from './types';
import { throwKlear360Error } from '~utils/logger';
import type { ControllableStateSetter } from '~utils/useControllable';

type TabsContextProps =
  | (Pick<TabsProps, 'size' | 'variant' | 'isFullWidthTabItem' | 'isLazy' | 'selectedEmphasis'> & {
      isVertical: boolean;
      baseId: string;
      selectedValue: string;
      setSelectedValue?: ControllableStateSetter<string>;
      /**
       * Values of the TabPanels currently rendering a panel element - TabItems only point
       * `aria-controls` at these, so Tabs used without TabPanels (the consumer renders the content
       * itself) never references a non-existent id. Web only.
       */
      renderedPanelValues?: ReadonlySet<string>;
      registerPanel?: (value: string) => () => void;
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
