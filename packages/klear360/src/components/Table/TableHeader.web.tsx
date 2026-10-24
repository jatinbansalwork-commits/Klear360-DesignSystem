import React from 'react';
import {
  ScopedTableHeader,
  StyledFilterHeaderCell,
  StyledHeaderRow,
  StyledHeaderCell,
} from './tableScopedStyled.web';
import { checkboxCellWidth, tableHeader, tableRow, classes } from './tokens';
import { useTableRowContext, useTableDataContext } from './TableContext';
import { ComponentIds } from './componentIds';
import type {
  TableHeaderRowProps,
  TableHeaderCellProps,
  TableColumnFilterConfig,
} from './types';
import { ScopedRuntimeStyles, useStableScopeClass } from '~utils/web/scopedCssFromObject';
const applyStickyHeaderRowCellStyles = (
  row: HTMLTableRowElement | null,
  shouldHeaderBeSticky: boolean,
  stickyTopOffsetPx: number | undefined,
): void => {
  row?.querySelectorAll('th').forEach((cell) => {
    if (shouldHeaderBeSticky) {
      cell.style.position = 'sticky';
      cell.style.top = `${stickyTopOffsetPx ?? 0}px`;
    } else {
      cell.style.position = 'relative';
      cell.style.removeProperty('top');
    }
  });
};

const stickyHeaderCellStyle = (
  shouldHeaderBeSticky: boolean,
  stickyTopOffsetPx: number | undefined,
): React.CSSProperties =>
  shouldHeaderBeSticky
    ? { position: 'sticky', top: `${stickyTopOffsetPx ?? 0}px` }
    : { position: 'relative' };
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { castWebType, makeMotionTime, makeSize, makeSpace } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { useTheme } from '~components/Klear360Provider';
import getIn from '~utils/lodashButBetter/get';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { BaseInput } from '~components/Input/BaseInput';
import { CloseIcon, SearchIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';

/**
 * `sortDirection` is this column's own state - 'none' is the unsorted state, distinct from
 * 'asc'/'desc' (previously implied only by both arrows being muted). `priority` is this
 * column's 1-based rank when it's part of a multi-column sort (2+ active keys) - omit it
 * (or pass a falsy value) to keep the single-sort look unchanged.
 */
const SortIcon = ({
  sortDirection,
  priority,
}: {
  sortDirection: 'asc' | 'desc' | 'none';
  priority?: number;
}): React.ReactElement => {
  const { theme } = useTheme();
  const sortButtonScope = useStableScopeClass('tblsort');
  const sortButtonFocusStyles = React.useMemo(
    () => ({ '&:focus-visible': getFocusRingStyles({ theme }) }),
    [theme],
  );
  const defaultColor = getIn(theme.colors, 'interactive.icon.gray.disabled');
  const activeColor = getIn(theme.colors, 'interactive.icon.gray.muted');
  // Preserves the existing mapping: descending highlights the up arrow, ascending the down arrow.
  const upArrowColor = sortDirection === 'desc' ? activeColor : defaultColor;
  const downArrowColor = sortDirection === 'asc' ? activeColor : defaultColor;
  const spacing1 = makeSpace(theme.spacing[1]);
  return (
    <>
      <ScopedRuntimeStyles scopeClass={sortButtonScope} styleObject={sortButtonFocusStyles} />
      <button
      type="button"
      className={sortButtonScope}
      style={{
        cursor: 'pointer',
        border: 'none',
        padding: spacing1,
        margin: `-${spacing1}`,
        borderRadius: theme.border.radius.small,
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing1,
        transitionProperty: 'color, box-shadow',
        transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, 'duration.quick'))),
        transitionTimingFunction: castWebType(theme.motion.easing.standard),
      }}
      {...metaAttribute({ name: MetaConstants.TableSortButton })}
      {...makeAccessible({ label: 'Toggle Sort', role: 'button' })}
    >
      <svg width={20} height={20} fill="none">
        <path
          fill={upArrowColor}
          d="M10.59 2.251a.817.817 0 0 0-1.18 0L5.245 6.537a.875.875 0 0 0 0 1.212.817.817 0 0 0 1.179 0L10 4.069l3.577 3.68a.817.817 0 0 0 1.179 0 .874.874 0 0 0 0-1.212L10.589 2.25Z"
        />
        <path
          fill={downArrowColor}
          d="M9.41 17.749a.817.817 0 0 0 1.18 0l4.166-4.286a.874.874 0 0 0 0-1.212.817.817 0 0 0-1.179 0L10 15.931l-3.577-3.68a.817.817 0 0 0-1.179 0 .874.874 0 0 0 0 1.212l4.167 4.286Z"
        />
      </svg>
      {priority ? (
        <BaseBox
          minWidth={makeSize(14)}
          height={makeSize(14)}
          borderRadius="round"
          backgroundColor="interactive.background.gray.faded"
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingLeft="spacing.1"
          paddingRight="spacing.1"
        >
          <Text size="small" color="surface.text.gray.muted">
            {priority}
          </Text>
        </BaseBox>
      ) : null}
    </button>
    </>
  );
};

