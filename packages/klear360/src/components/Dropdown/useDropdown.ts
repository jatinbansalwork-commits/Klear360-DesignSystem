import React from 'react';

import {
  ensureScrollVisiblity,
  getActionFromKey,
  getIndexByLetter,
  getUpdatedIndex,
  makeInputDisplayValue,
  makeInputValue,
  performAction,
} from './dropdownUtils';
import type { SelectActionsType } from './dropdownUtils';
import type { DropdownProps } from './types';

import { dropdownComponentIds } from './dropdownComponentIds';
import { useDropdownStoreSelector } from './useDropdownStore';
import type { FormInputHandleOnKeyDownEvent } from '~components/Form/FormTypes';
import { isReactNative, isBrowser } from '~utils';
import type { ContainerElementType } from '~utils/types';
import { fireNativeEvent } from '~utils/fireNativeEvent';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

type OptionsType = {
  title: string;
  value: string;
  onClickTrigger?: (isSelected: boolean) => void;
}[];

/**
 * Controller published by TreeView when it is rendered as Dropdown overlay content.
 *
 * All tree-specific behaviour inside Dropdown is gated on this being present, so
 * ActionList (and any other overlay content) paths stay behaviourally identical
 */
type TreeViewDropdownControllerType = {
  /**
   * Option indices of rows that are currently traversable (not hidden under a collapsed branch).
   * Used for visibility-aware keyboard traversal (same idea as AutoComplete's filteredValues)
   */
  getVisibleOptionIndices: () => number[];
  /**
   * ArrowRight: expand the active collapsed branch, or move to its first child
   */
  onArrowRightKeydown: (activeIndex: number) => void;
  /**
   * ArrowLeft: collapse the active expanded branch, or move to its parent
   */
  onArrowLeftKeydown: (activeIndex: number) => void;
  /**
   * Returns true when the tree handled the selection itself
   * (branch cascade toggle in multiple selection / load-more activation).
   * Returning false falls through to the default selectOption path
   */
  handleOptionSelect: (index: number, properties?: { key?: string }) => boolean;
  /**
   * Values of the topmost fully-selected branches, included in the trigger's onChange payload
   */
  getSelectedGroups: (selectedIndices: number[]) => string[];
  /**
   * Smallest describing set for the trigger display (D5)
   */
  getDisplayOverride: (selectedIndices: number[]) => { label: string; count: number } | undefined;
};

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  close: () => void;
  /**
   * contains the indexes of selected items
   */
  setSelectedIndices: (value: number[]) => void;
  /**
   * contains the indexes of selected items during controlled selection
   */
  controlledValueIndices: number[];
  setControlledValueIndices: (value: number[]) => void;
  /**
   * contains information about all the options inside actionlist
   */
  options: OptionsType;
  setOptions: (value: OptionsType) => void;

  /**
   * Setter for filtered values for AutoComplete Inputs. The current value is published through
   * the volatile store (see useDropdownStore.ts), not here - see "Volatile state" below
   */
  setFilteredValues: (values: string[]) => void;

  /** Setter for the currently active (focussed) index. See "Volatile state" below */
  setActiveIndex: (value: number) => void;

  /** Currently active (focussed) tag  */
  activeTagIndex: number;
  setActiveTagIndex: (value: number) => void;

  /**
   * Sometimes we want to ignore the blur event to keep dropdown open but not ignore the blur animation from selectinput
   * E.g. When someone clicks on Footer, we just want to ignore the blur event and not the blur animation
   */
  shouldIgnoreBlurAnimation: boolean;
  setShouldIgnoreBlurAnimation: (value: boolean) => void;
  /** Setter for whether keyboard was used. See "Volatile state" below */
  setIsKeydownPressed: (value: boolean) => void;
  /** common baseId which is prepended to multiple other ids inside this dropdown  */
  dropdownBaseId: string;
  /** Which element has triggered the dropdown */
  dropdownTriggerer?:
    | 'SelectInput'
    | 'DropdownButton'
    | 'DropdownIconButton'
    | 'AutoComplete'
    | 'DropdownLink'
    | 'SearchInput'
    | 'FilterChipSelectInput'
    | 'InputDropdownButton';

  /** ref of triggerer. Used to call focus in certain places */
  triggererRef: React.MutableRefObject<HTMLButtonElement | null>;
  headerAutoCompleteRef: React.MutableRefObject<HTMLButtonElement | null>;
  triggererWrapperRef: React.MutableRefObject<ContainerElementType | null>;
  actionListItemRef: React.RefObject<HTMLDivElement | null>;
  isTagDismissedRef: React.RefObject<{ value: boolean } | null>;
  visibleTagsCountRef: React.RefObject<{ value: number } | null>;

  selectionType?: DropdownProps['selectionType'];
  /** whether footer has an action item.
   * certain a11y behaviour changes happen here
   * E.g. tabbing moves focus to that action instead of outside
   */
  hasFooterAction: boolean;
  setHasFooterAction: (value: boolean) => void;

  /**
   * Apart from dropdownTriggerer prop, we also set this boolean because in BottomSheetHeader and DropdownHeader, the trigger can be Select but they can also have autocomplete inside of header
   */
  hasAutoCompleteInHeader: boolean;
  setHasAutoCompleteInHeader: (value: boolean) => void;

  /**
   * A value that can be used in dependency array to know when Dropdown value is changed.
   *
   * E.g.
   * ```ts
   * useEffect(() => {
   *  console.log('Uncontrolled value change');
   * }, [changeCallbackTriggerer])
   * ```
   */
  changeCallbackTriggerer: number;
  setChangeCallbackTriggerer: React.Dispatch<React.SetStateAction<number>>;

  /**
   * true when SelectInput has `value` prop (when it is controlled)
   */
  isControlled: boolean;
  setIsControlled: (isControlled: boolean) => void;

  /**
   * Set by TreeView when it is rendered as the overlay content. null for every other
   * overlay content (ActionList, Menu, custom slots)
   */
  treeViewControllerRef: React.MutableRefObject<TreeViewDropdownControllerType | null>;

  /**
   * Handles the click even on option.
   *
   * Contains the logic that selects the option, moves the focus, etc.
   *
   * Stable for the lifetime of the Dropdown (built once in Dropdown.tsx via `useDropdownActions`)
   * so that `ActionListItem` (see its own file) can read it straight off context without
   * subscribing to the volatile store - see "Volatile state" below
   */
  onOptionClick: (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => void;

  /**
   * Removes the option with given optionsIndex. Stable, see `onOptionClick`
   */
  removeOption: (index: number) => void;

  /**
   * Selects / deselects multiple options in one state update with a single onChange.
   * Used by TreeView branch cascade toggles. Stable, see `onOptionClick`
   */
  selectOptionsBatch: (indices: number[], action: 'select' | 'deselect') => void;

  /**
   * Current `selectedIndices`, read fresh (never stale, see `onOptionClick`). For consumers that
   * need to make an imperative decision (e.g. TreeView's branch-cascade toggle deciding
   * select-vs-deselect) based on the CURRENT selection synchronously, in the same tick as calling
   * `selectOptionsBatch`/`selectOption` right after - unlike the reactive `selectedIndices`
   * `useDropdown()` returns below, which is sourced from the volatile store and can lag by one
   * commit behind Dropdown's own render (the store only updates via a layout effect)
   */
  getSelectedIndices: () => number[];

  /**
   * Marks the given index as selected. Stable, see `onOptionClick`
   */
  selectOption: (index: number, properties?: { closeOnSelection?: boolean }) => boolean;

  /**
   * Moves the active (focussed) index according to `actionType`. Stable, see `onOptionClick`
   */
  onOptionChange: (actionType: SelectActionsType, index?: number) => void;
};

