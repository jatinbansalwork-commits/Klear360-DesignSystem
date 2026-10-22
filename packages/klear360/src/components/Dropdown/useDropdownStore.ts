import React from 'react';

/**
 * Dropdown's volatile, list-wide state: changes on every filter keystroke (`filteredValues`),
 * arrow-key move (`activeIndex`), selection (`selectedIndices`), or input-method switch
 * (`isKeydownPressed`).
 *
 * Kept out of `DropdownContext` on purpose (see Dropdown.tsx) and published through a
 * subscribe/snapshot store instead, so each `ActionListItem` can subscribe to only the slice it
 * needs (`useDropdownStoreSelector`) instead of re-rendering whenever ANY of this state changes -
 * same pattern as `TreeView`'s `useTreeViewStore.ts` (see TreeView/_decisions/decisions.md,
 * "React.memo evaluation")
 */
type DropdownVolatileState = {
  activeIndex: number;
  selectedIndices: number[];
  filteredValues: string[];
  isKeydownPressed: boolean;
};

type DropdownStoreType = {
  getState: () => DropdownVolatileState;
  setState: (next: DropdownVolatileState) => void;
  subscribe: (listener: () => void) => () => void;
};

/**
 * Minimal external store (subscribe/getSnapshot), consumed through `useSyncExternalStore`
 * via `useDropdownStoreSelector` below. One instance per `Dropdown`, created once and never
 * replaced - only its `state` is swapped on every render (see Dropdown.tsx)
 */
const createDropdownStore = (initialState: DropdownVolatileState): DropdownStoreType => {
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

/**
 * `useDropdown()` (and, through it, things like TreeView's own dropdown-mode detection) is
 * called unconditionally, including OUTSIDE any `Dropdown` - mirroring `DropdownContext`'s own
 * default value, the context here defaults to a real (never-updated) store with the same
 * no-op defaults, rather than `null` + a thrown error, so standalone usage keeps working exactly
 * as it did before this volatile state moved out of `DropdownContext`.
 */
const defaultDropdownStore = createDropdownStore({
  activeIndex: -1,
  selectedIndices: [],
  filteredValues: [],
  isKeydownPressed: false,
});

const DropdownStoreContext = React.createContext<DropdownStoreType>(defaultDropdownStore);

/**
 * Subscribes to a derived slice of Dropdown's volatile state. React only re-renders the
 * calling item when the SELECTED value actually changes (`Object.is` on the selector's
 * return value) - e.g. typing a filter character elsewhere produces a new `filteredValues`
 * array, but an item whose own `filteredValues.includes(value)` still evaluates to the same
 * boolean does not re-render, unlike reading `filteredValues` off context directly
 */
const useDropdownStoreSelector = <T>(selector: (state: DropdownVolatileState) => T): T => {
  const store = React.useContext(DropdownStoreContext);
  const getSnapshot = (): T => selector(store.getState());
  // same snapshot getter for the server: the store's state at render time already IS its
  // initial state (nothing mutates it before hydration), so there is nothing extra to compute
  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
};

export { createDropdownStore, DropdownStoreContext, useDropdownStoreSelector };
export type { DropdownStoreType, DropdownVolatileState };