/**
 * A column's `headerKey` + rendered label, extracted from the real header row's
 * `TableHeaderCell` children (in order) - so the filter row below can render matching cells
 * without the consumer having to declare the column list a second time.
 *
 * `headerRow` may contain more than one `TableHeaderRow` (grouped multi-row headers) - the LAST
 * one is always the leaf/column row that lines up 1:1 with body columns, so that's the one used
 * here (see `getTableHeaderCellCount` in `Table.web.tsx` for the same convention).
 */
const getHeaderCellsMeta = (
  headerRow: React.ReactNode,
): { headerKey?: string; label: React.ReactNode }[] => {
  const headerRowElements = React.Children.toArray(headerRow).filter(
    (child) => getComponentId(child) === ComponentIds.TableHeaderRow,
  );
  const leafHeaderRowElement = headerRowElements[headerRowElements.length - 1];
  if (!React.isValidElement(leafHeaderRowElement)) return [];
  return React.Children.toArray((leafHeaderRowElement.props as TableHeaderRowProps).children)
    .filter((cell) => getComponentId(cell) === ComponentIds.TableHeaderCell)
    .map((cell) => {
      const cellProps = (React.isValidElement(cell) ? cell.props : {}) as TableHeaderCellProps;
      return { headerKey: cellProps.headerKey, label: cellProps.children };
    });
};

/**
 * Renders a filterable column's dropdown/multiselect picker (see `TableProps['filterConfig']`),
 * in place of the default text input - same composition `TableEditableDropdownCell` already uses
 * for body cells (`Dropdown` + `DropdownOverlay` + `ActionList`), just driven by the column's
 * `filterConfig.options` instead of consumer-authored `ActionListItem`s, and controlled by the
 * filter row's own `columnFilterValues` state instead of being uncontrolled.
 *
 * `isTableInputCell` matches this to its plain-text sibling below (`BaseInput isTableInputCell`) -
 * same borderless, cell-edge-flush look - rather than `SelectInput`'s normal bordered, button-like
 * appearance, which read as visually inconsistent sitting next to a plain search box in the same
 * filter row.
 *
 * Unlike that text filter, there's deliberately no leading `SearchIcon` here: this is a picker,
 * not a search - the trailing chevron already says "choose from a list", and a search icon
 * suggested you could type to search instead.
 */
