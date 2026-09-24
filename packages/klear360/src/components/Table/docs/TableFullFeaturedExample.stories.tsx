import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarSearch,
  TablePagination,
} from '../../Table';
import type { TableData, TableNode } from '../types';
import {
  createTransactionTableNodes,
  formatDate,
  getTransactionStateColor,
  transactionStateOptions,
} from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { EmptyState } from '~components/EmptyState';
import { ListSearchIcon } from '~components/Icons';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Full Featured',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const PAGE_SIZE = 8;
const SERVER_LATENCY_MS = 400;

// The full, unpaginated "database" this story's fake server queries against - 60 rows is enough
// that pagination, sorting, and filtering all have something real to do.
const fullDataset = createTransactionTableNodes(60);

// The single source of truth for both "sorting"/"filtering" - the fake server below uses these
// directly, and `Table`'s own `sortFunctions`/`filterFunctions` further down are derived from (or,
// for filtering, exactly) these same definitions. See this story's top-level comment for why that
// matters.
const SORT_COMPARATORS: Record<
  string,
  (a: TransactionTableItem, b: TransactionTableItem) => number
> = {
  transactionId: (a, b) => a.transactionId.localeCompare(b.transactionId),
  companyName: (a, b) => a.companyName.localeCompare(b.companyName),
  transactionState: (a, b) => a.transactionState.localeCompare(b.transactionState),
  etd: (a, b) => a.etd.getTime() - b.etd.getTime(),
};

// `Table`'s own `sortFunctions` prop wants a whole-array sorter per key (`(array) => array`), not
// a pairwise comparator - derived from `SORT_COMPARATORS` rather than hand-written a second time,
// so the column that's sortable in the UI and the column the fake server actually sorts by can
// never drift apart.
const sortFunctionsForTable: Record<
  string,
  (array: TransactionTableItem[]) => TransactionTableItem[]
> = Object.fromEntries(
  Object.entries(SORT_COMPARATORS).map(([key, comparator]) => [
    key,
    (array: TransactionTableItem[]) => [...array].sort(comparator),
  ]),
);

const FILTER_PREDICATES: Record<
  string,
  (item: TransactionTableItem, value: string | string[]) => boolean
> = {
  companyName: (item, value) =>
    typeof value === 'string' && item.companyName.toLowerCase().includes(value.toLowerCase()),
  // Dropdown (`filterConfig: { type: 'multiselect' }` below), so the value is a `string[]` of
  // exact states rather than a substring the way the plain-text filters here work.
  transactionState: (item, value) =>
    Array.isArray(value) ? value.includes(item.transactionState) : true,
  vesselName: (item, value) =>
    typeof value === 'string' && item.vesselName.toLowerCase().includes(value.toLowerCase()),
};

type ServerQuery = {
  page: number; // 1-indexed, for slicing - see `handlePageChange` for the 0-indexed callback boundary.
  sortKey?: string;
  isSortReversed: boolean;
  globalFilterValue: string;
  columnFilterValues: Record<string, string | string[]>;
};

const INITIAL_SERVER_QUERY: ServerQuery = {
  page: 1,
  sortKey: undefined,
  isSortReversed: false,
  globalFilterValue: '',
  columnFilterValues: {},
};

type ServerResult = { nodes: TransactionTableItem[]; totalCount: number };

// Stands in for a real API call - applies column filters (AND) and global search (OR across all
// of `FILTER_PREDICATES`) before sorting and slicing to the requested page, exactly what a real
// backend endpoint for this table would do with the same params in its query string.
const queryServer = (query: ServerQuery): Promise<ServerResult> =>
  new Promise((resolve) => {
    setTimeout(() => {
      let rows = fullDataset;

      Object.entries(query.columnFilterValues).forEach(([key, value]) => {
        const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
        if (isEmpty) return;
        const predicate = FILTER_PREDICATES[key];
        if (predicate) rows = rows.filter((item) => predicate(item, value));
      });

      if (query.globalFilterValue) {
        rows = rows.filter((item) =>
          Object.values(FILTER_PREDICATES).some((predicate) =>
            predicate(item, query.globalFilterValue),
          ),
        );
      }

      if (query.sortKey && SORT_COMPARATORS[query.sortKey]) {
        const comparator = SORT_COMPARATORS[query.sortKey];
        rows = [...rows].sort(query.isSortReversed ? (a, b) => comparator(b, a) : comparator);
      }

      const totalCount = rows.length;
      const start = (query.page - 1) * PAGE_SIZE;
      resolve({ nodes: rows.slice(start, start + PAGE_SIZE), totalCount });
    }, SERVER_LATENCY_MS);
  });

