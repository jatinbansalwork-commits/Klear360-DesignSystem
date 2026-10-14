/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @typescript-eslint/no-empty-function
import React from 'react';
import type { TableNode } from '@table-library/react-table-library/table';
import type {
  TableBackgroundColors,
  TableProps,
  TablePaginationType,
  TableHeaderRowProps,
  TableNode as LocalTableNode,
  TableToolbarPlacement,
  TableSortOrderEntry,
  TableColumnFilterConfig,
} from './types';

/**
 * Selection + appearance state, read by the per-row/per-cell components (`TableRow`, `TableCell`,
 * `TableEditableCell`, `TableFooterCell`, etc. - one instance per visible row/column, N instances
 * total). Deliberately excludes sort/filter/pagination/`tableData` (see `TableDataContextType`) -
 * those change on every keystroke in a column filter or every sort click, and previously lived in
 * this same context object, so a filter keystroke recreated the one shared context value and
 * forced every mounted row and cell to re-render even though none of them read that state. Kept
 * in a separate context so those changes don't touch this one at all.
 */
export type TableRowContextType<Item> = {
  selectionType?: TableProps<unknown>['selectionType'];
  selectedRows?: TableNode['id'][];
  toggleRowSelectionById: (id: TableNode['id']) => void;
  toggleAllRowsSelection: () => void;
  deselectAllRows: () => void;
  rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  showStripedRows?: boolean;
  disabledRows: TableNode['id'][];
  setDisabledRows: React.Dispatch<React.SetStateAction<TableNode['id'][]>>;
  backgroundColor: TableBackgroundColors | 'transparent';
  headerRowDensity?: TableHeaderRowProps['rowDensity'];
  setHeaderRowDensity: React.Dispatch<React.SetStateAction<TableHeaderRowProps['rowDensity']>>;
  showBorderedCells: NonNullable<TableProps<unknown>['showBorderedCells']>;
  /** Whether the header is currently rendered sticky (see `TableProps['isHeaderSticky']`, and sticky columns which force it on too). */
  shouldHeaderBeSticky: boolean;
  hasHoverActions: boolean;
  setHasHoverActions: (hasHoverActions: boolean) => void;
  multiSelectTrigger?: TableProps<unknown>['multiSelectTrigger'];
  columnCount: number;
  gridTemplateColumns: string | undefined;
  isVirtualized?: boolean;
  isGrouped: boolean;
  expandedRowIds: TableNode['id'][];
  toggleRowExpansionById: (id: TableNode['id']) => void;
  tableToolbarPlacement: TableToolbarPlacement;
  /** @see TableProps['checkboxDisplay'] */
  checkboxDisplay: NonNullable<TableProps<unknown>['checkboxDisplay']>;
};

/**
 * Data/sort/filter/pagination state, read only by single-instance components (`TableHeader`,
 * `TableToolbar`, `TablePagination`, `TableVirtualizedWrapper`). Changes on every sort click,
 * filter keystroke, page change, or data update - kept out of `TableRowContextType` so those
 * changes don't force every row/cell to re-render (see that type's doc comment).
 */
export type TableDataContextType<Item> = {
  totalItems: number;
  /**
   * Toggles sort on `sortKey`. Pass `isMultiSort: true` (a shift-click) to add/toggle this
   * column as an additional sort key instead of replacing the current sort.
   */
  toggleSort: (sortKey: string, isMultiSort?: boolean) => void;
  currentSortedState: {
    /** The primary (most significant) sort key, kept for backward compatibility - mirrors `sortOrder[0]?.sortKey`. */
    sortKey: string;
    /** The primary sort key's direction - mirrors `sortOrder[0]?.direction === 'desc'`. */
    isSortReversed: boolean;
    sortableColumns?: string[];
    /** The full active sort order, primary (most significant) first. Empty when unsorted. */
    sortOrder: TableSortOrderEntry[];
  };
  setPaginationPage: (page: number) => void;
  setPaginationRowSize: (size: number) => void;
  currentPaginationState?: {
    page: number;
    size: number;
  };
  paginationType: NonNullable<TablePaginationType>;
  setPaginationType: React.Dispatch<React.SetStateAction<NonNullable<TablePaginationType>>>;
  tableData: LocalTableNode<Item>[];
  globalFilterValue: string;
  setGlobalFilterValue: (value: string) => void;
  columnFilterValues: Record<string, string | string[]>;
  setColumnFilterValue: (key: string, value: string | string[]) => void;
  /** headerKeys present in `filterFunctions` — mirrors `currentSortedState.sortableColumns`. */
  filterableColumns: string[];
  /** @see TableProps['filterConfig'] */
  filterConfig: Record<string, TableColumnFilterConfig>;
};

const TableRowContext = React.createContext<TableRowContextType<unknown>>({
  selectionType: 'none',
  selectedRows: undefined,
  toggleRowSelectionById: () => {},
  toggleAllRowsSelection: () => {},
  deselectAllRows: () => {},
  rowDensity: 'normal',
  disabledRows: [],
  setDisabledRows: () => {},
  backgroundColor: 'surface.background.gray.intense',
  setHeaderRowDensity: () => {},
  showBorderedCells: true,
  shouldHeaderBeSticky: false,
  hasHoverActions: false,
  setHasHoverActions: () => {},
  multiSelectTrigger: 'row',
  columnCount: 0,
  gridTemplateColumns: undefined,
  isVirtualized: false,
  isGrouped: false,
  expandedRowIds: [],
  toggleRowExpansionById: () => {},
  tableToolbarPlacement: 'inline',
  checkboxDisplay: 'always',
});

const TableDataContext = React.createContext<TableDataContextType<unknown>>({
  totalItems: 0,
  toggleSort: () => {},
  currentSortedState: {
    sortKey: '',
    isSortReversed: false,
    sortOrder: [],
  },
  setPaginationPage: () => {},
  setPaginationRowSize: () => {},
  paginationType: 'client',
  setPaginationType: () => {},
  tableData: [],
  globalFilterValue: '',
  setGlobalFilterValue: () => {},
  columnFilterValues: {},
  setColumnFilterValue: () => {},
  filterableColumns: [],
  filterConfig: {},
});

const useTableRowContext = <Item,>(): TableRowContextType<Item> => {
  const context = React.useContext(TableRowContext as React.Context<TableRowContextType<Item>>);
  return context;
};

const useTableDataContext = <Item,>(): TableDataContextType<Item> => {
  const context = React.useContext(TableDataContext as React.Context<TableDataContextType<Item>>);
  return context;
};

export { useTableRowContext, useTableDataContext, TableRowContext, TableDataContext };
