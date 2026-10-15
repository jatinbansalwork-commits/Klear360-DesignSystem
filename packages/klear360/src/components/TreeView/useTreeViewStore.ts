import React from 'react';
import { throwKlear360Error } from '~utils/logger';

/**
 * TreeView's volatile, tree-wide state: changes on every selection, expansion, or
 * roving-tabindex focus move, anywhere in the tree.
 *
 * Kept out of `TreeViewContext` on purpose (see useTreeView.ts) and published through a
 * subscribe/snapshot store instead, so each row can subscribe to only the slice it needs
 * (`useTreeViewStoreSelector`) instead of re-rendering whenever ANY of this state changes
 */
type TreeViewVolatileState = {
  selectedValuesSet: Set<string>;
  expandedValues: Set<string>;
  tabbableValue: string | null;
};

type TreeViewStoreType = {
  getState: () => TreeViewVolatileState;
  setState: (next: TreeViewVolatileState) => void;
  subscribe: (listener: () => void) => () => void;
};

/**
 * Minimal external store (subscribe/getSnapshot), consumed through `useSyncExternalStore`
 * via `useTreeViewStoreSelector` below. One instance per `TreeView`, created once and never
 * replaced - only its `state` is swapped on every render (see TreeView.web.tsx)
 */
const createTreeViewStore = (initialState: TreeViewVolatileState): TreeViewStoreType => {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (next) => {
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

const TreeViewStoreContext = React.createContext<TreeViewStoreType | null>(null);

/**
 * Subscribes to a derived slice of TreeView's volatile state. React only re-renders the
 * calling row when the SELECTED value actually changes (`Object.is` on the selector's
 * return value) - e.g. selecting one leaf elsewhere in the tree produces a new
 * `selectedValuesSet`, but a row whose own `set.has(value)` still evaluates to the same
 * boolean does not re-render, unlike reading `selectedValuesSet` off context directly
 */
const useTreeViewStoreSelector = <T>(selector: (state: TreeViewVolatileState) => T): T => {
  const store = React.useContext(TreeViewStoreContext);
  if (!store) {
    throwKlear360Error({
      message: 'TreeViewItem and TreeViewLoadMore must be used within TreeView',
      moduleName: 'TreeView',
    });
  }
  const getSnapshot = (): T => selector(store!.getState());
  // same snapshot getter for the server: the store's state at render time already IS its
  // initial state (nothing mutates it before hydration), so there is nothing extra to compute
  return React.useSyncExternalStore(store!.subscribe, getSnapshot, getSnapshot);
};

export { createTreeViewStore, TreeViewStoreContext, useTreeViewStoreSelector };
export type { TreeViewStoreType, TreeViewVolatileState };