type ColumnDef = {
  key: string;
  header: string;
  width: string;
  // Present only for columns that should be sortable/filterable - drives both this column's
  // `TableHeaderCell headerKey` below and whether it's wired into the fake server's own sort.
  sortable?: boolean;
  render: (item: TransactionTableItem) => React.ReactNode;
};

const columnDefs: ColumnDef[] = [
  {
    key: 'transactionId',
    header: 'Transaction ID',
    width: '150px',
    sortable: true,
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
  },
  {
    key: 'companyName',
    header: 'Company Name',
    width: '220px',
    sortable: true,
    render: (item) => item.companyName,
  },
  {
    key: 'transactionState',
    header: 'Transaction State',
    width: '160px',
    sortable: true,
    render: (item) => (
      <Badge size="medium" color={getTransactionStateColor(item.transactionState)}>
        {item.transactionState}
      </Badge>
    ),
  },
  {
    key: 'etd',
    header: 'ETD',
    width: '130px',
    sortable: true,
    render: (item) => formatDate(item.etd),
  },
  {
    key: 'vesselName',
    header: 'Vessel Name',
    width: '220px',
    render: (item) => item.vesselName,
  },
  {
    key: 'countryOfExport',
    header: 'Country of Export',
    width: '180px',
    render: (item) => item.countryOfExport,
  },
  {
    key: 'mbl',
    header: 'MBL',
    width: '150px',
    render: (item) => item.mbl,
  },
];

const gridTemplateColumns = columnDefs.map((column) => column.width).join(' ');

// A display-only row for the empty-state cell below - `TableRow` requires an `item` with an
// `id`, but this row never renders real data, so the rest of `TransactionTableItem` is cast away
// rather than fabricated.
const EMPTY_ROW_PLACEHOLDER = { id: '__empty__' } as TableNode<TransactionTableItem>;

/**
 * Every other Table example documents one feature in isolation; this one combines the features
 * that actually show up together on a real "list" screen - server-side pagination, sorting,
 * column filters, global search, sticky header/columns, and an empty state - because getting them
 * to compose correctly is more than turning on five props at once. What doesn't fall out for
 * free:
 *
 * - **Sort/filter logic has to serve two masters.** `sortFunctions`/`filterFunctions` are what
 *   make a column sortable/filterable at all - Table applies them locally to whatever `data.nodes`
 *   currently holds. With server-side pagination that's only the current page, already
 *   sorted/filtered server-side - so `sortFunctionsForTable`/`filterFunctions` given to `Table`
 *   below are built from (sorting) or are exactly (filtering) the same `SORT_COMPARATORS`/
 *   `FILTER_PREDICATES` `queryServer` uses, rather than duplicating that logic. Re-applying them to
 *   already-correct data is a safe no-op; what actually moves the data is `onSortChange`/
 *   `onColumnFilterValuesChange`/`onGlobalFilterValueChange` re-querying the "server" with the new
 *   params. `sortFunctions`/`filterFunctions` alone, without also wiring those three callbacks,
 *   would make headers *look* interactive while only reordering/filtering the 8 rows on screen.
 * - **A `filterFunctions` entry doesn't require its own column filter input.** `vesselName`
 *   participates in global search (its predicate is in `filterFunctions`) but its `TableHeaderCell`
 *   below has no `headerKey`, so it never gets a per-column filter box - only `companyName` and
 *   `transactionState` do, since only their header cells carry one.
 * - **`onSortChange` only reports the primary sort key** - shift-click secondary/tertiary sort
 *   (see the Sorting example) has no equivalent callback, so there's nothing to re-query the
 *   server with for it. This example only wires the primary column to the server round-trip for
 *   that reason; shift-clicking a second column here reorders only the current page's 8 rows.
 * - **The empty state can't simply replace `<Table>`.** Unlike the wrapper pattern in the Empty
 *   States example, `TableToolbarSearch` needs to *stay mounted* so the box (and the way to clear
 *   it) is still there when a search returns nothing - so this uses the `children` render-prop API
 *   instead of `columns`, and swaps only `TableBody`'s content for a single row whose one
 *   `TableCell` spans every column (`gridColumnStart`/`gridColumnEnd`, see
 *   `TableCellGridSpanningProps`) and holds an `EmptyState`, while `TableHeader` and the toolbar
 *   stay exactly as they are.
 *
 * Try: search for a company that doesn't exist (empty state, search box stays put to clear it
 * from); sort by ETD, then change pages (sort persists across the "server" round trip); scroll
 * right (Transaction ID / Company Name stay frozen).
 */
