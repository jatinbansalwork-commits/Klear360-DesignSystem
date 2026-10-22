import React from 'react';
import { DropdownContext, useDropdownActions } from './useDropdown';
import type { DropdownContextType } from './useDropdown';
import { createDropdownStore, DropdownStoreContext } from './useDropdownStore';
import type { DropdownStoreType } from './useDropdownStore';
import type { DropdownProps } from './types';
import { dropdownComponentIds } from './dropdownComponentIds';
import { useId } from '~utils/useId';
import { ComponentIds as bottomSheetComponentIds } from '~components/BottomSheet/componentIds';
import { BottomSheetAndDropdownGlueContext } from '~components/BottomSheet/BottomSheetContext';
import { getStyledProps } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { throwKlear360Error } from '~utils/logger';
import type { Klear360ElementRef, ContainerElementType } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import { mergeRefs } from '~utils/useMergeRefs';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useButtonGroupContext } from '~components/ButtonGroup/ButtonGroupContext';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { isReactNative } from '~utils';

const validDropdownChildren = [
  // TODO: Remove Box once CountrySelector's button sizing is fixed
  dropdownComponentIds.BaseBox,
  dropdownComponentIds.triggers.SelectInput,
  dropdownComponentIds.triggers.SearchInput,
  dropdownComponentIds.triggers.DropdownButton,
  dropdownComponentIds.triggers.DropdownIconButton,
  dropdownComponentIds.triggers.DropdownLink,
  dropdownComponentIds.DropdownOverlay,
  dropdownComponentIds.triggers.AutoComplete,
  bottomSheetComponentIds.BottomSheet,
  dropdownComponentIds.triggers.FilterChipSelectInput,
  dropdownComponentIds.triggers.InputDropdownButton,
];

/**
 * ### Dropdown component
 *
 * Dropdown component is generic component that controls the dropdown functionality.
 * It can be used with multiple triggers and mostly contains ActionList component inside it
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <Dropdown selectionType="single">
 *  <SelectInput />
 *  <DropdownOverlay>
 *    <ActionList>
 *      <ActionListItem />
 *      <ActionListItem />
 *    </ActionList>
 *  </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 * ---
 *
 * Checkout {@link https://klear360.klear.com/?path=/docs/components-dropdown-with-select--with-single-select Dropdown Documentation}
 */