/**
 * Volatile state is NOT stored in `DropdownContextType` / `DropdownContext` on purpose.
 *
 * `activeIndex`, `selectedIndices`, `filteredValues`, and `isKeydownPressed` change on every
 * arrow-key press, filter keystroke, selection, and keyboard/mouse switch respectively. Bundling
 * them into the same `useMemo`'d context object as everything else (as used to be the case) meant
 * every change produced a new context value, re-rendering every consumer of `useDropdown()` -
 * including `ActionListItem`, which is mounted once per option and wrapped in `React.memo` to no
 * effect, since `memo` cannot block a re-render triggered by the component's own context
 * subscription (same root cause as TreeView's `TreeViewItem`, see
 * TreeView/_decisions/decisions.md, "React.memo evaluation").
 *
 * These 4 fields are published through a `useSyncExternalStore`-based store instead
 * (`useDropdownStore.ts`), so `ActionListItem` can subscribe to only the slice relevant to its
 * own `_index` / `value` (`useDropdownStoreSelector`) instead of the whole state. `useDropdown()`
 * still returns all 4 reactively (via a whole-state store subscription below) for every other
 * consumer (`SelectInput`, `AutoComplete`, `FilterChipSelectInput`, `Dropdown` itself, etc.) -
 * all single-instance-per-Dropdown, so subscribing to the full volatile state there is exactly as
 * cheap as it already was.
 */
