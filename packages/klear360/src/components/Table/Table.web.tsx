import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import { useSort, SortToggleType } from '@table-library/react-table-library/sort';
import { usePagination } from '@table-library/react-table-library/pagination';
import {
  SelectClickTypes,
  SelectTypes,
  useRowSelect,
} from '@table-library/react-table-library/select';
import { useTree, TreeExpandClickTypes } from '@table-library/react-table-library/tree';
import styled from 'styled-components';
import usePresence from 'use-presence';
import type { TableContextType } from './TableContext';
import { TableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import {
  checkboxCellWidth,
  firstColumnStickyZIndex,
  refreshWrapperZIndex,
  tableBackgroundColor,
  tablePagination,
  tableRow,
  classes,
} from './tokens';
import type {
  TableProps,
  TableNode,
  TableData,
  Identifier,
  TablePaginationType,
  TableHeaderRowProps,
  TableSortOrderEntry,
} from './types';
import { getTableBodyStyles } from './commonStyles';
import { TableSurface } from './TableSurface.web';
import { TableHeader, TableHeaderRow, TableHeaderCell } from './TableHeader';
import { TableBody, TableRow, TableCell } from './TableBody';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwKlear360Error } from '~utils/logger';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import { Skeleton } from '~components/Skeleton';
import { getStyledProps } from '~components/Box/styledProps';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/Klear360Provider';
import getIn from '~utils/lodashButBetter/get';
import { useIsMobile } from '~utils/useIsMobile';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useListViewContext } from '~components/ListView/ListViewContext';

const rowSelectType: Record<
  NonNullable<TableProps<unknown>['selectionType']>,
  SelectTypes | undefined
> = {
  single: SelectTypes.SingleSelect,
  multiple: SelectTypes.MultiSelect,
  none: undefined,
};

// Get the number of TableHeaderCell components.
// This is very complicated but the only way to iterate through the structure and get number of header cells.
// Assuming number of header cells is the same as number of columns
//
// `TableHeader` may contain more than one `TableHeaderRow` (grouped multi-row headers - earlier
// rows are group-label rows spanning leaf columns via `gridColumnStart`/`gridColumnEnd`). By
// convention the LAST `TableHeaderRow` is always the leaf/column row that lines up 1:1 with body
// columns, so that's the one counted here - not the first, which would undercount/miscount when a
// group row precedes it.
const getTableHeaderCellCount = (children: (data: []) => React.ReactElement): number => {
  const tableRootComponent = children([]);
  if (tableRootComponent && React.isValidElement(tableRootComponent)) {
    const tableComponentArray = React.Children.toArray(tableRootComponent);
    if (React.isValidElement(tableComponentArray[0])) {
      const tableComponentArrayChildren = React.Children.toArray(
        tableComponentArray[0].props.children,
      );
      const tableHeader = tableComponentArrayChildren.find(
        (child) => getComponentId(child) === ComponentIds.TableHeader,
      );
      const tableHeaderChildrenArray = React.isValidElement(tableHeader)
        ? React.Children.toArray(tableHeader.props.children)
        : null;
      const tableHeaderRows = tableHeaderChildrenArray?.filter(
        (child) => getComponentId(child) === ComponentIds.TableHeaderRow,
      );
      const leafTableHeaderRow = tableHeaderRows?.[tableHeaderRows.length - 1];
      const tableHeaderRowChildrenArray = React.isValidElement(leafTableHeaderRow)
        ? React.Children.toArray(leafTableHeaderRow.props.children)
        : null;
      const tableHeaderCells = tableHeaderRowChildrenArray
        ? tableHeaderRowChildrenArray.filter(
            (child) => getComponentId(child) === ComponentIds.TableHeaderCell,
          )
        : null;
      return tableHeaderCells?.length ?? 0;
    }
  }
  return 0;
};

const StyledReactTable = styled(ReactTable)<{
  $styledProps?: {
    height?: BoxProps['height'];
    width?: BoxProps['width'];
    isVirtualized?: boolean;
    isSelectable?: boolean;
    showStripedRows?: boolean;
  };
}>(({ $styledProps }) => {
  const { theme } = useTheme();
  const styledPropsCSSObject = getBaseBoxStyles({
    theme,
    height: $styledProps?.height,
    ...($styledProps?.isVirtualized && {
      width: '100%',
    }),
  });
  const $isSelectable = $styledProps?.isSelectable;
  const $showStripedRows = $styledProps?.showStripedRows;
  return {
    '&&&': {
      ...styledPropsCSSObject,
      overflow: `${$styledProps?.isVirtualized ? 'unset' : 'auto'} !important`,
    },
    ...($styledProps?.isVirtualized
      ? getTableBodyStyles({
          isVirtualized: $styledProps?.isVirtualized,
          theme,
          height: $styledProps?.height,
          width: '100%',
          isSelectable: $isSelectable,
          showStripedRows: $showStripedRows,
        })
      : null),
  };
});

