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
 * Appearance, selection and structural state - everything that does NOT change when the user
 * sorts, filters or paginates. Read by the highest-multiplicity consumers (`TableRow`,
 * `TableCell`, one instance per row/cell), so keeping this separate from
 * `TableInteractionContextType` means sorting/filtering/paginating doesn't re-render every row
 * and cell in the table - only the (far fewer) components that actually display that state.
 */
export type TableContextType = {
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
 * Sort, filter, pagination and the resulting data/count - everything that DOES change on those
 * interactions. Kept out of `TableContextType` so that `TableRow`/`TableCell` (which never read
 * any of this) don't re-render on every sort click or filter keystroke. Consumers that display
 * this state (`TableHeaderCell`'s sort icon, the auto-injected filter row, `TablePagination`,
 * `TableToolbar`, `TableHeaderRow`'s "select all" checkbox) read this alongside
 * `TableContextType` as needed.
 */
export type TableInteractionContextType<Item> = {
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

const TableContext = React.createContext<TableContextType>({
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

const TableInteractionContext = React.createContext<TableInteractionContextType<unknown>>({
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

const useTableContext = (): TableContextType => {
  const context = React.useContext(TableContext);
  return context;
};

const useTableInteractionContext = <Item,>(): TableInteractionContextType<Item> => {
  const context = React.useContext(
    TableInteractionContext as React.Context<TableInteractionContextType<Item>>,
  );
  return context;
};

export { useTableContext, TableContext, useTableInteractionContext, TableInteractionContext };
