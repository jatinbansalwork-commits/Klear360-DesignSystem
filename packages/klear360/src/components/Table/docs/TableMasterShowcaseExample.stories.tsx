import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
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
  TableTitleDescriptionCell,
} from '../../Table';
import type { TableData, TableNode, Identifier } from '../types';
import {
  createTransactionTableNodes,
  formatDate,
  getTransactionStateColor,
  transactionStateOptions,
} from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Link } from '~components/Link';
import { Avatar } from '~components/Avatar';
import { EmptyState } from '~components/EmptyState';
import { EyeIcon, ListSearchIcon } from '~components/Icons';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Master Showcase',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

// ---------------------------------------------------------------------------
// Dummy data - avatar images and compliance notes, matching the exact recipes
// TableAvatarCellExample / TableTitleDescriptionExample already verified in isolation.
// ---------------------------------------------------------------------------

const hashString = (value: string): number =>
  Math.abs(value.split('').reduce((hash, char) => hash * 31 + char.charCodeAt(0), 0));

const AVATAR_PALETTE = ['#2F6FED', '#E8590C', '#2B8A3E', '#9C36B5', '#0C8599', '#C2255C'];

const makeAvatarSrc = (seed: string): string => {
  const color = AVATAR_PALETTE[hashString(seed) % AVATAR_PALETTE.length];
  const initials = seed
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${color}"/><text x="200" y="245" font-family="sans-serif" font-size="150" font-weight="600" fill="white" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const complianceNotes = [
  'Declared HS code did not match the commercial invoice description; broker sign-off required.',
  'Awaiting carrier confirmation of container weight against the booking manifest.',
  'Filed on time.',
  'Duplicate ISF filing detected; the earlier filing was voided automatically.',
  'Consignee address does not match the one on file - confirm before finalizing.',
  'Filed on time.',
];

// ---------------------------------------------------------------------------
// Fake server - same shape as TableFullFeaturedExample's (already verified there): filters, then
// sorts, then paginates a local dataset with an artificial delay, standing in for a real API.
// ---------------------------------------------------------------------------

const PAGE_SIZE = 8;
const SERVER_LATENCY_MS = 400;

const fullDataset = createTransactionTableNodes(48);

const SORT_COMPARATORS: Record<
  string,
  (a: TransactionTableItem, b: TransactionTableItem) => number
> = {
  transactionId: (a, b) => a.transactionId.localeCompare(b.transactionId),
  transactionState: (a, b) => a.transactionState.localeCompare(b.transactionState),
  etd: (a, b) => a.etd.getTime() - b.etd.getTime(),
};

// `Table`'s own `sortFunctions` wants a whole-array sorter per key, not a pairwise comparator -
// derived from SORT_COMPARATORS so the "server" and Table's own re-application can never drift
// apart (see TableFullFeaturedExample for the bug this avoids - passing pairwise comparators
// directly as `sortFunctions` crashes the moment a column is clicked).
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
  page: number;
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

// ---------------------------------------------------------------------------
// Columns - one per cell-content pattern documented elsewhere on this page, cross-referenced in
// the legend below and in each render function's own comment.
// ---------------------------------------------------------------------------

type ColumnDef = {
  key: string;
  header: string;
  width: string;
  sortable?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  render: (item: TransactionTableItem) => React.ReactNode;
};

const columnDefs: ColumnDef[] = [
  {
    // Linkable Cells pattern (TableLinkableCellExample) - a real anchor, not a click handler.
    key: 'transactionId',
    header: 'Transaction ID',
    width: '150px',
    sortable: true,
    render: (item) => (
      <Link variant="anchor" href={`/transactions/${item.id}`}>
        {item.transactionId}
      </Link>
    ),
  },
  {
    // Avatar Cells pattern (TableAvatarCellExample) - Avatar already constrains its own <img>
    // correctly, no hand-rolled sizing needed.
    key: 'filedBy',
    header: 'Filed By',
    width: '190px',
    render: (item) => (
      <Box display="flex" alignItems="center" gap="spacing.3">
        <Avatar size="small" name={item.username} src={makeAvatarSrc(item.username)} />
        <Text size="small">{item.username}</Text>
      </Box>
    ),
  },
  {
    // Title + Description Cells pattern (TableTitleDescriptionExample) - clamps to 2 lines with a
    // tooltip for the full note, only when it's actually truncated.
    key: 'companyName',
    header: 'Company / Compliance Note',
    width: '300px',
    render: (item) => (
      <TableTitleDescriptionCell
        title={item.companyName}
        description={complianceNotes[fullDataset.indexOf(item) % complianceNotes.length]}
      />
    ),
  },
  {
    // Badge sizing guidance (Badge/Table decisions docs) - size="medium" matches the 12px body
    // text elsewhere in the row; size="small"/"xsmall" would read smaller than it, backwards.
    key: 'transactionState',
    header: 'Status',
    width: '150px',
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
    width: '120px',
    sortable: true,
    render: (item) => formatDate(item.etd),
  },
  {
    // Filterable-for-global-search-only, no headerKey - participates in the search box above but
    // gets no column filter input of its own (see Header Filter Row example / decisions doc).
    key: 'vesselName',
    header: 'Vessel Name',
    width: '200px',
    render: (item) => item.vesselName,
  },
  {
    // Action Column pattern (TableActionColumnExample) - textAlign centers it, isHighlighted gives
    // the IconButton a real 24x24px+ hit box instead of collapsing to the bare icon glyph.
    key: 'actions',
    header: 'Actions',
    width: '72px',
    textAlign: 'center',
    render: (item) => (
      <IconButton
        isHighlighted
        icon={EyeIcon}
        size="small"
        accessibilityLabel={`View ${item.transactionId}`}
        onClick={() => action('viewTransaction')(item.transactionId)}
      />
    ),
  },
];