const RefreshWrapper = styled(BaseBox)<{
  isRefreshSpinnerVisible: boolean;
  isRefreshSpinnerEntering: boolean;
  isRefreshSpinnerExiting: boolean;
}>(({ isRefreshSpinnerVisible, isRefreshSpinnerEntering, isRefreshSpinnerExiting, theme }) => {
  return {
    opacity: isRefreshSpinnerVisible ? 1 : 0,
    transition: `opacity ${makeMotionTime(theme.motion.duration.quick)} ${
      isRefreshSpinnerEntering
        ? theme.motion.easing.entrance
        : isRefreshSpinnerExiting
        ? theme.motion.easing.exit
        : ''
    }`,
  };
});

const SKELETON_ROW_COUNT = 7;
const SKELETON_CELL_WIDTHS = {
  first: '70%',
  last: '50%',
  middle: '75%',
  headerFirst: '80%',
  headerRest: '60%',
} as const;

const StyledSkeletonRow = styled(BaseBox)<{ $columns: number; $isHeader?: boolean }>(
  ({ theme, $columns, $isHeader }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${$columns}, minmax(100px, 1fr))`,
    paddingLeft: makeSpace(theme.spacing[4]),
    paddingRight: makeSpace(theme.spacing[4]),
    paddingTop: makeSpace(theme.spacing[$isHeader ? 3 : 4]),
    paddingBottom: makeSpace(theme.spacing[$isHeader ? 3 : 4]),
    borderBottomWidth: makeSpace(theme.border.width.thin),
    borderBottomColor: theme.colors.surface.border.gray.muted,
    borderBottomStyle: 'solid',
    gap: makeSpace(theme.spacing[4]),
    alignItems: 'center',
  }),
);

const _Table = <Item,>({
  children,
  columns,
  data,
  multiSelectTrigger = 'row',
  selectionType = 'none',
  onSelectionChange,
  isHeaderSticky,
  isFooterSticky,
  isFirstColumnSticky,
  stickyColumnCount: stickyColumnCountProp,
  stickyColumnWidths,
  isLastColumnSticky,
  trailingStickyColumnCount: trailingStickyColumnCountProp,
  trailingStickyColumnWidths,
  rowDensity = 'normal',
  onSortChange,
  sortFunctions,
  initialSort,
  toolbar,
  pagination,
  height,
  showStripedRows,
  gridTemplateColumns: gridTemplateColumnsProp,
  isLoading = false,
  isRefreshing = false,
  showBorderedCells = true,
  defaultSelectedIds = [],
  backgroundColor = tableBackgroundColor,
  isGrouped = false,
  expandedRowIds: expandedRowIdsProp,
  defaultExpandedRowIds,
  onExpandedRowIdsChange,
  checkboxDisplay = 'always',
  filterFunctions,
  columnFilterValues: columnFilterValuesProp,
  defaultColumnFilterValues = {},
  onColumnFilterValuesChange,
  globalFilterValue: globalFilterValueProp,
  defaultGlobalFilterValue = '',
  onGlobalFilterValueChange,
  ...rest
}: TableProps<Item>): React.ReactElement => {
  const { theme, colorScheme } = useTheme();
  const { isInsideListView } = useListViewContext();

  // When `columns` is used instead of `children`, build the equivalent TableHeader/TableBody
  // tree from the column config, using the real Table sub-components so everything else
  // (componentId-based header-cell counting, sorting hookup, etc.) works exactly as if the
  // consumer had hand-written this JSX themselves.
  const resolvedChildren = useMemo((): ((tableData: TableNode<Item>[]) => React.ReactElement) => {
    if (children) {
      return children;
    }
    return (tableData: TableNode<Item>[]): React.ReactElement => (
      <>
        <TableHeader>
          <TableHeaderRow>
            {columns.map((column) => (
              <TableHeaderCell
                key={column.key}
                headerKey={column.sortable ? column.key : undefined}
              >
                {column.header}
              </TableHeaderCell>
            ))}
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={item.id} item={item}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(item, index)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </>
    );
  }, [children, columns]);

  // An explicit gridTemplateColumns prop always wins, matching how that prop already behaves
  // for hand-written columns; otherwise derive one from each column's `width` when using `columns`.
  const gridTemplateColumns =
    gridTemplateColumnsProp ??
    columns?.map((column) => column.width ?? 'minmax(100px, 1fr)').join(' ');

  // Filter Logic
  //
  // Applied to `data.nodes` before everything else (selection, sort, pagination all derive
  // from `filteredData` below), so the pipeline is
  // data -> filteredData -> sortedData -> rendered/paginated. A column becomes filterable purely
  // by having its headerKey present in `filterFunctions` (same convention as `sortFunctions`),
  // and the global filter reuses those same per-column predicates with OR instead of AND.
  const [internalGlobalFilterValue, setInternalGlobalFilterValue] = React.useState(
    defaultGlobalFilterValue,
  );
  const globalFilterValue = globalFilterValueProp ?? internalGlobalFilterValue;

  const setGlobalFilterValue = useCallback(
    (value: string): void => {
      if (globalFilterValueProp === undefined) {
        setInternalGlobalFilterValue(value);
      }
      onGlobalFilterValueChange?.(value);
    },
    [globalFilterValueProp, onGlobalFilterValueChange],
  );

  const [internalColumnFilterValues, setInternalColumnFilterValues] = React.useState<
    Record<string, string>
  >(defaultColumnFilterValues);
  const columnFilterValues = columnFilterValuesProp ?? internalColumnFilterValues;

  const setColumnFilterValue = useCallback(
    (key: string, value: string): void => {
      const nextValues = { ...columnFilterValues, [key]: value };
      if (columnFilterValuesProp === undefined) {
        setInternalColumnFilterValues(nextValues);
      }
      onColumnFilterValuesChange?.(nextValues);
    },
    [columnFilterValues, columnFilterValuesProp, onColumnFilterValuesChange],
  );

  const filterableColumns = useMemo(() => Object.keys(filterFunctions ?? {}), [filterFunctions]);

  const activeColumnFilters = useMemo(
    () => Object.entries(columnFilterValues).filter(([, value]) => Boolean(value)),
    [columnFilterValues],
  );

  const applyFilters = useCallback(
    (nodesToFilter: TableNode<Item>[]): TableNode<Item>[] => {
      if (!filterFunctions || (activeColumnFilters.length === 0 && !globalFilterValue)) {
        return nodesToFilter;
      }
      return nodesToFilter
        .filter((node) => {
          const passesColumnFilters = activeColumnFilters.every(([key, value]) => {
            const filterFn = filterFunctions[key];
            return filterFn ? filterFn(node, value) : true;
          });
          if (!passesColumnFilters) return false;
          if (!globalFilterValue) return true;
          return Object.values(filterFunctions).some((filterFn) =>
            filterFn(node, globalFilterValue),
          );
        })
        .map((node) => {
          // Recurse into grouped/tree children (if any) so nested rows filter the same way.
          const nodeWithChildren = node as TableNode<Item> & { nodes?: TableNode<Item>[] };
          return Array.isArray(nodeWithChildren.nodes)
            ? { ...node, nodes: applyFilters(nodeWithChildren.nodes) }
            : node;
        });
    },
    [filterFunctions, activeColumnFilters, globalFilterValue],
  );

  const filteredData: TableData<Item> = useMemo(
    () =>
      activeColumnFilters.length > 0 || globalFilterValue
        ? { nodes: applyFilters(data.nodes) }
        : data,
    [data, applyFilters, activeColumnFilters, globalFilterValue],
  );

  const tableElementRef = useRef<HTMLTableElement | null>(null);

  const [selectedRows, setSelectedRows] = React.useState<TableNode<unknown>['id'][]>(
    selectionType !== 'none' ? defaultSelectedIds : [],
  );
  const [disabledRows, setDisabledRows] = React.useState<TableNode<unknown>['id'][]>([]);
  const [totalItems, setTotalItems] = React.useState(data.nodes.length || 0);
  const [paginationType, setPaginationType] = React.useState<NonNullable<TablePaginationType>>(
    'client',
  );
  const [headerRowDensity, setHeaderRowDensity] = React.useState<TableHeaderRowProps['rowDensity']>(
    undefined,
  );
  const [hasHoverActions, setHasHoverActions] = React.useState(false);
  const tableRootComponent = resolvedChildren([]);
  const isVirtualized = getComponentId(tableRootComponent) === ComponentIds.VirtualizedTable;

  const isMobile = useIsMobile();
  const lastHoverActionsColWidth = isMobile ? '1fr' : '0px';

  // `isFirstColumnSticky` is shorthand for freezing a single leading column; `stickyColumnCount`
  // generalizes this to N leading columns (see `stickyColumnWidths` for why widths are required
  // beyond the first).
  const requestedStickyColumnCount = stickyColumnCountProp ?? (isFirstColumnSticky ? 1 : 0);
  const requestedTrailingStickyColumnCount =
    trailingStickyColumnCountProp ?? (isLastColumnSticky ? 1 : 0);

  if (__DEV__) {
    if (
      requestedStickyColumnCount > 1 &&
      (!stickyColumnWidths || stickyColumnWidths.length < requestedStickyColumnCount)
    ) {
      throwKlear360Error({
        message:
          '`stickyColumnWidths` must provide a pixel width for each of the `stickyColumnCount` columns when freezing more than one column.',
        moduleName: 'Table',
      });
    }
    if (
      requestedTrailingStickyColumnCount > 1 &&
      (!trailingStickyColumnWidths ||
        trailingStickyColumnWidths.length < requestedTrailingStickyColumnCount)
    ) {
      throwKlear360Error({
        message:
          '`trailingStickyColumnWidths` must provide a pixel width for each of the `trailingStickyColumnCount` columns when freezing more than one column.',
        moduleName: 'Table',
      });
    }
  }

  // Sticky columns are disabled on mobile: their combined width easily exceeds a phone's
  // viewport (unlike desktop, where there's always a wide scrolling area left over), which would
  // leave no visible area to scroll the rest of the table into view at all. Falling back to a
  // plain horizontally-scrollable table keeps every column reachable.
  const stickyColumnCount = isMobile ? 0 : requestedStickyColumnCount;
  const trailingStickyColumnCount = isMobile ? 0 : requestedTrailingStickyColumnCount;

  // Need to make header is sticky if first/last column is sticky otherwise that header cell will not be sticky
  const shouldHeaderBeSticky =
    isVirtualized || isHeaderSticky || stickyColumnCount > 0 || trailingStickyColumnCount > 0;

  const {
    isEntering: isRefreshSpinnerEntering,
    isMounted: isRefreshSpinnerMounted,
    isExiting: isRefreshSpinnerExiting,
    isVisible: isRefreshSpinnerVisible,
  } = usePresence(isRefreshing, {
    transitionDuration: theme.motion.duration.quick,
  });

  // Table Theme
  const columnCount = getTableHeaderCellCount(resolvedChildren);

  // Shared by header/body/footer cells - freezes the leading `stickyColumnCount` columns (plus
  // the multi-select checkbox column, when present) at their cumulative left offset, computed
  // from `stickyColumnWidths` rather than measured at render time.
  const stickyColumnsCSS = useMemo(() => {
    if (stickyColumnCount < 1 && trailingStickyColumnCount < 1) return '';

    const isMultiSelect = selectionType === 'multiple';
    // The last frozen column's own `border-right` (on `.cell-wrapper`, see TableBody/TableHeader)
    // is unreliable once scrolled - it sits behind the scrolling column that slides underneath in
    // the same stacking context, so it can get visually clipped at the sticky boundary. A
    // `box-shadow` is painted as part of the sticky cell itself instead of relying on layout to
    // keep a border pixel uncovered, so it stays visible at any scroll position.
    const lastStickyBoxShadow = showBorderedCells
      ? `box-shadow: 1px 0 0 0 ${getIn(theme.colors, tableRow.borderColor)} !important;`
      : '';
    const stickyRule = (domIndex: number, left: number, isLastSticky: boolean): string => `
  &:nth-of-type(${domIndex}) {
    left: ${left}px !important;
    position: sticky !important;
    z-index: ${firstColumnStickyZIndex} !important;
    ${isLastSticky ? lastStickyBoxShadow : ''}
  }
  /* Higher z-index for sticky column cells that also span rows to prevent stacking issues */
  &:nth-of-type(${domIndex}).${classes.HAS_ROW_SPANNING} {
    z-index: 3 !important;
  }`;

    const rules: string[] = [];
    let cumulativeLeft = 0;
    if (isMultiSelect && stickyColumnCount > 0) {
      // The checkbox column is always followed by at least one more sticky column here (guarded
      // by `stickyColumnCount > 0` above), so it's never the last sticky one.
      rules.push(stickyRule(1, 0, false));
      cumulativeLeft = checkboxCellWidth;
    }
    for (let i = 0; i < stickyColumnCount; i += 1) {
      const domIndex = i + 1 + (isMultiSelect ? 1 : 0);
      rules.push(stickyRule(domIndex, cumulativeLeft, i === stickyColumnCount - 1));
      cumulativeLeft += Number.parseFloat(stickyColumnWidths?.[i] ?? '0');
    }

    if (trailingStickyColumnCount > 0) {
      // The trailing column that borders the scrolling region is the *first* trailing-sticky
      // column (closest to the middle of the table), unlike the leading case where it's the
      // last - hence the box-shadow goes on `i === 0` here.
      const trailingStickyRule = (
        domIndexFromEnd: number,
        right: number,
        isFirstTrailingSticky: boolean,
      ): string => `
  &:nth-last-of-type(${domIndexFromEnd}) {
    right: ${right}px !important;
    position: sticky !important;
    z-index: ${firstColumnStickyZIndex} !important;
    ${isFirstTrailingSticky ? lastStickyBoxShadow : ''}
  }
  /* Higher z-index for sticky column cells that also span rows to prevent stacking issues */
  &:nth-last-of-type(${domIndexFromEnd}).${classes.HAS_ROW_SPANNING} {
    z-index: 3 !important;
  }`;

      // The hover-actions column (when present) is always the very last DOM column and is
      // already its own `position: sticky; right: 0` (see TableBody's `hasHoverActions` styles) -
      // skip over it so trailing sticky columns sit correctly to its left instead of fighting it
      // for the same spot.
      const trailingDomOffset = hasHoverActions ? 1 : 0;
      let cumulativeRight = 0;
      for (let i = 0; i < trailingStickyColumnCount; i += 1) {
        const domIndexFromEnd = i + 1 + trailingDomOffset;
        rules.push(trailingStickyRule(domIndexFromEnd, cumulativeRight, i === 0));
        cumulativeRight += Number.parseFloat(trailingStickyColumnWidths?.[i] ?? '0');
      }
    }

    return rules.join('\n');
  }, [
    stickyColumnCount,
    trailingStickyColumnCount,
    selectionType,
    stickyColumnWidths,
    trailingStickyColumnWidths,
    hasHoverActions,
    showBorderedCells,
    theme,
  ]);

  const tableTheme = useTableTheme({
    Table: `
    height:${isFooterSticky ? `100%` : undefined};
    ${
      toolbar && !isInsideListView
        ? `border-top: ${makeBorderSize(theme.border.width.thin)} solid ${
            theme.colors.surface.border.gray.muted
          };`
        : ''
    }
    ${
      pagination
        ? `border-bottom: ${makeBorderSize(theme.border.width.thin)} solid ${
            theme.colors.surface.border.gray.muted
          };`
        : ''
    }
    --data-table-library_grid-template-columns: ${
      gridTemplateColumns
        ? `${selectionType === 'multiple' ? 'min-content' : ''} ${gridTemplateColumns} ${
            hasHoverActions ? lastHoverActionsColWidth : ''
          }`
        : ` ${
            selectionType === 'multiple' ? 'min-content' : ''
          } repeat(${columnCount},minmax(100px, 1fr)) ${
            hasHoverActions ? lastHoverActionsColWidth : ''
          } !important;`
    } !important;
    background-color: ${getIn(theme.colors, backgroundColor)};
    `,
    HeaderCell: `
    position: ${shouldHeaderBeSticky ? 'sticky' : 'relative'};

    top: ${shouldHeaderBeSticky ? '0' : undefined};
    ${stickyColumnsCSS}
    `,
    Cell: `
    ${stickyColumnsCSS}
    `,
    FooterCell: `
    position: ${isFooterSticky ? 'sticky' : 'relative'};
    bottom: ${isFooterSticky ? '0' : undefined};
    ${stickyColumnsCSS}
    `,
  });

  useEffect(() => {
    // Get the total number of items - reflects the filtered set so pagination/toolbar/select-all
    // all agree on "how many rows are there right now".
    setTotalItems(filteredData.nodes.length);
  }, [filteredData.nodes]);

  // Selection Logic
  const onSelectChange: MiddlewareFunction = (_, state): void => {
    const selectedIds: Identifier[] = state.id ? [state.id] : state.ids ?? [];
    setSelectedRows(selectedIds);
    onSelectionChange?.({
      selectedIds,
      values: data.nodes.filter((node) => selectedIds.includes(node.id)),
    });
  };

  const rowSelectConfig = useRowSelect(
    data,
    {
      onChange: onSelectChange,
      state: {
        ...(selectionType === 'multiple'
          ? { ids: selectedRows }
          : selectionType === 'single'
          ? { id: selectedRows[0] }
          : {}),
      },
    },
    {
      clickType:
        multiSelectTrigger === 'row' ? SelectClickTypes.RowClick : SelectClickTypes.ButtonClick,
      rowSelect: selectionType !== 'none' ? rowSelectType[selectionType] : undefined,
    },
  );

  const toggleRowSelectionById = useMemo(
    () => (id: Identifier): void => {
      // Use recursive selection only for grouped tables with multiple selection
      if (selectionType === 'multiple' && isGrouped) {
        rowSelectConfig.fns.onToggleByIdRecursively(id, {
          // When clicking partially selected parent, select all children
          isPartialToAll: true,
        });
      } else {
        rowSelectConfig.fns.onToggleById(id);
      }
    },
    [rowSelectConfig.fns],
  );

  const deselectAllRows = useMemo(
    () => (): void => {
      rowSelectConfig.fns.onRemoveAll();
    },
    [rowSelectConfig.fns],
  );

  const toggleAllRowsSelection = useMemo(
    () => (): void => {
      if (selectedRows.length > 0) {
        rowSelectConfig.fns.onRemoveAll();
      } else if (isGrouped) {
        rowSelectConfig.fns.onToggleAll({});
      } else {
        // Only the currently filtered/visible rows - matching "select all" meaning "select
        // everything you can currently see", not everything that ever existed in `data`.
        const ids = filteredData.nodes
          .map((item: TableNode<Item>) => (disabledRows.includes(item.id) ? null : item.id))
          .filter(Boolean) as Identifier[];

        rowSelectConfig.fns.onAddAll(ids);
      }
    },
    [rowSelectConfig.fns, filteredData.nodes, selectedRows, disabledRows],
  );

  // Row expansion (group-header rows only, see `isGrouped`).
  //
  // Uncontrolled default seeds every group-header id as expanded, so tables that don't pass
  // `expandedRowIds`/`defaultExpandedRowIds` keep today's "always fully expanded" look.
  const [internalExpandedRowIds, setInternalExpandedRowIds] = React.useState<Identifier[]>(
    () =>
      defaultExpandedRowIds ??
      data.nodes
        .filter((node) => (((node as unknown) as { nodes?: unknown[] }).nodes?.length ?? 0) > 0)
        .map((node) => node.id),
  );
  const expandedRowIds = expandedRowIdsProp ?? internalExpandedRowIds;

  const handleTreeChange: MiddlewareFunction = (_, state): void => {
    const nextExpandedRowIds: Identifier[] = state.ids ?? [];
    if (expandedRowIdsProp === undefined) {
      setInternalExpandedRowIds(nextExpandedRowIds);
    }
    onExpandedRowIdsChange?.(nextExpandedRowIds);
  };

  const tree = useTree(
    isGrouped ? data : { nodes: [] },
    {
      onChange: handleTreeChange,
      state: { ids: expandedRowIds },
    },
    {
      // Toggling is done manually (see `toggleRowExpansionById`) via a dedicated disclosure
      // control rather than the library auto-wiring row clicks - `ButtonClick` just opts out of
      // that auto-wiring, matching how `SelectClickTypes` is handled for row selection above.
      clickType: TreeExpandClickTypes.ButtonClick,
      // Disable all indentation for flat appearance
      treeYLevel: undefined,
    },
  );

  const toggleRowExpansionById = useMemo(
    () => (id: Identifier): void => {
      tree.fns.onToggleById(id);
    },
    [tree.fns],
  );

  // @table-library's own footer row/cells hard-code `role="rowfooter"`/`role="columnfooter"` -
  // neither is a real WAI-ARIA role (there is no "footer cell" role; `cell`/`row` are what the
  // `table` pattern already uses for the body) - and both are applied after spreading incoming
  // props, so they can't be overridden via a `role` prop the way the header row's bad default
  // can. Corrected on the real DOM nodes instead, after every render (idempotent - a no-op once
  // already fixed).
  useIsomorphicLayoutEffect(() => {
    tableElementRef.current
      ?.querySelectorAll('[role="rowfooter"]')
      .forEach((node) => node.setAttribute('role', 'row'));
    tableElementRef.current
      ?.querySelectorAll('[role="columnfooter"]')
      .forEach((node) => node.setAttribute('role', 'cell'));
  });

  // Sort Logic
  //
  // The underlying @table-library `useSort` only tracks a single { sortKey, reverse } pair, so
  // it drives the PRIMARY (most significant) sort column only - including presort via its
  // `state` initial value below, and the asc -> desc -> unsorted 3-click cycle via
  // `SortToggleType.AlternateWithReset`. Secondary/tertiary columns (added via shift-click) are
  // tracked separately in `secondarySort`, and we compose the final row order ourselves in
  // `applySortEntries` instead of handing off to the library's own single-key sort modifier.
  const [secondarySort, setSecondarySort] = React.useState<TableSortOrderEntry[]>([]);

  const handleSortChange: MiddlewareFunction = (_, state) => {
    onSortChange?.({
      sortKey: state.sortKey,
      isSortReversed: state.reverse,
    });
    // The primary column was cleared (3rd click reset) - secondary/tertiary keys no longer have
    // a primary to be secondary to, so the whole multi-sort resets back to unsorted too.
    if (!state.sortKey || state.sortKey === 'NONE') {
      setSecondarySort([]);
    }
  };

  const sort = useSort(
    data,
    {
      onChange: handleSortChange,
      state: initialSort
        ? { sortKey: initialSort.sortKey, reverse: initialSort.direction === 'desc' }
        : undefined,
    },
    {
      // @ts-expect-error ignore this, if sortFunctions is undefined, it will be ignored
      sortFns: sortFunctions,
      sortToggleType: SortToggleType.AlternateWithReset,
    },
  );

  const activeSortEntries: TableSortOrderEntry[] = useMemo(() => {
    const primaryKey = sort.state.sortKey;
    const primary: TableSortOrderEntry[] =
      primaryKey && primaryKey !== 'NONE'
        ? [{ sortKey: primaryKey, direction: sort.state.reverse ? 'desc' : 'asc' }]
        : [];
    return [...primary, ...secondarySort];
  }, [sort.state, secondarySort]);

  const applySortEntries = useCallback(
    (nodesToSort: TableNode<Item>[]): TableNode<Item>[] => {
      if (!sortFunctions || activeSortEntries.length === 0) {
        return nodesToSort;
      }
      // Compose least-significant first so the stable sort produces correct multi-key order -
      // the primary (index 0) is applied last, so it wins ties among the other keys.
      let sortedNodes = nodesToSort;
      for (let i = activeSortEntries.length - 1; i >= 0; i -= 1) {
        const entry = activeSortEntries[i];
        const sortFn = sortFunctions[entry.sortKey];
        if (!sortFn) continue;
        sortedNodes = sortFn(sortedNodes);
        if (entry.direction === 'desc') {
          sortedNodes = [...sortedNodes].reverse();
        }
      }
      // Recurse into grouped/tree children (if any) so nested rows sort the same way.
      return sortedNodes.map((node) => {
        const nodeWithChildren = node as TableNode<Item> & { nodes?: TableNode<Item>[] };
        return Array.isArray(nodeWithChildren.nodes)
          ? { ...node, nodes: applySortEntries(nodeWithChildren.nodes) }
          : node;
      });
    },
    [sortFunctions, activeSortEntries],
  );

  const sortedData: TableData<Item> = useMemo(
    () =>
      activeSortEntries.length > 0 ? { nodes: applySortEntries(filteredData.nodes) } : filteredData,
    [filteredData, applySortEntries, activeSortEntries],
  );

  const currentSortedState: TableContextType<Item>['currentSortedState'] = useMemo(() => {
    return {
      sortKey: activeSortEntries[0]?.sortKey ?? '',
      isSortReversed: activeSortEntries[0]?.direction === 'desc',
      sortableColumns: Object.keys(sortFunctions ?? {}),
      sortOrder: activeSortEntries,
    };
  }, [activeSortEntries, sortFunctions]);

  const toggleSort = useCallback(
    (sortKey: string, isMultiSort = false): void => {
      if (!isMultiSort) {
        // Plain click always means "sort only by this column" - replace the whole spec, cycling
        // this column's own direction when it's already the (sole) active sort.
        setSecondarySort([]);
        sort.fns.onToggleSort({ sortKey });
        return;
      }

      // Shift-click: toggle just this one key without disturbing the others.
      if (sortKey === sort.state.sortKey) {
        // It's the primary key - let useSort's own cycle handle it (asc -> desc -> unsorted).
        // If it clears, handleSortChange resets secondarySort too.
        sort.fns.onToggleSort({ sortKey });
        return;
      }

      const secondaryIndex = secondarySort.findIndex((entry) => entry.sortKey === sortKey);
      if (secondaryIndex === -1) {
        if (!sort.state.sortKey || sort.state.sortKey === 'NONE') {
          // No primary yet - this shift-click establishes it.
          sort.fns.onToggleSort({ sortKey });
        } else {
          setSecondarySort((prev) => [...prev, { sortKey, direction: 'asc' }]);
        }
        return;
      }

      setSecondarySort((prev) => {
        const entry = prev[secondaryIndex];
        const nextDirection = entry.direction === 'asc' ? 'desc' : null;
        if (nextDirection === null) {
          return prev.filter((_, index) => index !== secondaryIndex);
        }
        return prev.map((sortEntry, index) =>
          index === secondaryIndex ? { ...sortEntry, direction: nextDirection } : sortEntry,
        );
      });
    },
    [sort.fns, sort.state.sortKey, secondarySort],
  );

  // Pagination

  const hasPagination = Boolean(pagination);

  // Extract defaultPageSize from TablePagination child props
  const paginationDefaultPageSize =
    React.isValidElement(pagination) && getComponentId(pagination) === ComponentIds.TablePagination
      ? (pagination.props as { defaultPageSize?: number }).defaultPageSize
      : undefined;

  const paginationConfig = usePagination(
    filteredData,
    {
      state: {
        page: 0,
        size: paginationDefaultPageSize ?? tablePagination.defaultPageSize,
      },
    },
    {
      isServer: paginationType === 'server',
    },
  );

  const currentPaginationState = useMemo(() => {
    return hasPagination
      ? {
          page: paginationConfig.state.page,
          size: paginationConfig.state.size,
        }
      : undefined;
  }, [paginationConfig.state, hasPagination]);

  const setPaginationPage = useCallback(
    (page: number): void => {
      paginationConfig.fns.onSetPage(page);
    },
    [paginationConfig.fns],
  );

  const setPaginationRowSize = useCallback(
    (size: number): void => {
      paginationConfig.fns.onSetSize(size);
    },
    [paginationConfig.fns],
  );

  // Toolbar Component
  if (__DEV__) {
    if (toolbar && !isValidAllowedChildren(toolbar, ComponentIds.TableToolbar)) {
      throwKlear360Error({
        message: 'Only TableToolbar component is allowed in the `toolbar` prop',
        moduleName: 'Table',
      });
    }
  }

  // Table Context
  const tableContext: TableContextType<Item> = useMemo(
    () => ({
      selectionType,
      selectedRows,
      totalItems,
      toggleRowSelectionById,
      toggleAllRowsSelection,
      deselectAllRows,
      rowDensity,
      toggleSort,
      currentSortedState,
      setPaginationPage,
      setPaginationRowSize,
      currentPaginationState,
      showStripedRows,
      disabledRows,
      setDisabledRows,
      paginationType,
      setPaginationType,
      backgroundColor,
      headerRowDensity,
      setHeaderRowDensity,
      showBorderedCells,
      shouldHeaderBeSticky,
      hasHoverActions,
      setHasHoverActions,
      multiSelectTrigger,
      columnCount,
      gridTemplateColumns,
      isVirtualized,
      // sortedData.nodes (not the raw data.nodes) so virtualized tables - which render
      // straight off this context value instead of through StyledReactTable's own pipeline -
      // reflect the current sort too.
      tableData: sortedData.nodes,
      isGrouped,
      expandedRowIds,
      toggleRowExpansionById,
      tableToolbarPlacement: toolbar?.props?.placement ?? 'inline',
      checkboxDisplay,
      globalFilterValue,
      setGlobalFilterValue,
      columnFilterValues,
      setColumnFilterValue,
      filterableColumns,
    }),
    [
      selectionType,
      selectedRows,
      totalItems,
      toggleRowSelectionById,
      toggleAllRowsSelection,
      deselectAllRows,
      gridTemplateColumns,
      rowDensity,
      toggleSort,
      columnCount,
      currentSortedState,
      setPaginationPage,
      setPaginationRowSize,
      currentPaginationState,
      showStripedRows,
      disabledRows,
      setDisabledRows,
      paginationType,
      setPaginationType,
      backgroundColor,
      headerRowDensity,
      setHeaderRowDensity,
      showBorderedCells,
      shouldHeaderBeSticky,
      hasHoverActions,
      setHasHoverActions,
      multiSelectTrigger,
      isVirtualized,
      sortedData,
      isGrouped,
      expandedRowIds,
      toggleRowExpansionById,
      checkboxDisplay,
      globalFilterValue,
      setGlobalFilterValue,
      columnFilterValues,
      setColumnFilterValue,
      filterableColumns,
    ],
  );

  return (
    <TableContext.Provider value={tableContext}>
      <TableSurface
        colorScheme={colorScheme}
        borderRadius={isInsideListView ? 'none' : 'medium'}
        overflow="hidden"
        isInsideListView={isInsideListView ?? false}
        // Transparent when inside ListView so the gradient pseudo-elements
        // on ListViewSurface remain visible through the TableSurface.
        backgroundColor={isInsideListView ? 'transparent' : 'surface.background.gray.intense'}
      >
        {isLoading ? (
          <BaseBox
            flex={1}
            {...getStyledProps(rest)}
            {...metaAttribute({ name: MetaConstants.Table })}
            {...makeAnalyticsAttribute(rest)}
            testID="table-skeleton"
          >
            {/* Header skeleton row */}
            <StyledSkeletonRow $columns={columnCount || 5} $isHeader>
              {Array.from({ length: columnCount || 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  width={
                    i === 0 ? SKELETON_CELL_WIDTHS.headerFirst : SKELETON_CELL_WIDTHS.headerRest
                  }
                  height="16px"
                  borderRadius="medium"
                />
              ))}
            </StyledSkeletonRow>
            {/* Body skeleton rows */}
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIdx) => (
              <StyledSkeletonRow key={rowIdx} $columns={columnCount || 5}>
                {Array.from({ length: columnCount || 5 }).map((_, colIdx) => {
                  const cols = columnCount || 5;
                  const width =
                    colIdx === 0
                      ? SKELETON_CELL_WIDTHS.first
                      : colIdx === cols - 1
                      ? SKELETON_CELL_WIDTHS.last
                      : SKELETON_CELL_WIDTHS.middle;
                  return (
                    <Skeleton key={colIdx} width={width} height="14px" borderRadius="medium" />
                  );
                })}
              </StyledSkeletonRow>
            ))}
          </BaseBox>
        ) : (
          <BaseBox
            flex={1}
            position="relative"
            {...getStyledProps(rest)}
            {...metaAttribute({ name: MetaConstants.Table })}
            width={isVirtualized ? `100%` : undefined}
            {...makeAnalyticsAttribute(rest)}
          >
            {isRefreshSpinnerMounted && (
              <RefreshWrapper
                position="absolute"
                width="100%"
                height="100%"
                zIndex={refreshWrapperZIndex}
                backgroundColor="overlay.background.subtle"
                justifyContent="center"
                alignItems="center"
                display="flex"
                isRefreshSpinnerEntering={isRefreshSpinnerEntering}
                isRefreshSpinnerExiting={isRefreshSpinnerExiting}
                isRefreshSpinnerVisible={isRefreshSpinnerVisible}
              >
                <Spinner color="white" accessibilityLabel="Refreshing Table" size="large" />
              </RefreshWrapper>
            )}
            {/* wrapping toolbar in BaseBox and passing the same analytics attributes as of table because in analytics POV, events triggered are from table */}
            <BaseBox {...makeAnalyticsAttribute(rest)}>{toolbar}</BaseBox>
            <StyledReactTable
              ref={tableElementRef}
              role="table"
              layout={{ fixedHeader: shouldHeaderBeSticky, horizontalScroll: true }}
              data={sortedData}
              // @ts-expect-error ignore this, theme clashes with styled-component's theme. We're using useTheme from klear360 to get actual theme
              theme={tableTheme}
              select={selectionType !== 'none' ? rowSelectConfig : null}
              // Sorting is applied ourselves above (`sortedData`) so it can compose multiple
              // columns - the library's own single-key sort modifier is unused here.
              sort={null}
              tree={isGrouped ? tree : null}
              $styledProps={{
                height,
                width: isVirtualized ? `100%` : undefined,
                isVirtualized,
                isSelectable: selectionType !== 'none',
                showStripedRows,
              }}
              pagination={hasPagination ? paginationConfig : null}
              // No `aria-multiselectable` here - it's only a valid ARIA attribute on
              // grid/listbox/tree/tablist/treegrid roles, not `role="table"`; per-row
              // checkboxes already expose selection state individually.
              {...metaAttribute({ name: MetaConstants.Table })}
              {...makeAnalyticsAttribute(rest)}
            >
              {resolvedChildren}
            </StyledReactTable>
            {pagination}
          </BaseBox>
        )}
      </TableSurface>
    </TableContext.Provider>
  );
};
const Table = assignWithoutSideEffects(_Table, {
  displayName: 'Table',
  componentId: ComponentIds.Table,
});

export { Table };
