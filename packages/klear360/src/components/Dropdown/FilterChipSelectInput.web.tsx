/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React, { useEffect } from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import { getFilterChipDisplayValue } from './filterChipSelectInputUtils';
import { useFilterChipGroupContext } from './FilterChipGroupContext.web';
import type { DataAnalyticsAttribute } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { BaseFilterChip } from '~components/FilterChip/BaseFilterChip';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import type { BaseFilterChipProps } from '~components/FilterChip/types';
import { useId } from '~utils/useId';
import { useListViewFilterContext } from '~components/ListView/ListViewFiltersContext.web';
import { useFirstRender } from '~utils/useFirstRender';

type FilterChipSelectInputProps = Pick<
  BaseFilterChipProps,
  | 'onKeyDown'
  | 'value'
  | 'label'
  | 'testID'
  | 'onClick'
  | 'selectionType'
  | 'onBlur'
  | 'showClearButton'
> & {
  accessibilityLabel?: string;
  /**
   * `selectedGroups` is only present when the Dropdown overlay content is a TreeView -
   * it contains the values of the topmost fully-selected branches
   */
  onChange?: (props: { name: string; values: string[]; selectedGroups?: string[] }) => void;
  name?: string;
  onClearButtonClick?: (props: { name: string; values: string[] }) => void;
  isDisabled?: boolean;
} & DataAnalyticsAttribute;

