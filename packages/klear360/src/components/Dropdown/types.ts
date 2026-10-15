import type React from 'react';
import type { Placement } from '@floating-ui/react';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { ContainerElementType, DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';

type DropdownProps = {
  /**
   * Control open / close state of the Dropdown component
   *
   * This can be used to close the dropdown when button in the footer of dropdown is clicked
   */
  isOpen?: boolean;
  /**
   * Callback when open state of the dropdown changes
   */
  onOpenChange?: (isOpen: boolean) => void;
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
  /**
   * @private
   *
   * width prop for outer relative container of Dropdown. Use width prop on DropdownOverlay to change width of menu
   */
  _width?: BoxProps['width'];
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsKlear360;

type DropdownOverlayProps = {
  children: React.ReactElement[] | React.ReactElement;
  /**
   * Sets the z-index of the DropdownOverlay
   *
   * @default 1001
   */
  zIndex?: number;
  /**
   * Override the default width of dropdown
   *
   * Avoid overriding width in SelectInput and AutoComplete as its expected to match the input
   */
  width?: BoxProps['width'];

  /**
   * Override the default minWidth of dropdown
   *
   * Avoid overriding minWidth in SelectInput and AutoComplete as its expected to match the input
   */
  minWidth?: BoxProps['minWidth'];

  /**
   * Override the default maxWidth of dropdown
   *
   * Avoid overriding maxWidth in SelectInput and AutoComplete as its expected to match the input
   */
  maxWidth?: BoxProps['maxWidth'];

  /**
   * Reference to the element which triggers the DropdownOverlay
   *
   * This is used to position the DropdownOverlay relative to a specific element,
   * for example in PhoneNumberInput the DropdownOverlay is positioned relative to the input element
   */
  referenceRef?: React.MutableRefObject<ContainerElementType | null>;
  /**
   * Sets the placement of the DropdownOverlay
   *
   * @default 'bottom-start'
   */
  defaultPlacement?: Placement;
  /**
   * Nested Dropdown Overlay (Input Search Dropdown)
   * @default false
   * @private
   */
  _isNestedDropdown?: boolean;
} & TestID;

type FilterChipGroupProps = TestID &
  DataAnalyticsAttribute & {
    children: React.ReactNode;
    /**
     * Callback fired when the **Clear** action is clicked.
     *
     * "Clear" empties every filter and returns the group to the no-filter (empty) state. The group
     * performs the emptying itself, so uncontrolled chips are cleared and controlled chips receive
     * `onChange([])`.
     *
     * Providing this (or leaving `showClearButton` at its default) renders the Clear action.
     */
    onClearButtonClick?: () => void;
    /**
     * Callback fired when the **Reset** action is clicked.
     *
     * "Reset" is semantically different from "Clear": it returns filters to their **default**
     * values (which may be non-empty, e.g. `Status: Active`) rather than emptying them. The group
     * does NOT empty the chips in this mode — it only fires this callback, which is your hook to
     * restore each filter's default (for controlled filters, reset their `value` here).
     *
     * Providing this renders the Reset action. It can be shown **alongside** the Clear action, so a
     * group can offer both "Reset" and "Clear".
     *
     * ⚠️ For **uncontrolled** chips (no `value` prop) reset cannot restore defaults yet — there is
     * no `defaultValue` for the group to restore, so those chips visually retain their values.
     * Uncontrolled reset-to-defaults is Phase 2 — see `_decisions/filter-chip-reset.md`.
     */
    onResetButtonClick?: () => void;
    /**
     * Controls visibility of the group-level **Clear** action link (NOT the per-chip clear/cross
     * button). When `true`, the Clear link is shown whenever the group has at least one selected
     * filter.
     *
     * Note: this is distinct from `showClearButton` on `FilterChipSelectInput` /
     * `FilterChipDatePicker`, which toggles the individual chip's cross button. Set this to `false`
     * (and provide `onResetButtonClick`) for a group that should only offer Reset.
     *
     * @default true
     */
    showClearButton?: boolean;
    /**
     * Custom label for the **Clear** action link.
     *
     * @default "Clear Filter" (auto-pluralised to "Clear Filters" when more than one filter is selected)
     */
    clearButtonText?: string;
    /**
     * Custom label for the **Reset** action link.
     *
     * @default "Reset"
     */
    resetButtonText?: string;
    /**
     * `"compact"` trims the group's own vertical padding (`paddingY` goes from `spacing.4` to
     * `spacing.0`) so the chips sit flush with whatever shares their row - a trailing "All
     * filters" button, a search input, etc. `spacing.4`'s vertical padding is sized for a chip
     * group that's the only thing on its row (e.g. a dedicated filter bar); once something else
     * shares the row, that padding visibly pushes the row taller than its neighbor, which is
     * exactly the gap a consumer-side `!important` override was working around before this prop
     * existed.
     *
     * Falls back to `ListViewFilters`' own `toolbarDensity` when this group is rendered inside
     * one (via its `quickFilters` prop) and this prop isn't set directly.
     *
     * @default "comfortable"
     */
    density?: 'comfortable' | 'compact';
  };

type FilterChipGroupContextType = {
  /**
   *  Number of Selected Filters
   */
  filterChipGroupSelectedFilters: string[];
  setFilterChipGroupSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilterCallbackTriggerer: number;
  setClearFilterCallbackTriggerer: React.Dispatch<React.SetStateAction<number>>;
};
export type {
  DropdownProps,
  DropdownOverlayProps,
  FilterChipGroupProps,
  FilterChipGroupContextType,
};