const DropdownContext = React.createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: noop,
  close: noop,
  setSelectedIndices: noop,
  controlledValueIndices: [],
  setControlledValueIndices: noop,
  options: [],
  setOptions: noop,
  setFilteredValues: noop,
  setActiveIndex: noop,
  activeTagIndex: -1,
  setActiveTagIndex: noop,
  shouldIgnoreBlurAnimation: false,
  setShouldIgnoreBlurAnimation: noop,
  hasFooterAction: false,
  setHasFooterAction: noop,
  hasAutoCompleteInHeader: false,
  setHasAutoCompleteInHeader: noop,
  setIsKeydownPressed: noop,
  changeCallbackTriggerer: 0,
  setChangeCallbackTriggerer: noop,
  isControlled: false,
  setIsControlled: noop,
  dropdownBaseId: '',
  actionListItemRef: {
    current: null,
  },
  triggererRef: {
    current: null,
  },
  headerAutoCompleteRef: {
    current: null,
  },
  isTagDismissedRef: {
    current: null,
  },
  visibleTagsCountRef: {
    current: null,
  },
  triggererWrapperRef: {
    current: null,
  },
  treeViewControllerRef: {
    current: null,
  },
  onOptionClick: noop,
  removeOption: noop,
  selectOptionsBatch: noop,
  getSelectedIndices: () => [],
  selectOption: () => false,
  onOptionChange: noop,
});

let searchTimeout: number;
let searchString = '';

/**
 * Latest, render-time-only values that Dropdown's stable actions (see `useDropdownActions`) need
 * to read at call time, but that don't belong in the volatile store (they don't need per-item
 * selector granularity - there's exactly one Dropdown instance reading them per interaction)
 */
type DropdownActionsLatestState = {
  options: OptionsType;
  isDropdownOpen: boolean;
  isControlled: boolean;
  hasAutoCompleteInHeader: boolean;
  selectionType: DropdownProps['selectionType'];
  activeIndex: number;
  selectedIndices: number[];
  filteredValues: string[];
};

type UseDropdownActionsParams = {
  latestRef: React.MutableRefObject<DropdownActionsLatestState>;
  dropdownTriggererRef: React.MutableRefObject<DropdownContextType['dropdownTriggerer']>;
  triggererRef: React.MutableRefObject<HTMLButtonElement | null>;
  headerAutoCompleteRef: React.MutableRefObject<HTMLButtonElement | null>;
  actionListItemRef: React.RefObject<HTMLDivElement | null>;
  treeViewControllerRef: React.MutableRefObject<TreeViewDropdownControllerType | null>;
  setActiveIndex: (value: number) => void;
  setActiveTagIndex: (value: number) => void;
  setIsKeydownPressed: (value: boolean) => void;
  setSelectedIndices: (value: number[]) => void;
  setControlledValueIndices: (value: number[]) => void;
  setChangeCallbackTriggerer: React.Dispatch<React.SetStateAction<number>>;
  close: () => void;
};

type DropdownActions = Pick<
  DropdownContextType,
  | 'onOptionClick'
  | 'removeOption'
  | 'selectOptionsBatch'
  | 'getSelectedIndices'
  | 'selectOption'
  | 'onOptionChange'
>;

