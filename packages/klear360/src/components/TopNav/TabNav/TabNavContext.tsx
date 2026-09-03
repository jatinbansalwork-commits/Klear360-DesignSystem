import React from 'react';
import type { TabNavItemData } from './types';
import { throwKlear360Error } from '~utils/logger';

type TabNavContextProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  controlledItems: TabNavItemData[];
  setControlledItems: React.Dispatch<React.SetStateAction<TabNavItemData[]>>;
};
const TabNavContext = React.createContext<TabNavContextProps | null>(null);

const useTabNavContext = (): TabNavContextProps => {
  const context = React.useContext(TabNavContext);
  if (!context) {
    throwKlear360Error({
      message: 'useTabNavContext must be used within a TabNavProvider',
      moduleName: 'TabNav',
    });
  }
  return context!;
};

export { TabNavContext, useTabNavContext };
