import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableNodes, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { SearchInput } from '~components/Input/SearchInput';
import { EmptyState } from '~components/EmptyState';
import { InboxIcon, ListSearchIcon } from '~components/Icons';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Empty States',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

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
  {
    key: 'vesselName',
    header: 'Vessel Name',
    render: (item) => item.vesselName,
    width: '220px',
  },
];

/**
 * Table has no `emptyState` prop - when `data.nodes` is `[]`, the `columns`/`children` API still
 * renders `TableHeader` (and toolbar, if any) with zero rows underneath, which reads as a broken
 * or still-loading table rather than an intentional "nothing here" state.
 *
 * The recommended pattern is a thin consumer-side wrapper: check `data.nodes.length` *before*
 * deciding whether to render `Table` at all, and render `EmptyState` in its place when there's
 * nothing to show. This story simulates a freshly-created workspace with zero transactions - use
 * the button to load sample data and see the same spot render `Table` instead.
 *
 * Why a wrapper and not a built-in `Table` prop (e.g. `emptyState`)? A generic prop would only
 * know the array is empty, not *why* - "no data at all" (this story) needs very different
 * illustration/copy/actions (e.g. "Import your first transactions") than "no results after
 * filtering" (see the other story on this page, e.g. "Clear search"). Only the consumer, who owns
 * that context, can pick the right copy and CTA - `Table` funneling `asset`/`title`/
 * `description`/`children` through as pass-through props would just be indirection around
 * `EmptyState`'s own API for no real gain. The one place a built-in slot could still pull its
 * weight is as a lightweight safety net for exactly this "zero rows total" case (e.g. an optional
 * `emptyState?: React.ReactNode` `Table` renders instead of the header/body when
 * `data.nodes.length === 0`), so a team can't accidentally ship the bare-header state by
 * forgetting the wrapper - deliberately left out of scope here since the wrapper alone already
 * handles it with no loss of flexibility.
 */
export const NoDataAtAll = (): React.ReactElement => {
  const [hasData, setHasData] = React.useState(false);
  const sampleNodes = React.useMemo(() => createTransactionTableNodes(8), []);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.4"
      >
        <Box>
          <Heading>No Data At All</Heading>
          <Text>
            A freshly-created workspace with zero transactions - `data.nodes` is `[]` from the
            start, so `EmptyState` is rendered instead of `Table`.
          </Text>
        </Box>
        <Button size="small" onClick={() => setHasData((prev) => !prev)}>
          {hasData ? 'Clear data' : 'Load sample data'}
        </Button>
      </Box>

      {hasData ? (
        <Table data={{ nodes: sampleNodes }} columns={columns} />
      ) : (
        <Box
          backgroundColor="surface.background.gray.intense"
          borderRadius="medium"
          padding="spacing.10"
        >
          <EmptyState
            size="large"
            asset={<InboxIcon size="2xlarge" color="surface.icon.gray.muted" />}
            title="No transactions yet"
            description="Transactions you file will show up here. Import your first batch to get started."
          >
            <Button onClick={() => setHasData(true)}>Import Transactions</Button>
          </EmptyState>
        </Box>
      )}
    </Box>
  );
};

/**
 * "No data at all" and "no results after filtering" look similar (an empty area where rows would
 * be) but call for different handling, so they get their own story rather than being folded into
 * one. Here `data.nodes` has real rows - the search box is entirely consumer state, filtering the
 * array with a plain `.filter()` *before* it ever reaches `Table`'s `data` prop. `Table`'s own
 * `filterFunctions`/`globalFilterValue` pipeline is intentionally not used, since that would still
 * leave the "zero results" check and the `EmptyState` swap to the same kind of wrapper shown here
 * - doing the filtering in the wrapper directly keeps the whole pattern in one place.
 *
 * Starts pre-filtered to a query with no matches so the empty state is visible without
 * interacting - clear the search (via the input's own clear button, or the EmptyState's "Clear
 * search" action) to see the real rows.
 */
export const NoResultsAfterFiltering = (): React.ReactElement => {
  const allNodes = React.useMemo(() => createTransactionTableNodes(12), []);
  const [searchQuery, setSearchQuery] = React.useState('Acme Global Traders');

  const filteredNodes = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allNodes;
    return allNodes.filter(
      (node) =>
        node.companyName.toLowerCase().includes(query) ||
        node.transactionId.toLowerCase().includes(query) ||
        node.vesselName.toLowerCase().includes(query),
    );
  }, [allNodes, searchQuery]);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>No Results After Filtering</Heading>
        <Text>
          `data.nodes` has rows, but the consumer's own search filters them all out - `Table` is
          swapped for `EmptyState` the same way as the "no data" case, just driven by the filtered
          array's length instead of the raw dataset's.
        </Text>
      </Box>

      <Box maxWidth="360px" marginBottom="spacing.4">
        <SearchInput
          label=""
          value={searchQuery}
          placeholder="Search company, transaction ID, or vessel"
          onChange={({ value }) => setSearchQuery(value ?? '')}
          onClearButtonClick={() => setSearchQuery('')}
        />
      </Box>

      {filteredNodes.length === 0 ? (
        <Box
          backgroundColor="surface.background.gray.intense"
          borderRadius="medium"
          padding="spacing.10"
        >
          <EmptyState
            size="large"
            asset={<ListSearchIcon size="2xlarge" color="surface.icon.gray.muted" />}
            title="No results found"
            description={`No transactions match "${searchQuery}". Try a different search term.`}
          >
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </EmptyState>
        </Box>
      ) : (
        <Table data={{ nodes: filteredNodes }} columns={columns} />
      )}
    </Box>
  );
};

export default TableMeta;