/**
 * Builds Dropdown's selection/navigation actions ONCE per Dropdown instance (called from
 * Dropdown.tsx), with a stable identity for their lifetime - unlike everything else
 * `useDropdown()` computes, which is recreated on every call.
 *
 * They read the current volatile state (`activeIndex`, `selectedIndices`, `filteredValues`)
 * off `latestRef` at call time, not from a reactive closure, so they stay correct even when
 * called from an `ActionListItem` that - by design - hasn't re-rendered recently. This reads
 * `latestRef` rather than the store from useDropdownStore.ts on purpose: the store only syncs on
 * the NEXT commit via a layout effect, so two of these actions firing within the same render pass
 * (e.g. two ArrowDown keydowns handled before the first's effect has run) could otherwise read a
 * stale value - `latestRef` is mutated synchronously during Dropdown's render instead, so it is
 * never behind. See `DropdownContextType`'s "Volatile state" comment above.
 */
const useDropdownActions = ({
  latestRef,
  dropdownTriggererRef,
  triggererRef,
  headerAutoCompleteRef,
  actionListItemRef,
  treeViewControllerRef,
  setActiveIndex,
  setActiveTagIndex,
  setIsKeydownPressed,
  setSelectedIndices,
  setControlledValueIndices,
  setChangeCallbackTriggerer,
  close,
}: UseDropdownActionsParams): DropdownActions => {
  const setIndices = React.useCallback(
    (indices: number[]): void => {
      if (latestRef.current.isControlled) {
        setControlledValueIndices(indices);
      } else {
        setSelectedIndices(indices);
      }
    },
    [latestRef, setControlledValueIndices, setSelectedIndices],
  );

  const getSelectedIndices = React.useCallback((): number[] => latestRef.current.selectedIndices, [
    latestRef,
  ]);

  const removeOption = React.useCallback(
    (index: number): void => {
      const { selectedIndices } = latestRef.current;
      const existingItemIndex = selectedIndices.indexOf(index);
      if (existingItemIndex < 0) {
        return;
      }

      setIndices([
        ...selectedIndices.slice(0, existingItemIndex),
        ...selectedIndices.slice(existingItemIndex + 1),
      ]);
    },
    [latestRef, setIndices],
  );

  const selectOption = React.useCallback(
    (
      index: number,
      properties: { closeOnSelection?: boolean } = { closeOnSelection: true },
    ): boolean => {
      let isSelected = false;
      const { selectedIndices, activeIndex, options, selectionType } = latestRef.current;

      if (index < 0 || index > options.length - 1) {
        return isSelected;
      }

      if (selectionType === 'multiple') {
        if (selectedIndices.includes(index)) {
          removeOption(index);
          isSelected = false;
        } else {
          setIndices([...selectedIndices, index]);
          isSelected = true;
        }
      } else {
        setIndices([index]);
        isSelected = true;
      }

      // Triggers `onChange` on SelectInput
      setChangeCallbackTriggerer((triggerer) => triggerer + 1);

      if (activeIndex !== index) {
        setActiveIndex(index);
      }

      if (properties?.closeOnSelection && selectionType !== 'multiple') {
        close();
      }

      return isSelected;
    },
    [close, latestRef, removeOption, setActiveIndex, setChangeCallbackTriggerer, setIndices],
  );

  const selectOptionsBatch = React.useCallback(
    (indices: number[], action: 'select' | 'deselect'): void => {
      if (indices.length === 0) {
        return;
      }

      const { selectedIndices, options } = latestRef.current;

      let updatedIndices: number[];
      if (action === 'select') {
        updatedIndices = [...selectedIndices];
        for (const index of indices) {
          if (index >= 0 && index <= options.length - 1 && !updatedIndices.includes(index)) {
            updatedIndices.push(index);
          }
        }
      } else {
        updatedIndices = selectedIndices.filter(
          (selectedIndex) => !indices.includes(selectedIndex),
        );
      }

      setIndices(updatedIndices);
      setChangeCallbackTriggerer((triggerer) => triggerer + 1);
    },
    [latestRef, setChangeCallbackTriggerer, setIndices],
  );

  const onOptionChange = React.useCallback(
    (actionType: SelectActionsType, index?: number): void => {
      setActiveTagIndex(-1);
      const { activeIndex, filteredValues, options, hasAutoCompleteInHeader } = latestRef.current;
      const newIndex = index ?? activeIndex;
      const hasAutoComplete =
        hasAutoCompleteInHeader ||
        dropdownTriggererRef.current === dropdownComponentIds.triggers.AutoComplete;
      const treeViewController = treeViewControllerRef.current;
      let updatedIndex: number;

      if (treeViewController) {
        // When overlay content is a TreeView, traversal skips rows hidden under collapsed
        // branches (indices stay stable across expand / collapse, only traversal changes)
        const visibleIndexes = treeViewController.getVisibleOptionIndices();
        updatedIndex =
          visibleIndexes[
            getUpdatedIndex({
              currentIndex: visibleIndexes.indexOf(newIndex),
              maxIndex: visibleIndexes.length - 1,
              actionType,
            })
          ] ?? newIndex;
      } else if (hasAutoComplete && filteredValues.length > 0) {
        // When its autocomplete, we don't loop over all options. We only loop on filtered options
        const filteredIndexes = filteredValues
          .map((filteredValue) => options.findIndex((option) => option.value === filteredValue))
          .sort((a, b) => a - b);

        updatedIndex =
          filteredIndexes[
            getUpdatedIndex({
              currentIndex: filteredIndexes.indexOf(newIndex),
              maxIndex: filteredIndexes.length - 1,
              actionType,
            })
          ];
      } else {
        updatedIndex = getUpdatedIndex({
          currentIndex: newIndex,
          maxIndex: options.length - 1,
          actionType,
        });
      }
      setActiveIndex(updatedIndex);

      const optionValues = options.map((option) => option.value);
      ensureScrollVisiblity(updatedIndex, actionListItemRef.current, optionValues);
      if (isBrowser()) {
        fireNativeEvent(actionListItemRef as React.RefObject<HTMLElement>, ['change', 'input']);
      }
    },
    [
      actionListItemRef,
      dropdownTriggererRef,
      latestRef,
      setActiveIndex,
      setActiveTagIndex,
      treeViewControllerRef,
    ],
  );

  /**
   * Click handler when user clicks on any particular option.
   *
   * It
   * - changes the option focus
   * - selects that option
   * - moves focus to combobox
   */
  const onOptionClick = React.useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
      index: number,
    ): void => {
      setIsKeydownPressed(false);
      const actionType = getActionFromKey(
        e,
        latestRef.current.isDropdownOpen,
        dropdownTriggererRef.current,
      );
      if (typeof actionType === 'number') {
        onOptionChange(actionType, index);
      }
      selectOption(index);

      if (!isReactNative()) {
        if (latestRef.current.hasAutoCompleteInHeader) {
          // move focus to autocomplete
          headerAutoCompleteRef.current?.focus();
        } else {
          triggererRef.current?.focus();
        }
      }
    },
    [
      dropdownTriggererRef,
      headerAutoCompleteRef,
      latestRef,
      onOptionChange,
      selectOption,
      setIsKeydownPressed,
      triggererRef,
    ],
  );

  return {
    onOptionClick,
    removeOption,
    selectOptionsBatch,
    getSelectedIndices,
    selectOption,
    onOptionChange,
  };
};