const _Dropdown = (
  {
    children,
    isOpen: isOpenControlled,
    onOpenChange,
    selectionType = 'single',
    testID,
    _width,
    ...rest
  }: DropdownProps,
  ref: React.Ref<Klear360ElementRef>,
): React.ReactElement => {
  const [options, setOptions] = React.useState<DropdownContextType['options']>([]);
  const [filteredValues, setFilteredValues] = React.useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
  const [controlledValueIndices, setControlledValueIndices] = React.useState<
    DropdownContextType['controlledValueIndices']
  >([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
  const [shouldIgnoreBlurAnimation, setShouldIgnoreBlurAnimation] = React.useState(false);
  const [hasFooterAction, setHasFooterAction] = React.useState(false);
  const [hasAutoCompleteInHeader, setHasAutoCompleteInHeader] = React.useState(false);
  const [isKeydownPressed, setIsKeydownPressed] = React.useState(false);
  const [changeCallbackTriggerer, setChangeCallbackTriggerer] = React.useState<
    DropdownContextType['changeCallbackTriggerer']
  >(0);
  const [isControlled, setIsControlled] = React.useState(false);
  // keep track if dropdown contains bottomsheet
  const [dropdownHasBottomSheet, setDropdownHasBottomSheet] = React.useState(false);

  /**
   * In inputs, actual input is smaller than the visible input wrapper.
   * You can set this reference in such cases so floating ui calculations happen correctly
   * */
  const triggererWrapperRef = React.useRef<ContainerElementType>(null);
  const triggererRef = React.useRef<HTMLButtonElement>(null);
  const headerAutoCompleteRef = React.useRef<HTMLButtonElement>(null);
  const actionListItemRef = React.useRef<HTMLDivElement>(null);
  const dropdownTriggerer = React.useRef<DropdownContextType['dropdownTriggerer']>();
  const isTagDismissedRef = React.useRef<{ value: boolean } | null>({ value: false });
  const visibleTagsCountRef = React.useRef<{ value: number }>({ value: 0 });
  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);
  // set by TreeView when it is the overlay content; stays null for every other content
  const treeViewControllerRef = React.useRef<
    DropdownContextType['treeViewControllerRef']['current']
  >(null);

  const dropdownBaseId = useId('dropdown');
  const isDropdownOpenRef = React.useRef(isOpenControlled);

  const [isDropdownOpen, setIsDropdownOpen] = useControllableState({
    value: isOpenControlled,
    defaultValue: false,
    onChange: (isOpenControlledValue) => {
      isDropdownOpenRef.current = isOpenControlledValue;
      onOpenChange?.({ isOpen: isOpenControlledValue });
    },
  });

  isDropdownOpenRef.current = isDropdownOpen;

  const setIsOpen = (isOpenValue: boolean): void => {
    isDropdownOpenRef.current = isOpenValue;
    setIsDropdownOpen(() => isOpenValue);
  };

  const close = React.useCallback(() => {
    setActiveTagIndex(-1);
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (__DEV__) {
        if (!validDropdownChildren.includes(getComponentId(child) ?? '')) {
          throwKlear360Error({
            message: `Dropdown can only have one of following elements as children - \n\n ${validDropdownChildren.join(
              ', ',
            )} \n\n Check out: https://klear360.klear.com/?path=/story/components-dropdown`,
            moduleName: 'Dropdown',
          });
        }
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.SelectInput)) {
        dropdownTriggerer.current = 'SelectInput';
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.SearchInput)) {
        dropdownTriggerer.current = 'SearchInput';
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.DropdownButton)) {
        dropdownTriggerer.current = 'DropdownButton';
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.DropdownIconButton)) {
        dropdownTriggerer.current = 'DropdownIconButton';
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.AutoComplete)) {
        dropdownTriggerer.current = 'AutoComplete';
      }
      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.FilterChipSelectInput)) {
        dropdownTriggerer.current = 'FilterChipSelectInput';
      }
      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.InputDropdownButton)) {
        dropdownTriggerer.current = 'InputDropdownButton';
      }
    }
  });

  // ---------------- volatile state store (active index / selection / filter / keydown) ----------------
  // One store per Dropdown instance, created once; only `setState` is called on later renders.
  // See useDropdownStore.ts for why this lives outside DropdownContext
  const storeRef = React.useRef<DropdownStoreType>();
  if (!storeRef.current) {
    storeRef.current = createDropdownStore({
      activeIndex,
      selectedIndices,
      filteredValues,
      isKeydownPressed,
    });
  }
  const store = storeRef.current;
  useIsomorphicLayoutEffect(() => {
    store.setState({ activeIndex, selectedIndices, filteredValues, isKeydownPressed });
  }, [store, activeIndex, selectedIndices, filteredValues, isKeydownPressed]);

  // refreshed on every render, after everything it needs has been computed - Dropdown's stable
  // actions (useDropdownActions) only ever read through this ref, never close over the
  // variables directly, so they always see this render's values despite never being recreated.
  //
  // activeIndex/selectedIndices/filteredValues are duplicated here (also published to the store
  // above) deliberately: the store only updates on the NEXT commit via a layout effect, so two
  // of these actions firing in the same render pass (e.g. two ArrowDown keydowns in quick
  // succession, each triggering a React update before the other's effect has run) would read a
  // stale value from `store.getState()`. This ref is mutated synchronously during render instead,
  // so it is never behind - exactly as fresh as the old reactive-closure implementation was.
  const latestActionsRef = React.useRef({
    options,
    isDropdownOpen,
    isControlled,
    hasAutoCompleteInHeader,
    selectionType,
    activeIndex,
    selectedIndices,
    filteredValues,
  });
  latestActionsRef.current = {
    options,
    isDropdownOpen,
    isControlled,
    hasAutoCompleteInHeader,
    selectionType,
    activeIndex,
    selectedIndices,
    filteredValues,
  };

  const {
    onOptionClick,
    removeOption,
    selectOptionsBatch,
    getSelectedIndices,
    selectOption,
    onOptionChange,
  } = useDropdownActions({
    latestRef: latestActionsRef,
    dropdownTriggererRef: dropdownTriggerer,
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
  });

  // structural/stable only - activeIndex, selectedIndices, filteredValues, isKeydownPressed
  // change on every arrow-key press / filter keystroke / selection / keyboard-mouse switch and
  // are deliberately excluded (published through the volatile store above instead), so this
  // object itself stays referentially stable across those interactions and ActionListItem no
  // longer re-renders from context propagation on every one of them (see
  // ActionList/_decisions/decisions.md, "React.memo evaluation")
  const contextValue = React.useMemo<DropdownContextType>(
    () => ({
      isOpen: isDropdownOpen,
      setIsOpen,
      close,
      setSelectedIndices,
      controlledValueIndices,
      setControlledValueIndices,
      options,
      setOptions,
      setFilteredValues,
      setActiveIndex,
      activeTagIndex,
      setActiveTagIndex,
      visibleTagsCountRef,
      shouldIgnoreBlurAnimation,
      setShouldIgnoreBlurAnimation,
      setIsKeydownPressed,
      dropdownBaseId,
      triggererRef,
      headerAutoCompleteRef,
      triggererWrapperRef,
      actionListItemRef,
      selectionType,
      hasFooterAction,
      setHasFooterAction,
      hasAutoCompleteInHeader,
      setHasAutoCompleteInHeader,
      dropdownTriggerer: dropdownTriggerer.current,
      changeCallbackTriggerer,
      setChangeCallbackTriggerer,
      isControlled,
      setIsControlled,
      isTagDismissedRef,
      treeViewControllerRef,
      onOptionClick,
      removeOption,
      selectOptionsBatch,
      getSelectedIndices,
      selectOption,
      onOptionChange,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isDropdownOpen,
      isOpenControlled,
      controlledValueIndices,
      options,
      activeTagIndex,
      shouldIgnoreBlurAnimation,
      selectionType,
      hasFooterAction,
      changeCallbackTriggerer,
      isControlled,
      onOptionClick,
      removeOption,
      selectOptionsBatch,
      getSelectedIndices,
      selectOption,
      onOptionChange,
    ],
  );

  const BottomSheetAndDropdownGlueContextValue = React.useMemo((): BottomSheetAndDropdownGlueContext => {
    return {
      isOpen: isDropdownOpen,
      dropdownHasBottomSheet,
      hasAutoCompleteInHeader,
      setDropdownHasBottomSheet,
      // This is the dismiss function which will be injected into the BottomSheet
      // Basically <BottomSheet onDismiss={onBottomSheetDismiss} />
      onBottomSheetDismiss: close,
    };
  }, [dropdownHasBottomSheet, hasAutoCompleteInHeader, isDropdownOpen, close]);

  // Inside ButtonGroup (split-button), `height: 100%` resolves against the
  // Storybook/screen parent on React Native and stretches the whole group
  // into a tall vertical strip. Keep content-sized height in that case.
  const buttonGroupProps = useButtonGroupContext();
  const isInsideButtonGroup = Boolean(buttonGroupProps.isInsideButtonGroup);

  return (
    <BottomSheetAndDropdownGlueContext.Provider value={BottomSheetAndDropdownGlueContextValue}>
      <DropdownContext.Provider value={contextValue}>
        <DropdownStoreContext.Provider value={store}>
          <BaseBox
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={mergeRefs(ref, dropdownContainerRef as any)}
            {...metaAttribute({ name: MetaConstants.Dropdown, testID })}
            {...getStyledProps(rest)}
            {...makeAnalyticsAttribute(rest)}
            width={_width}
          >
            <BaseBox
              position="relative"
              textAlign={'left' as never}
              {...(isReactNative() && isInsideButtonGroup ? {} : { height: '100%' })}
            >
              {children}
            </BaseBox>
          </BaseBox>
        </DropdownStoreContext.Provider>
      </DropdownContext.Provider>
    </BottomSheetAndDropdownGlueContext.Provider>
  );
};

const Dropdown = assignWithoutSideEffects(React.forwardRef(_Dropdown), {
  componentId: dropdownComponentIds.Dropdown,
});

export { Dropdown };