const TableHeaderFilterDropdownCell = ({
  headerKey,
  config,
  value,
  labelText,
  onChange,
}: {
  headerKey: string;
  config: TableColumnFilterConfig;
  value: string | string[] | undefined;
  labelText: string;
  onChange: (value: string | string[]) => void;
}): React.ReactElement => {
  const isMultiselect = config.type === 'multiselect';
  return (
    <BaseBox flex={1} marginX="spacing.2">
      <Dropdown selectionType={isMultiselect ? 'multiple' : 'single'} _width="100%">
        <SelectInput
          testID={`table-header-filter-${headerKey}`}
          size="small"
          isTableInputCell
          value={value ?? (isMultiselect ? [] : '')}
          onChange={({ values }) => onChange(isMultiselect ? values : values[0] ?? '')}
          placeholder={`Filter ${labelText}`}
          accessibilityLabel={`Filter by ${labelText}`}
        />
        <DropdownOverlay>
          <ActionList>
            {config.options.map((option) => (
              <ActionListItem key={option.value} title={option.label} value={option.value} />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </BaseBox>
  );
};

/**
 * Auto-injected second header row rendering a compact search input for every column whose
 * `headerKey` is present in `filterFunctions` (see `TableProps['filterFunctions']`) - no extra
 * JSX required from consumers. A column also present in `filterConfig` renders a dropdown/
 * multiselect picker (see `TableHeaderFilterDropdownCell`) instead. Non-filterable columns (and
 * the leading checkbox / trailing hover-actions columns, when present) render as empty cells
 * purely to keep grid alignment.
 */
const TableHeaderFilterRow = ({
  headerRow,
  stickyTopOffsetPx,
}: {
  headerRow: React.ReactNode;
  stickyTopOffsetPx?: number;
}): React.ReactElement => {
  const {
    filterableColumns,
    columnFilterValues,
    setColumnFilterValue,
    filterConfig,
  } = useTableDataContext();
  const {
    backgroundColor,
    selectionType,
    hasHoverActions,
    showBorderedCells,
    shouldHeaderBeSticky,
  } = useTableRowContext();
  const cellsMeta = getHeaderCellsMeta(headerRow);
  // See `_TableHeaderRow`'s `cellStickyTopOffsetPx` - only meaningful once cells are sticky.
  const cellStickyTopOffsetPx = shouldHeaderBeSticky
    ? stickyTopOffsetPx !== undefined
      ? stickyTopOffsetPx
      : 0
    : undefined;
  const filterCellStyle = stickyHeaderCellStyle(shouldHeaderBeSticky, cellStickyTopOffsetPx);
  const syncFilterRowStickyStyles = React.useCallback(
    (row: HTMLTableRowElement | null) => {
      applyStickyHeaderRowCellStyles(row, shouldHeaderBeSticky, cellStickyTopOffsetPx);
    },
    [cellStickyTopOffsetPx, shouldHeaderBeSticky],
  );

  return (
    // See the real header row's own `role="row"` override below for why this is explicit.
    <StyledHeaderRow
      ref={syncFilterRowStickyStyles}
      role="row"
      $showBorderedCells={showBorderedCells}
      $gridTemplateColumns={undefined}
      $hasHoverActions={false}
      $selectionType={selectionType}
      $columnCount={0}
      {...metaAttribute({ name: MetaConstants.TableHeaderRow })}
    >
      {selectionType === 'multiple' && (
        // Purely a grid-alignment spacer (no filter for the checkbox column) - excluded from the
        // accessibility tree rather than announced as an empty column header.
        <StyledFilterHeaderCell
          role="presentation"
          style={filterCellStyle}
          $backgroundColor={backgroundColor}
          $stickyTopOffsetPx={cellStickyTopOffsetPx}
        />
      )}
      {cellsMeta.map(({ headerKey, label }, index) => {
        const isFilterable = headerKey && filterableColumns.includes(headerKey);
        const labelText = typeof label === 'string' ? label : headerKey ?? `Column ${index + 1}`;
        return (
          <StyledFilterHeaderCell
            key={headerKey ?? index}
            // Non-filterable columns render an empty spacer cell to keep grid alignment - give it
            // `role="presentation"` so it isn't announced as an empty column header.
            role={isFilterable ? undefined : 'presentation'}
            style={filterCellStyle}
            $backgroundColor={backgroundColor}
            $stickyTopOffsetPx={cellStickyTopOffsetPx}
          >
            {isFilterable && headerKey && filterConfig[headerKey] ? (
              <TableHeaderFilterDropdownCell
                headerKey={headerKey}
                config={filterConfig[headerKey]}
                value={columnFilterValues[headerKey]}
                labelText={labelText}
                onChange={(value) => setColumnFilterValue(headerKey, value)}
              />
            ) : isFilterable && headerKey ? (
              // Flush/borderless input filling the cell edge-to-edge (`isTableInputCell`), same
              // treatment as TableEditableCell's body-row inputs - the cell's own `:focus-within`
              // (see StyledFilterHeaderCell) shows the ring instead of the input itself.
              <BaseBox flex={1} marginX="spacing.2">
                <BaseInput
                  isTableInputCell
                  id={`table-header-filter-${headerKey}`}
                  size="small"
                  value={
                    typeof columnFilterValues[headerKey] === 'string'
                      ? columnFilterValues[headerKey]
                      : ''
                  }
                  onChange={({ value }) => setColumnFilterValue(headerKey, value ?? '')}
                  placeholder={`Filter ${labelText}`}
                  accessibilityLabel={`Filter by ${labelText}`}
                  leadingIcon={SearchIcon}
                  trailingInteractionElement={
                    columnFilterValues[headerKey] ? (
                      <IconButton
                        size="medium"
                        icon={CloseIcon}
                        accessibilityLabel={`Clear ${labelText} filter`}
                        onClick={() => setColumnFilterValue(headerKey, '')}
                      />
                    ) : undefined
                  }
                />
              </BaseBox>
            ) : null}
          </StyledFilterHeaderCell>
        );
      })}
      {hasHoverActions && (
        <StyledFilterHeaderCell
          role="presentation"
          style={filterCellStyle}
          $backgroundColor={backgroundColor}
          $stickyTopOffsetPx={cellStickyTopOffsetPx}
        />
      )}
    </StyledHeaderRow>
  );
};

// Header rows are always rendered at the compact density (36px), regardless of `rowDensity` - see
// the `rowDensity` deprecation note on `TableHeaderRowProps`. Grouped multi-row headers use this
// fixed height to stack each row's sticky `top` below the one(s) above it.
const HEADER_ROW_HEIGHT_PX = Number(tableRow.minHeight.compact);

/**
 * Sticky `top` for the auto-injected filter row: the combined height of the label row(s) above
 * it. Each label row sits at `rowIndex * HEADER_ROW_HEIGHT_PX` (see `_TableHeader`), and the last
 * one also renders its own bottom border below that fixed height - so the filter row starts right
 * after it rather than covering it.
 */
const getFilterRowStickyTopOffsetPx = ({
  labelRowCount,
  borderWidthPx,
}: {
  labelRowCount: number;
  borderWidthPx: number;
}): number => Math.max(labelRowCount, 1) * HEADER_ROW_HEIGHT_PX + borderWidthPx;

const _TableHeader = ({ children, ...rest }: TableHeaderRowProps): React.ReactElement => {
  const { tableToolbarPlacement } = useTableRowContext();
  const { filterableColumns } = useTableDataContext();
  const { theme } = useTheme();

  // `TableHeader` may contain more than one `TableHeaderRow` (grouped multi-row headers - earlier
  // rows are group-label rows spanning leaf columns via `gridColumnStart`/`gridColumnEnd`, see
  // `TableCellGridSpanningProps`). By convention the LAST row is always the leaf/column row -
  // decorate each row with that fact and its stacked sticky offset so `TableHeaderRow` doesn't
  // need consumers to declare either explicitly.
  const childrenArray = React.Children.toArray(children);
  const headerRowIndices = childrenArray.reduce<number[]>((indices, child, index) => {
    if (getComponentId(child) === ComponentIds.TableHeaderRow) indices.push(index);
    return indices;
  }, []);
  const isMultiRowHeader = headerRowIndices.length > 1;
  const decoratedChildren = isMultiRowHeader
    ? childrenArray.map((child, index) => {
        const rowPosition = headerRowIndices.indexOf(index);
        if (rowPosition === -1 || !React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          _isLeafHeaderRow: rowPosition === headerRowIndices.length - 1,
          _stickyTopOffsetPx: rowPosition * HEADER_ROW_HEIGHT_PX,
        } as Partial<TableHeaderRowProps>);
      })
    : children;

  return (
    <ScopedTableHeader
      $tableToolbarPlacement={tableToolbarPlacement}
      {...metaAttribute({ name: MetaConstants.TableHeader })}
      {...makeAnalyticsAttribute(rest)}
    >
      {decoratedChildren}
      {filterableColumns.length > 0 && (
        <TableHeaderFilterRow
          headerRow={children}
          stickyTopOffsetPx={getFilterRowStickyTopOffsetPx({
            labelRowCount: headerRowIndices.length,
            borderWidthPx: getIn(theme.border.width, tableHeader.borderBottomAndTopWidth),
          })}
        />
      )}
    </ScopedTableHeader>
  );
};

const TableHeader = assignWithoutSideEffects(_TableHeader, {
  displayName: 'TableHeader',
  componentId: ComponentIds.TableHeader,
});

const _TableHeaderCell = ({
  children,
  headerKey,
  _hasPadding = true,
  _stickyTopOffsetPx,
  textAlign,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  ...rest
}: TableHeaderCellProps): React.ReactElement => {
  const { toggleSort, currentSortedState } = useTableDataContext();
  const { backgroundColor, rowDensity, headerRowDensity, shouldHeaderBeSticky } =
    useTableRowContext();
  const stickyTopOffsetPx = shouldHeaderBeSticky
    ? _stickyTopOffsetPx !== undefined
      ? _stickyTopOffsetPx
      : 0
    : undefined;
  const isChildrenString = typeof children === 'string';
  const isSortable =
    headerKey && Boolean(currentSortedState.sortableColumns?.find((key) => key === headerKey));

  const hasRowSpan = Boolean(gridRowStart && gridRowEnd);
  const gridRowValue = hasRowSpan ? `${gridRowStart} / ${gridRowEnd}` : undefined;

  const sortOrderIndex = currentSortedState.sortOrder.findIndex(
    (entry) => entry.sortKey === headerKey,
  );
  const sortDirection: 'asc' | 'desc' | 'none' =
    sortOrderIndex === -1 ? 'none' : currentSortedState.sortOrder[sortOrderIndex].direction;
  // Only show the priority badge once there's an actual multi-column sort to disambiguate -
  // a single sorted column keeps its existing, unbadged look.
  const sortPriority =
    currentSortedState.sortOrder.length > 1 && sortOrderIndex !== -1
      ? sortOrderIndex + 1
      : undefined;

  return (
    <StyledHeaderCell
      tabIndex={0}
      className={hasRowSpan ? classes.HAS_ROW_SPANNING : ''}
      gridColumnStart={gridColumnStart}
      gridColumnEnd={gridColumnEnd}
      $gridRow={gridRowValue}
      $isSortable={Boolean(isSortable)}
      $backgroundColor={backgroundColor}
      $rowDensity={headerRowDensity ?? rowDensity}
      $hasPadding={_hasPadding}
      $textAlign={textAlign}
      style={stickyHeaderCellStyle(shouldHeaderBeSticky, stickyTopOffsetPx)}
      $stickyTopOffsetPx={stickyTopOffsetPx}
      onClick={(event: React.MouseEvent) => {
        if (isSortable) {
          toggleSort(headerKey, event.shiftKey);
        }
      }}
      {...metaAttribute({ name: MetaConstants.TableHeaderCell })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox display="flex" flexGrow={1} justifyContent={textAlign}>
        {isChildrenString ? (
          <Text size="small" weight="medium" color="surface.text.gray.muted">
            {children}
          </Text>
        ) : (
          children
        )}
      </BaseBox>
      {isSortable && (
        <BaseBox paddingLeft="spacing.2" backgroundColor="transparent" flexShrink={0}>
          <SortIcon sortDirection={sortDirection} priority={sortPriority} />
        </BaseBox>
      )}
    </StyledHeaderCell>
  );
};

// Memoized so a re-render of this cell's parent (e.g. a sibling cell's own state change) that
// doesn't actually change this cell's own props is skipped. Note this does NOT skip re-renders
// triggered by a TableRowContext/TableDataContext change (e.g. sort state) - those are expected,
// since this cell reads its own sort indicator from that context.
const TableHeaderCell = assignWithoutSideEffects(React.memo(_TableHeaderCell), {
  displayName: 'TableHeaderCell',
  componentId: ComponentIds.TableHeaderCell,
});

const TableHeaderCellCheckbox = ({
  isChecked,
  isDisabled,
  isIndeterminate,
  onChange,
}: {
  isChecked: CheckboxProps['isChecked'];
  isDisabled: CheckboxProps['isDisabled'];
  isIndeterminate?: CheckboxProps['isIndeterminate'];
  onChange: CheckboxProps['onChange'];
}): React.ReactElement => {
  return (
    <TableHeaderCell headerKey="SELECT">
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex={1}
        width={makeSize(checkboxCellWidth)}
      >
        <Checkbox
          isChecked={isChecked}
          isDisabled={isDisabled}
          isIndeterminate={isIndeterminate}
          onChange={onChange}
          accessibilityLabel="Select all rows"
        />
      </BaseBox>
    </TableHeaderCell>
  );
};

const _TableHeaderRow = ({
  children,
  rowDensity,
  _isLeafHeaderRow = true,
  _stickyTopOffsetPx,
  ...rest
}: TableHeaderRowProps): React.ReactElement => {
  const {
    disabledRows,
    selectionType,
    selectedRows,
    toggleAllRowsSelection,
    setHeaderRowDensity,
    showBorderedCells,
    hasHoverActions,
    gridTemplateColumns,
    columnCount,
    isVirtualized,
    shouldHeaderBeSticky,
  } = useTableRowContext();
  const { totalItems, tableData } = useTableDataContext();
  const isMultiSelect = selectionType === 'multiple';
  // Containment against the currently-visible rows (`tableData`), not a `selectedRows.length ===
  // totalItems` count comparison - `totalItems` tracks whatever `data` currently holds, which for
  // server-side pagination is only the current page, not every row that's ever been selected
  // across other pages. A count comparison against that would show this page as "indeterminate"
  // (or worse, get cleared entirely by `toggleAllRowsSelection`) purely because *other* pages have
  // selections, even when none of *this* page's rows are selected. See the Selection Across Pages
  // example.
  const visibleRowIds = React.useMemo(() => tableData.map((item) => item.id), [tableData]);
  const selectedRowIds = selectedRows ?? [];
  const isAllSelected =
    visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedRowIds.includes(id));
  const isIndeterminate = !isAllSelected && visibleRowIds.some((id) => selectedRowIds.includes(id));
  const isDisabled = disabledRows && disabledRows.length === totalItems;

  // Note: The rowDensity prop is deprecated (see types.ts for @deprecated documentation).
  // Header row is always compact (36px height) regardless of the rowDensity value passed.
  // This prop will be removed in a future major version.
  setHeaderRowDensity('compact');

  // `top: Npx` only makes sense to apply once this row's cells are actually `position: sticky`
  // (see `StyledHeaderCell`'s theme-driven `position`) - on a non-sticky `position: relative` cell
  // it would instead permanently shift the row down by that many pixels.
  const cellStickyTopOffsetPx = shouldHeaderBeSticky
    ? _stickyTopOffsetPx !== undefined
      ? _stickyTopOffsetPx
      : 0
    : undefined;

  // Grouped multi-row headers (see `TableHeader`'s row decoration) only ever need the
  // checkbox/hover-actions placeholder cells once, on the leaf row - otherwise every group-label
  // row above it would also render its own "select all" checkbox / Actions placeholder.
  const decoratedChildren = cellStickyTopOffsetPx
    ? React.Children.map(children, (child) =>
        getComponentId(child) === ComponentIds.TableHeaderCell && React.isValidElement(child)
          ? React.cloneElement(child, {
              _stickyTopOffsetPx: cellStickyTopOffsetPx,
            } as Partial<TableHeaderCellProps>)
          : child,
      )
    : children;

  const syncHeaderRowStickyStyles = React.useCallback(
    (row: HTMLTableRowElement | null) => {
      applyStickyHeaderRowCellStyles(row, shouldHeaderBeSticky, cellStickyTopOffsetPx);
    },
    [cellStickyTopOffsetPx, shouldHeaderBeSticky],
  );

  return (
    // `@table-library`'s own `HeaderRow` defaults its `role` prop to `"rowheader"` internally -
    // a WAI-ARIA *cell* role, not valid for an entire row - so it must be explicitly overridden
    // to `"row"` here rather than merely omitted (omitting it lets the library's own bad default
    // through unchanged).
    <StyledHeaderRow
      ref={syncHeaderRowStickyStyles}
      role="row"
      {...metaAttribute({ name: MetaConstants.TableHeaderRow })}
      {...makeAnalyticsAttribute(rest)}
      $showBorderedCells={showBorderedCells}
      $gridTemplateColumns={gridTemplateColumns}
      $hasHoverActions={hasHoverActions}
      $selectionType={selectionType}
      $columnCount={columnCount}
      $isVirtualized={isVirtualized}
    >
      {isMultiSelect &&
        (_isLeafHeaderRow ? (
          <TableHeaderCellCheckbox
            isChecked={isAllSelected}
            isDisabled={isDisabled}
            isIndeterminate={isIndeterminate}
            onChange={() => toggleAllRowsSelection()}
          />
        ) : (
          // Group-label rows (grouped multi-row headers) don't repeat the "select all" checkbox -
          // an empty spacer cell keeps this row's columns aligned with the leaf row below it,
          // which does reserve a real column for it.
          <TableHeaderCell _hasPadding={false}>{null}</TableHeaderCell>
        ))}
      {decoratedChildren}
      {hasHoverActions ? (
        _isLeafHeaderRow ? (
          <TableHeaderCell _hasPadding={false}>Actions</TableHeaderCell>
        ) : (
          // Same alignment spacer as the checkbox column above, for the trailing hover-actions
          // column on group-label rows.
          <TableHeaderCell _hasPadding={false}>{null}</TableHeaderCell>
        )
      ) : null}
    </StyledHeaderRow>
  );
};

const TableHeaderRow = assignWithoutSideEffects(_TableHeaderRow, {
  displayName: 'TableHeaderRow',
  componentId: ComponentIds.TableHeaderRow,
});

export { TableHeader, TableHeaderRow, TableHeaderCell };
