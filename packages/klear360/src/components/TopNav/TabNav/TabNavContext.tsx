import React from 'react';
import type { TabNavItemData } from './types';
import { throwKlear360Error } from '~utils/logger';

/**
 * Deliberately excludes `controlledItems` (and the unused `containerRef` - see the removal in
 * `_decisions/decisions.md`, "Context re-render audit"): nothing reads either via
 * `useTabNavContext()`, only `setControlledItems` (its sole consumer, `TabNavItem`). Bundling the
 * volatile `controlledItems` array into this value anyway meant every resize-driven overflow
 * recalculation created a new Provider value, re-rendering every mounted `TabNavItem` even though
 * none of them read that field.
 */
type TabNavContextProps = {
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