type UseDropdownReturnValue = DropdownContextType & {
  /**
   * contains the indexes of selected items
   */
  selectedIndices: number[];
  /**
   * Filtered values for AutoComplete Inputs
   */
  filteredValues: string[];
  /** Currently active (focussed) index  */
  activeIndex: number;
  /** Tells you if keyboard was used. Its false by default and turns into true when keydown is called  */
  isKeydownPressed: boolean;

  /**
   * Click event on combobox. Toggles the dropdown
   */
  onTriggerClick: () => void;

  /**
   * Keydown event of combobox. Handles most of the keyboard accessibility of dropdown
   */
  onTriggerKeydown: FormInputHandleOnKeyDownEvent | undefined;

  /**
   * value that is used during form submissions
   */
  value: string;
  /**
   * This is the value that is displayed inside select after selection
   */
  displayValue: string;
};

/**
 * Handles almost all the functionality of dropdown.
 *
 * Returns the values from DropdownContext along with some helper functions and event handlers
 *
 */
const useDropdown = (): UseDropdownReturnValue => {
  const {
    isOpen,
    setIsOpen,
    close,
    setSelectedIndices,
    activeTagIndex,
    setActiveTagIndex,
    visibleTagsCountRef,
    setIsKeydownPressed,
    options,
    selectionType,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    setControlledValueIndices,
    dropdownTriggerer,
    onOptionClick,
    removeOption,
    selectOptionsBatch,
    selectOption,
    onOptionChange,
    ...rest
  } = React.useContext(DropdownContext);

  // see "Volatile state" comment on DropdownContextType above
  const {
    activeIndex,
    selectedIndices,
    filteredValues,
    isKeydownPressed,
  } = useDropdownStoreSelector((state) => state);

  /**
   * Click listener for combobox (or any triggerer of the dropdown)
   */
  const onTriggerClick = (): void => {
    if (isOpen) {
      close();
    } else {
      setIsOpen(true);
    }
  };

  /**
   * Function we call to handle the typeahead.
   *
   * It takes a letter, stores that letter in searchString (and clears it after timeout) to maintain a word
   *
   * Then searches for that word in options and moves focus there.
   */
  const onComboType = (letter: string, actionType: SelectActionsType): void => {
    // open the listbox if it is closed
    setIsOpen(true);

    if (
      rest.hasAutoCompleteInHeader ||
      dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete
    ) {
      return;
    }

    if (typeof searchTimeout === 'number') {
      window.clearTimeout(searchTimeout);
    }

    searchTimeout = window.setTimeout(() => {
      searchString = '';
    }, 500);
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    searchString = searchString + letter;
    const optionTitles = options.map((option) => option.title);
    const searchIndex = getIndexByLetter(optionTitles, searchString, activeIndex + 1);

    // if a match was found, go to it
    if (searchIndex >= 0) {
      onOptionChange(actionType, searchIndex);
    }
    // if no matches, clear the timeout and search string
    else {
      window.clearTimeout(searchTimeout);
      searchString = '';
    }
  };

  /**
   * Keydown event of combobox. Handles most of the keyboard accessibility of dropdown
   */
  const onTriggerKeydown = (e: {
    event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>;
  }): void => {
    if (!isKeydownPressed && ![' ', 'Enter', 'Escape', 'Meta'].includes(e.event.key)) {
      // When keydown is not already pressed and its not Enter, Space, Command, or Escape key (those are generic keys and we only want to handle arrow keys or home buttons etc)
      setIsKeydownPressed(true);
    }

    const actionType = getActionFromKey(e.event, isOpen, dropdownTriggerer);

    if (actionType) {
      performAction(actionType, e, {
        setIsOpen,
        close,
        onOptionChange,
        onComboType,
        selectCurrentOption: (event) => {
          if (activeIndex < 0) {
            return;
          }

          // TreeView handles branch cascade toggles and load-more rows itself
          const treeViewController = rest.treeViewControllerRef?.current;
          if (treeViewController?.handleOptionSelect(activeIndex, { key: event?.key })) {
            return;
          }

          const isSelected = selectOption(activeIndex);
          if (rest.hasFooterAction && !isReactNative()) {
            rest.triggererRef.current?.focus();
          }

          options[activeIndex].onClickTrigger?.(isSelected);
        },
        // present only when overlay content is a TreeView; undefined keeps
        // ArrowLeft / ArrowRight behaviour unchanged for every other content
        onTreeExpandCollapse: rest.treeViewControllerRef?.current
          ? (action) => {
              if (action === 'Expand') {
                rest.treeViewControllerRef.current?.onArrowRightKeydown(activeIndex);
              } else {
                rest.treeViewControllerRef.current?.onArrowLeftKeydown(activeIndex);
              }
            }
          : undefined,
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    close,
    selectedIndices,
    setSelectedIndices,
    filteredValues,
    removeOption,
    selectOptionsBatch,
    selectOption,
    onOptionChange,
    setControlledValueIndices,
    onTriggerClick,
    onTriggerKeydown,
    onOptionClick,
    activeIndex,
    activeTagIndex,
    setActiveTagIndex,
    visibleTagsCountRef,
    isKeydownPressed,
    setIsKeydownPressed,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    options,
    value: makeInputValue(selectedIndices, options),
    displayValue: makeInputDisplayValue(
      selectedIndices,
      options,
      rest.treeViewControllerRef?.current?.getDisplayOverride(selectedIndices),
    ),
    selectionType,
    dropdownTriggerer,
    ...rest,
  };
};

export type { DropdownContextType, OptionsType, TreeViewDropdownControllerType };
export { useDropdown, useDropdownActions, DropdownContext };
