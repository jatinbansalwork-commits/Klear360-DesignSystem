import React from 'react';
import styled from 'styled-components';
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';
import { checkboxCellWidth, tableHeader, tableRow, classes } from './tokens';
import { useTableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import type {
  TableHeaderRowProps,
  TableHeaderCellProps,
  TableBackgroundColors,
  TableProps,
  TableToolbarPlacement,
  TableColumnFilterConfig,
} from './types';
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
import { size } from '~tokens/global';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { BaseInput } from '~components/Input/BaseInput';
import { CloseIcon, SearchIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';

const SortButton = styled.button(({ theme }) => ({
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  margin: 0,
  borderRadius: theme.border.radius.small,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: makeSpace(theme.spacing[1]),
  transitionProperty: 'color, box-shadow',
  transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, 'duration.quick'))),
  transitionTimingFunction: (theme.motion.easing.standard as unknown) as string,
  '&:focus-visible': getFocusRingStyles({ theme }),
}));

const PriorityBadge = styled(BaseBox)(({ theme }) => ({
  minWidth: makeSize(14),
  height: makeSize(14),
  borderRadius: theme.border.radius.round,
  backgroundColor: getIn(theme.colors, 'interactive.background.gray.faded'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: makeSpace(theme.spacing[1]),
  paddingRight: makeSpace(theme.spacing[1]),
}));

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
  const defaultColor = getIn(theme.colors, 'interactive.icon.gray.disabled');
  const activeColor = getIn(theme.colors, 'interactive.icon.gray.muted');
  // Preserves the existing mapping: descending highlights the up arrow, ascending the down arrow.
  const upArrowColor = sortDirection === 'desc' ? activeColor : defaultColor;
  const downArrowColor = sortDirection === 'asc' ? activeColor : defaultColor;
  return (
    <SortButton
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
        <PriorityBadge>
          <Text size="small" color="surface.text.gray.muted">
            {priority}
          </Text>
        </PriorityBadge>
      ) : null}
    </SortButton>
  );
};

const StyledHeader = styled(Header)<{ $tableToolbarPlacement: TableToolbarPlacement }>(
  ({ $tableToolbarPlacement }) => ({
    '&&&': {
      '& tr:first-child th': {
        borderTop: 'none',
      },
      display: $tableToolbarPlacement === 'overlay' ? 'none' : undefined,
    },
  }),
);

const StyledFilterHeaderCell = styled(HeaderCell)<{
  $backgroundColor: TableBackgroundColors;
}>(({ theme, $backgroundColor }) => ({
  '&&&': {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    backgroundColor: getIn(theme.colors, $backgroundColor),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderBottomStyle: 'solid',
    // No horizontal cell padding here - the input already carries its own inset (see the
    // `marginX` on its wrapping BaseBox below), matching TableEditableCell's flush-cell
    // convention. Padding on both would stack (previously 12px cell + 12px icon-slot padding
    // = 24px before the icon, noticeably more than TableEditableCell's 16px).
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: makeSpace(getIn(theme.spacing, '2')),
    paddingBottom: makeSpace(getIn(theme.spacing, '2')),
    // The input itself renders flush/borderless (`isTableInputCell`) same as TableEditableCell,
    // so the cell - not the input - is what shows the focus ring while typing/clearing.
    '&:focus-within': getFocusRingStyles({ theme, negativeOffset: true }),
  },
}));

const StyledHeaderRow = styled(HeaderRow)<{
  $showBorderedCells: boolean;
  $gridTemplateColumns: string | undefined;
  $hasHoverActions: boolean;
  $selectionType: TableProps<unknown>['selectionType'];
  $columnCount: number;
  $isVirtualized?: boolean;
}>(
  ({
    theme,
    $showBorderedCells,
    $gridTemplateColumns,
    $hasHoverActions,
    $selectionType,
    $columnCount,
    $isVirtualized,
  }) => ({
    '& th': $showBorderedCells
      ? {
          borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderRightColor: getIn(theme.colors, tableRow.borderColor),
          borderRightStyle: 'solid',
          ...($isVirtualized && {
            display: 'grid',
            gridTemplateColumns: $gridTemplateColumns
              ? `${$gridTemplateColumns} ${$hasHoverActions ? 'min-content' : ''}`
              : ` ${
                  $selectionType === 'multiple' ? 'min-content' : ''
                } repeat(${$columnCount},minmax(100px, 1fr)) ${
                  $hasHoverActions ? 'min-content' : ''
                } !important;`,
          }),
        }
      : undefined,
    '& th:last-child ': {
      borderRight: 'none',
    },
  }),
);

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
}: {
  headerRow: React.ReactNode;
}): React.ReactElement => {
  const {
    filterableColumns,
    columnFilterValues,
    setColumnFilterValue,
    filterConfig,
    backgroundColor,
    selectionType,
    hasHoverActions,
    showBorderedCells,
  } = useTableContext();
  const cellsMeta = getHeaderCellsMeta(headerRow);

  return (
    // See the real header row's own `role="row"` override below for why this is explicit.
    <StyledHeaderRow
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
        <StyledFilterHeaderCell role="presentation" $backgroundColor={backgroundColor} />
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
            $backgroundColor={backgroundColor}
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
        <StyledFilterHeaderCell role="presentation" $backgroundColor={backgroundColor} />
      )}
    </StyledHeaderRow>
  );
};