const gridTemplateColumns = columnDefs.map((column) => column.width).join(' ');

const EMPTY_ROW_PLACEHOLDER = { id: '__empty__' } as TableNode<TransactionTableItem>;

const LEGEND: { label: string; detail: string }[] = [
  { label: 'Transaction ID', detail: 'Linkable Cells - a real anchor, cmd/ctrl-click works.' },
  { label: 'Filed By', detail: 'Avatar Cells - a large source image correctly constrained.' },
  {
    label: 'Company / Compliance Note',
    detail: 'Title + Description Cells - 2-line clamp with a hover tooltip when truncated.',
  },
  { label: 'Status', detail: 'Badge size="medium" - matches body text, not undersized.' },
  { label: 'Vessel Name', detail: 'Global-search-only column (no headerKey, no filter box).' },
  { label: 'Actions', detail: 'Action Column - centered, isHighlighted for a real hit box.' },
  { label: 'Sorting/Filter/Search/Pagination', detail: 'Server-driven, see Full Featured.' },
  { label: 'Selection', detail: 'Persists across pages, see Selection Across Pages.' },
  { label: 'Sticky columns', detail: 'Transaction ID + Filed By frozen, plus the checkbox.' },
  { label: 'Empty state', detail: 'Search for something with no matches to see it.' },
];

/**
 * Every other Table example demonstrates one pattern at a time - this page combines as many of
 * them as can genuinely compose into one working table: linkable cells, avatar cells, a
 * title+description cell, correctly-sized badges, a touch-target-safe action column, server-side
 * pagination/sorting/filtering/search, cross-page-persistent selection, sticky columns, and an
 * empty state - all at `rowDensity="compact"`, so the padding/sizing fixes documented elsewhere
 * hold up under the densest, most combination-prone case rather than just in isolation.
 *
 * Deliberately **not** included: grouping, row expansion, nesting, spanning, and virtualization -
 * each of those is a structurally different shape of table (tree data, fixed-height virtualized
 * rows) that doesn't meaningfully combine with flat server-side pagination the way everything
 * above does. See their own dedicated examples instead.
 *
 * The legend below maps each column/feature to the story that covers it in full depth - this page
 * is the "how do these fit together" answer, not a replacement for those.
 */
export const MasterShowcase = (): React.ReactElement => {
  const [query, setQuery] = React.useState<ServerQuery>(INITIAL_SERVER_QUERY);
  const [result, setResult] = React.useState<ServerResult>({ nodes: [], totalCount: 0 });
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Identifier[]>([]);

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
      minHeight="600px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Master Showcase</Heading>
        <Text>
          Every cell-content pattern and every table-level feature this doc set covers, combined
          into one table - see the legend below for what each part demonstrates and where to read
          more.
        </Text>
      </Box>

      <Box
        paddingBottom="spacing.5"
        display="grid"
        style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
        gap="spacing.2"
      >
        {LEGEND.map((entry) => (
          <Box key={entry.label} display="flex" gap="spacing.2">
            <Text size="small" weight="semibold">
              {entry.label}:
            </Text>
            <Text size="small" color="surface.text.gray.muted">
              {entry.detail}
            </Text>
          </Box>
        ))}
      </Box>

      <Table
        data={data}
        isLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        rowDensity="compact"
        selectionType="multiple"
        onSelectionChange={({ selectedIds: nextSelectedIds }) => setSelectedIds(nextSelectedIds)}
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
        stickyColumnWidths={['150px', '190px']}
        isHeaderSticky
        height="480px"
        toolbar={
          <TableToolbar
            title={`${result.totalCount} Transactions - ${selectedIds.length} selected`}
          >
            <TableToolbarSearch placeholder="Search company, status, or vessel" />
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
                    textAlign={column.textAlign}
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
                      <TableCell key={column.key} textAlign={column.textAlign}>
                        {column.render(item)}
                      </TableCell>
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
