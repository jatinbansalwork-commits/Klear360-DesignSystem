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
} from './types';

export type TableContextType<Item> = {
  selectionType?: TableProps<unknown>['selectionType'];
  selectedRows?: TableNode['id'][];
  totalItems: number;
  toggleRowSelectionById: (id: TableNode['id']) => void;
  toggleAllRowsSelection: () => void;
  deselectAllRows: () => void;
  rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
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
  showStripedRows?: boolean;
  disabledRows: TableNode['id'][];
  setDisabledRows: React.Dispatch<React.SetStateAction<TableNode['id'][]>>;
  paginationType: NonNullable<TablePaginationType>;
  setPaginationType: React.Dispatch<React.SetStateAction<NonNullable<TablePaginationType>>>;
  backgroundColor: TableBackgroundColors | 'transparent';
  headerRowDensity?: TableHeaderRowProps['rowDensity'];
  setHeaderRowDensity: React.Dispatch<React.SetStateAction<TableHeaderRowProps['rowDensity']>>;
  showBorderedCells: NonNullable<TableProps<unknown>['showBorderedCells']>;
  hasHoverActions: boolean;
  setHasHoverActions: (hasHoverActions: boolean) => void;
  multiSelectTrigger?: TableProps<unknown>['multiSelectTrigger'];
  columnCount: number;
  gridTemplateColumns: string | undefined;
  isVirtualized?: boolean;
  tableData: LocalTableNode<Item>[];
  isGrouped: boolean;
  expandedRowIds: TableNode['id'][];
  toggleRowExpansionById: (id: TableNode['id']) => void;
  tableToolbarPlacement: TableToolbarPlacement;
  /** @see TableProps['checkboxDisplay'] */
  checkboxDisplay: NonNullable<TableProps<unknown>['checkboxDisplay']>;
  globalFilterValue: string;
  setGlobalFilterValue: (value: string) => void;
  columnFilterValues: Record<string, string>;
  setColumnFilterValue: (key: string, value: string) => void;
  /** headerKeys present in `filterFunctions` — mirrors `currentSortedState.sortableColumns`. */
  filterableColumns: string[];
};

const TableContext = React.createContext<TableContextType<unknown>>({
  selectionType: 'none',
  selectedRows: undefined,
  totalItems: 0,
  toggleRowSelectionById: () => {},
  toggleAllRowsSelection: () => {},
  deselectAllRows: () => {},
  rowDensity: 'normal',
  toggleSort: () => {},
  currentSortedState: {
    sortKey: '',
    isSortReversed: false,
    sortOrder: [],
  },
  setPaginationPage: () => {},
  setPaginationRowSize: () => {},
  disabledRows: [],
  setDisabledRows: () => {},
  paginationType: 'client',
  setPaginationType: () => {},
  backgroundColor: 'surface.background.gray.intense',
  setHeaderRowDensity: () => {},
  showBorderedCells: true,
  hasHoverActions: false,
  setHasHoverActions: () => {},
  multiSelectTrigger: 'row',
  columnCount: 0,
  gridTemplateColumns: undefined,
  isVirtualized: false,
  tableData: [],
  isGrouped: false,
  expandedRowIds: [],
  toggleRowExpansionById: () => {},
  tableToolbarPlacement: 'inline',
  checkboxDisplay: 'always',
  globalFilterValue: '',
  setGlobalFilterValue: () => {},
  columnFilterValues: {},
  setColumnFilterValue: () => {},
  filterableColumns: [],
});

const useTableContext = <Item,>(): TableContextType<Item> => {
  const context = React.useContext(TableContext as React.Context<TableContextType<Item>>);
  return context;
};

export { useTableContext, TableContext };