// Header rows are always rendered at the compact density (36px), regardless of `rowDensity` - see
// the `rowDensity` deprecation note on `TableHeaderRowProps`. Grouped multi-row headers use this
// fixed height to stack each row's sticky `top` below the one(s) above it.
const HEADER_ROW_HEIGHT_PX = Number(tableRow.minHeight.compact);

const _TableHeader = ({ children, ...rest }: TableHeaderRowProps): React.ReactElement => {
  const { tableToolbarPlacement, filterableColumns } = useTableContext();

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
    <StyledHeader
      $tableToolbarPlacement={tableToolbarPlacement}
      {...metaAttribute({ name: MetaConstants.TableHeader })}
      {...makeAnalyticsAttribute(rest)}
    >
      {decoratedChildren}
      {filterableColumns.length > 0 && <TableHeaderFilterRow headerRow={children} />}
    </StyledHeader>
  );
};

const TableHeader = assignWithoutSideEffects(_TableHeader, {
  displayName: 'TableHeader',
  componentId: ComponentIds.TableHeader,
});

const StyledHeaderCell = styled(HeaderCell)<{
  $isSortable: boolean;
  $backgroundColor: TableBackgroundColors;
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  $hasPadding: boolean;
  $textAlign: 'left' | 'center' | 'right';
  $gridRow?: string;
  $stickyTopOffsetPx?: number;
}>(
  ({
    theme,
    $isSortable,
    $backgroundColor,
    $rowDensity,
    $hasPadding,
    $textAlign,
    $gridRow,
    $stickyTopOffsetPx,
  }) => ({
    '&&&': {
      display: $textAlign ? 'flex' : 'block',
      justifyContent: $textAlign ? 'space-between' : 'initial',
      height: '100%',
      backgroundColor: getIn(theme.colors, $backgroundColor),
      borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
      borderTopWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
      borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
      borderTopColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
      borderBottomStyle: 'solid',
      borderTopStyle: 'solid',
      cursor: $isSortable ? 'pointer' : 'auto',
      gridRow: $gridRow,
      // Grouped multi-row headers only - stacks this row's sticky position below the row(s) above
      // it (each fixed at the compact 36px header row height) instead of every row independently
      // sticking to `top: 0` and overlapping each other.
      ...($stickyTopOffsetPx ? { top: `${$stickyTopOffsetPx}px` } : {}),
      '> div': {
        backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: $textAlign ? $textAlign : 'space-between',
        alignItems: 'center',
        height: '100%',
        paddingLeft: $hasPadding
          ? makeSpace(getIn(theme, tableRow.paddingLeft[$rowDensity]))
          : undefined,
        paddingRight: $hasPadding
          ? makeSpace(getIn(theme, tableRow.paddingRight[$rowDensity]))
          : undefined,
        minHeight: makeSize(getIn(size, tableRow.minHeight[$rowDensity])),
      },
      '&:focus-visible': getFocusRingStyles({ theme, negativeOffset: true }),
    },
  }),
);

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
  const {
    toggleSort,
    currentSortedState,
    backgroundColor,
    rowDensity,
    headerRowDensity,
  } = useTableContext();
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
      $isSortable={isSortable}
      $backgroundColor={backgroundColor}
      $rowDensity={headerRowDensity ?? rowDensity}
      $hasPadding={_hasPadding}
      $textAlign={textAlign}
      $stickyTopOffsetPx={_stickyTopOffsetPx}
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

const TableHeaderCell = assignWithoutSideEffects(_TableHeaderCell, {
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
    totalItems,
    toggleAllRowsSelection,
    setHeaderRowDensity,
    showBorderedCells,
    hasHoverActions,
    gridTemplateColumns,
    columnCount,
    isVirtualized,
    shouldHeaderBeSticky,
  } = useTableContext();
  const isMultiSelect = selectionType === 'multiple';
  const isAllSelected = selectedRows && selectedRows.length === totalItems;
  const isIndeterminate = selectedRows && selectedRows.length > 0 && !isAllSelected;
  const isDisabled = disabledRows && disabledRows.length === totalItems;

  // Note: The rowDensity prop is deprecated (see types.ts for @deprecated documentation).
  // Header row is always compact (36px height) regardless of the rowDensity value passed.
  // This prop will be removed in a future major version.
  setHeaderRowDensity('compact');

  // `top: Npx` only makes sense to apply once this row's cells are actually `position: sticky`
  // (see `StyledHeaderCell`'s theme-driven `position`) - on a non-sticky `position: relative` cell
  // it would instead permanently shift the row down by that many pixels.
  const cellStickyTopOffsetPx =
    shouldHeaderBeSticky && _stickyTopOffsetPx ? _stickyTopOffsetPx : undefined;

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

  return (
    // `@table-library`'s own `HeaderRow` defaults its `role` prop to `"rowheader"` internally -
    // a WAI-ARIA *cell* role, not valid for an entire row - so it must be explicitly overridden
    // to `"row"` here rather than merely omitted (omitting it lets the library's own bad default
    // through unchanged).
    <StyledHeaderRow
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