const _FilterChipSelectInput = (props: FilterChipSelectInputProps): React.ReactElement => {
  const idBase = useId('filter-chip-select-input');
  const {
    onClick,
    onBlur,
    onKeyDown,
    accessibilityLabel,
    testID,
    value,
    onClearButtonClick,
    label,
    onChange,
    name,
    isDisabled,
    showClearButton = true,
    ...rest
  } = props;
  const [uncontrolledInputValue, setUncontrolledInputValue] = React.useState<string[]>([]);
  const isFirstRender = useFirstRender();

  const {
    options,
    selectedIndices,
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
    selectionType,
    isControlled,
    setSelectedIndices,
    getSelectedIndices,
    controlledValueIndices,
    changeCallbackTriggerer,
    treeViewControllerRef,
  } = useDropdown();
  const isUnControlled = options.length > 0 && props.value === undefined;
  // Currently we are having 2 context for selectedFilters. One is for FilterChipGroup and other is for  ListView
  const { listViewSelectedFilters, setListViewSelectedFilters } = useListViewFilterContext();
  const {
    clearFilterCallbackTriggerer,
    setFilterChipGroupSelectedFilters,
  } = useFilterChipGroupContext();

  // `getSelectedIndices()` (a synchronous, always-current snapshot), not the reactive
  // `selectedIndices` above: this helper is only ever called from event handlers/effects keyed to
  // `changeCallbackTriggerer`, which (being a plain context value) already reflects a selection
  // change in the same render where the reactive, store-sourced `selectedIndices` can still lag
  // one commit behind - see `getSelectedIndices`'s own doc comment in useDropdown.ts
  const getValuesArrayFromIndices = (): string[] => {
    const indices = isControlled ? controlledValueIndices : getSelectedIndices();

    return indices.map((selectionIndex) => options[selectionIndex].value);
  };

  useEffect(() => {
    const valueNotEmpty =
      (typeof value === 'string' && value.trim() !== '') ||
      (Array.isArray(value) && value.length > 0);

    // Compare actual selected values (not just lengths) to detect controlled value changes
    const currentSelectedValues = selectedIndices.map((i) => options[i]?.value);
    const isSingleValueSynced =
      typeof value === 'string' &&
      currentSelectedValues.length === 1 &&
      currentSelectedValues[0] === value;

    const isMultiValueSynced =
      Array.isArray(value) &&
      value.length === currentSelectedValues.length &&
      value.every((v) => currentSelectedValues.includes(v));

    const isValueAndSelectedIndicesSynced = isSingleValueSynced || isMultiValueSynced;

    if (isUnControlled) {
      if (listViewSelectedFilters[label]) {
        const savedIndices = (listViewSelectedFilters[label] as unknown) as number[];
        setSelectedIndices(savedIndices);
        const inputValue = savedIndices.map((selectionIndex) => options[selectionIndex].value);
        setUncontrolledInputValue(inputValue);
        setFilterChipGroupSelectedFilters((prev) =>
          prev.includes(label) ? prev : [...prev, label],
        );
      } else {
        setSelectedIndices([]);
      }
    } else if (listViewSelectedFilters[label]) {
      const savedIndices = (listViewSelectedFilters[label] as unknown) as number[];
      setSelectedIndices(savedIndices);
      // Sync selected indices when controlled value changes or on first render with options loaded.
      // An emptied value clears the selection too, so consumers can reset from outside the chip
      // (e.g. a Clear button in the dropdown footer)
    } else if (!isValueAndSelectedIndicesSynced && options.length > 0) {
      const newSelectedIndices = !valueNotEmpty
        ? []
        : options
            .map((option, index) => {
              const isSelected =
                typeof value === 'string'
                  ? option.value === value
                  : Array.isArray(value) && value.includes(option.value);
              return isSelected ? index : -1;
            })
            .filter((index) => index !== -1);
      setSelectedIndices(newSelectedIndices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnControlled, options, value]);

  const handleClearButtonClick = (): void => {
    props.onClearButtonClick?.({ name: name ?? idBase, values: getValuesArrayFromIndices() });
    props.onChange?.({ name: name ?? idBase, values: [] });
    setFilterChipGroupSelectedFilters((prev) => prev.filter((filter) => filter !== label));
    setListViewSelectedFilters((prev) => {
      const { [label]: _, ...updatedFilters } = prev;
      return updatedFilters;
    });
    setUncontrolledInputValue([]);
    setSelectedIndices([]);
  };

  useEffect(() => {
    if (clearFilterCallbackTriggerer) {
      handleClearButtonClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearFilterCallbackTriggerer]);

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    // see `getValuesArrayFromIndices`'s own comment: these read the synchronous snapshot, not
    // the reactive `selectedIndices`, since this effect is keyed to `changeCallbackTriggerer`
    const currentSelectedIndices = isControlled ? controlledValueIndices : getSelectedIndices();

    // §6.5: additive - only present when overlay content is a TreeView
    const selectedGroups = treeViewControllerRef.current?.getSelectedGroups(currentSelectedIndices);
    props.onChange?.({
      name: props.name || idBase,
      values: getValuesArrayFromIndices(),
      ...(selectedGroups ? { selectedGroups } : {}),
    });
    if (isUnControlled) {
      setUncontrolledInputValue(getValuesArrayFromIndices());
    }

    const isValueEmpty = currentSelectedIndices.length === 0;
    if (isValueEmpty) {
      setFilterChipGroupSelectedFilters((prev) => prev.filter((filter) => filter !== label));
      setListViewSelectedFilters((prev) => {
        const { [label]: _, ...updatedFilters } = prev;
        return updatedFilters;
      });
    } else {
      setFilterChipGroupSelectedFilters((prev) => (prev.includes(label) ? prev : [...prev, label]));
      setListViewSelectedFilters((prev) => ({
        ...prev,
        [label]: currentSelectedIndices as number[],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);

  const handleKeyDown = (e: React.KeyboardEvent<Element>): void => {
    onKeyDown?.(e);
    onTriggerKeydown?.({ event: e as React.KeyboardEvent<HTMLInputElement> });

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
    }

    if ((e.key === 'Enter' || e.key === ' ') && !isOpen) {
      e.preventDefault();
      e.stopPropagation();
      onTriggerClick();
    }
  };
  return (
    <BaseFilterChip
      label={label}
      value={getFilterChipDisplayValue({
        value: props.value,
        options,
        selectionType,
        uncontrolledInputValue,
        displayOverride: treeViewControllerRef.current?.getDisplayOverride(selectedIndices),
      })}
      onClearButtonClick={handleClearButtonClick}
      showClearButton={showClearButton}
      selectionType={selectionType}
      testID={testID}
      {...rest}
      ref={triggererRef as any}
      onKeyDown={handleKeyDown}
      accessibilityProps={{
        label: accessibilityLabel ?? label,
        hasPopup: getActionListContainerRole(hasFooterAction, 'FilterChipSelectInput'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      }}
      onClick={(e) => {
        onTriggerClick();
        onClick?.(e);
      }}
      onBlur={(e) => {
        onBlur?.(e);
      }}
      isDisabled={isDisabled}
    />
  );
};

const FilterChipSelectInput = assignWithoutSideEffects(_FilterChipSelectInput, {
  componentId: dropdownComponentIds.triggers.FilterChipSelectInput,
});

export { FilterChipSelectInput };
