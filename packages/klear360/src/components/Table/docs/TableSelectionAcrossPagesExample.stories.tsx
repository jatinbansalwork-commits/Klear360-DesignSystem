import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Table, TableToolbar, TableToolbarActions, TablePagination } from '../../Table';
import type { TableColumnConfig, TableData, Identifier } from '../types';
import { createTransactionTableNodes, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Selection Across Pages',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const PAGE_SIZE = 8;
const SERVER_LATENCY_MS = 300;

// The full "database" this story's fake server paginates over - 40 rows across 5 pages, enough
// to actually navigate back and forth and see selections survive the trip.
const fullDataset = createTransactionTableNodes(40);

const queryServerPage = (page: number): Promise<TransactionTableItem[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      resolve(fullDataset.slice(start, start + PAGE_SIZE));
    }, SERVER_LATENCY_MS);
  });

const columns: TableColumnConfig<TransactionTableItem>[] = [
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
    width: '160px',
  },
  {
    key: 'companyName',
    header: 'Company Name',
    render: (item) => item.companyName,
    width: '240px',
  },
  {
    key: 'transactionState',
    header: 'Transaction State',
    render: (item) => (
      <Badge size="medium" color={getTransactionStateColor(item.transactionState)}>
        {item.transactionState}
      </Badge>
    ),
    width: '150px',
  },
  {
    key: 'etd',
    header: 'ETD',
    render: (item) => formatDate(item.etd),
    width: '130px',
  },
];

/**
 * Selecting rows with `selectionType="multiple"` composes with server-side pagination less for
 * free than it looks like it should - the two things that actually need attention:
 *
 * 1. **Read `selectedIds` from `onSelectionChange`, not the deprecated `values`.** `values` is
 *    `data.nodes.filter(node => selectedIds.includes(node.id))` internally - with server-side
 *    pagination `data.nodes` is only the current page, so `values` silently drops every selected
 *    row that isn't on the page you're currently looking at. `selectedIds` has no such problem -
 *    it's just the id list, independent of what happens to be loaded right now.
 * 2. **Table's own selection state already persists across a page change for you.** `selectedRows`
 *    lives in `Table`'s own state, seeded once from `defaultSelectedIds` - it's never reset just
 *    because the `data` prop swaps to a new page. You don't need to feed anything back in; capture
 *    `selectedIds` via `onSelectionChange` only for whatever *you* need outside the table (a bulk
 *    action button, the "selected across all pages" list below) - the header "select all"
 *    checkbox, the row checkboxes, and the toolbar's own "N Items Selected"/"Deselect" (both
 *    built in whenever `TableToolbar` has no `title`/`selectedTitle` override, see below) all keep
 *    working correctly on their own.
 *
 * That "on their own" used to have a real bug: the header "select all" checkbox decided
 * select-vs-deselect by checking "is anything selected *anywhere*", and its "deselect" branch
 * called `onRemoveAll()` - which clears *every* selected id, on *every* page. Selecting 2 rows on
 * page 1, then clicking "select all" on page 2 to select that page's 8 rows, instead wiped out
 * the 2 from page 1 and left page 2 untouched. Fixed so both the checkbox's checked/indeterminate
 * state and what clicking it does are scoped to *this page's* rows specifically - selecting page
 * 2 now adds to page 1's selection instead of erasing it, and the checkbox on page 1 still shows
 * correctly checked when you go back.
 *
 * Try: select a couple of rows on page 1, go to page 2 and click the header checkbox to select it
 * entirely, then go back to page 1 - your original 2 are still checked, and the toolbar's count
 * (and the list below) reflects all of them together.
 */
export const SelectionAcrossPages = (): React.ReactElement => {
  const [page, setPage] = React.useState(1);
  const [pageNodes, setPageNodes] = React.useState<TransactionTableItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState<Identifier[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    void queryServerPage(page).then((nodes) => {
      if (cancelled) return;
      setPageNodes(nodes);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const data: TableData<TransactionTableItem> = { nodes: pageNodes };

  const selectedCompanyNames = fullDataset
    .filter((item) => selectedIds.includes(item.id))
    .map((item) => item.companyName);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Selection Across Pages</Heading>
        <Text>
          Select rows, change pages, select more - the count and the list below both track
          everything selected across every page, not just the one currently loaded.
        </Text>
      </Box>
      <Table
        data={data}
        isLoading={isLoading}
        columns={columns}
        selectionType="multiple"
        onSelectionChange={({ selectedIds: nextSelectedIds }) => {
          setSelectedIds(nextSelectedIds);
          action('onSelectionChange')(nextSelectedIds);
        }}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button
                size="small"
                variant="secondary"
                isDisabled={selectedIds.length === 0}
                onClick={() => action('exportSelected')(selectedIds)}
              >
                Export Selected ({selectedIds.length})
              </Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            paginationType="server"
            totalItemCount={fullDataset.length}
            currentPage={page - 1}
            onPageChange={({ page: nextPage }) => setPage(nextPage + 1)}
            showPageSizePicker={false}
            showPageNumberSelector
            showLabel
          />
        }
      />
      <Box paddingTop="spacing.4">
        <Text size="small" color="surface.text.gray.muted">
          {selectedIds.length === 0
            ? 'Nothing selected yet - select a row, change pages, and select another.'
            : `Selected across all pages (${selectedIds.length}): ${selectedCompanyNames.join(
                ', ',
              )}`}
        </Text>
      </Box>
    </Box>
  );
};

export default TableMeta;