export const FullFeaturedTable = (): React.ReactElement => {
  const [query, setQuery] = React.useState<ServerQuery>(INITIAL_SERVER_QUERY);
  const [result, setResult] = React.useState<ServerResult>({ nodes: [], totalCount: 0 });
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setIsRefreshing(true);
    void queryServer(query).then((next) => {
      if (cancelled) return;
      setResult(next);
      setIsInitialLoading(false);
      setIsRefreshing(false);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleSortChange = ({
    sortKey,
    isSortReversed,
  }: {
    sortKey?: string;
    isSortReversed: boolean;
  }): void => {
    // The 3rd click of the asc -> desc -> unsorted cycle reports `sortKey` as falsy/`'NONE'`.
    const resolvedSortKey = sortKey && sortKey !== 'NONE' ? sortKey : undefined;
    setQuery((prev) => ({ ...prev, page: 1, sortKey: resolvedSortKey, isSortReversed }));
  };

  const handleGlobalFilterValueChange = (value: string): void => {
    setQuery((prev) => ({ ...prev, page: 1, globalFilterValue: value }));
  };

  const handleColumnFilterValuesChange = (values: Record<string, string | string[]>): void => {
    setQuery((prev) => ({ ...prev, page: 1, columnFilterValues: values }));
  };

  const handlePageChange = ({ page }: { page: number }): void => {
    setQuery((prev) => ({ ...prev, page: page + 1 }));
  };

  const handleClearAll = (): void => {
    setQuery(INITIAL_SERVER_QUERY);
  };

  const data: TableData<TransactionTableItem> = { nodes: result.nodes };
  const isEmpty = !isInitialLoading && result.nodes.length === 0;

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="500px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Full Featured Table</Heading>
        <Text>
          Server-side pagination, sorting, column filters, global search, sticky header/columns, and
          an empty state, composed together - see the story description above for how they actually
          fit together.
        </Text>
      </Box>
      <Table
        data={data}
        isLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        sortFunctions={sortFunctionsForTable}
        onSortChange={handleSortChange}
        filterFunctions={FILTER_PREDICATES}
        globalFilterValue={query.globalFilterValue}
        onGlobalFilterValueChange={handleGlobalFilterValueChange}
        columnFilterValues={query.columnFilterValues}
        onColumnFilterValuesChange={handleColumnFilterValuesChange}
        filterConfig={{
          transactionState: { type: 'multiselect', options: transactionStateOptions },
        }}
        gridTemplateColumns={gridTemplateColumns}
        stickyColumnCount={2}
        stickyColumnWidths={['150px', '220px']}
        isHeaderSticky
        height="420px"
        toolbar={
          <TableToolbar title={`Showing ${result.totalCount} Transactions`}>
            <TableToolbarSearch placeholder="Search company, state, or vessel" />
          </TableToolbar>
        }
        pagination={
          <TablePagination
            paginationType="server"
            totalItemCount={result.totalCount}
            currentPage={query.page - 1}
            onPageChange={handlePageChange}
            showPageSizePicker={false}
            showPageNumberSelector
            showLabel
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {columnDefs.map((column) => (
                  <TableHeaderCell
                    key={column.key}
                    headerKey={
                      column.sortable || FILTER_PREDICATES[column.key] ? column.key : undefined
                    }
                  >
                    {column.header}
                  </TableHeaderCell>
                ))}
              </TableHeaderRow>
            </TableHeader>
            {isEmpty ? (
              <TableBody>
                <TableRow item={EMPTY_ROW_PLACEHOLDER}>
                  <TableCell gridColumnStart={1} gridColumnEnd={columnDefs.length + 1}>
                    <EmptyState
                      size="medium"
                      asset={<ListSearchIcon size="2xlarge" color="surface.icon.gray.muted" />}
                      title="No results found"
                      description={
                        query.globalFilterValue
                          ? `No transactions match "${query.globalFilterValue}".`
                          : 'No transactions match the current filters.'
                      }
                    >
                      <Button variant="secondary" onClick={handleClearAll}>
                        Clear search & filters
                      </Button>
                    </EmptyState>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {tableData.map((item) => (
                  <TableRow key={item.id} item={item}>
                    {columnDefs.map((column) => (
                      <TableCell key={column.key}>{column.render(item)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </>
        )}
      </Table>
    </Box>
  );
};

export default TableMeta;
