import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Table } from '../../Table';
import type { TableColumnConfig, TableNode } from '../types';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Linkable Cells',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const linkableCellsExampleData = createTransactionTableData(8);

type LinkColumnConfig<Item> = {
  key: string;
  header: React.ReactNode;
  getLabel: (item: TableNode<Item>) => string;
  width?: string;
  sortable?: boolean;
  /**
   * Renders as `Link`'s `'anchor'` variant - a real `href`, so cmd/ctrl-click, middle-click, and
   * "open in new tab" all work exactly as a user expects a link to. Use this whenever the target
   * genuinely has its own URL.
   */
  getHref?: (item: TableNode<Item>) => string;
  /**
   * Renders as `Link`'s `'button'` variant - no `href`, just an `onClick` - for navigation that
   * has no real per-row URL to point at (e.g. it goes through a router's imperative `navigate()`,
   * or needs to run other logic - fetching data, confirming unsaved changes - before moving).
   * Provide exactly one of `getHref`/`onNavigate`, not both.
   */
  onNavigate?: (item: TableNode<Item>) => void;
};

/**
 * Builds a `TableColumnConfig` whose cell content is a `Link` instead of plain text - the
 * reusable building block every linkable column in this story is made from, instead of each
 * column hand-writing its own `<Link variant=... href=... onClick=...>{label}</Link>` in `render`
 * (easy to get subtly inconsistent column to column - a missed `variant`, a different `color` -
 * once there's more than one). Any column that needs its text to navigate somewhere becomes one
 * call to this function; the anchor-vs-button choice above is the only decision left to make per
 * column.
 */
const makeLinkColumn = <Item,>({
  key,
  header,
  getLabel,
  width,
  sortable,
  getHref,
  onNavigate,
}: LinkColumnConfig<Item>): TableColumnConfig<Item> => ({
  key,
  header,
  width,
  sortable,
  render: (item) =>
    getHref ? (
      <Link variant="anchor" href={getHref(item)}>
        {getLabel(item)}
      </Link>
    ) : (
      <Link variant="button" onClick={() => onNavigate?.(item)}>
        {getLabel(item)}
      </Link>
    ),
});

/**
 * `Transaction ID` links to a real per-transaction URL (`getHref`) - a genuine anchor, so
 * right-click/cmd-click/middle-click all behave like any other link on the page. `Company Name`
 * instead calls `onNavigate` (here just logged via Storybook's `action`, in a real app this would
 * be a router's `navigate()`) since a company doesn't have its own page in this table's context,
 * just an in-app action - it renders as `Link`'s button variant, with no `href` at all.
 *
 * Both columns are built through the same `makeLinkColumn` helper above - the actual `<Link>`
 * wiring (variant selection, `href` vs `onClick`) is written once, not once per column.
 *
 * Two things worth knowing before reaching for this pattern:
 * - `Link`'s `children` must be a plain string, not arbitrary content - it's meant for linkable
 *   text, not for wrapping something like `Code` or a `Badge`. A cell that needs both a link and a
 *   non-text treatment (say, a monospace ID *and* a link) should render them side by side instead
 *   of nesting one inside the other.
 * - Every `TableCell` is already `tabIndex={0}` regardless of its content, so a linked cell has
 *   two keyboard tab stops - the cell wrapper, then the link/button itself. That's not unique to
 *   this pattern (any interactive cell content, e.g. the icon-button action columns in the other
 *   Table examples, has the same double stop) - just something to expect, not something this
 *   pattern introduces.
 */
export const LinkableCells = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    makeLinkColumn<TransactionTableItem>({
      key: 'transactionId',
      header: 'Transaction ID',
      getLabel: (item) => item.transactionId,
      getHref: (item) => `/transactions/${item.id}`,
      width: '160px',
      sortable: true,
    }),
    makeLinkColumn<TransactionTableItem>({
      key: 'companyName',
      header: 'Company Name',
      getLabel: (item) => item.companyName,
      onNavigate: (item) => action('onNavigate:companyName')(item.companyName),
      width: '240px',
      sortable: true,
    }),
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

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Linkable Cells</Heading>
        <Text>
          `Transaction ID` is a real anchor (`getHref`); `Company Name` is a button-style in-app
          navigation (`onNavigate`) - both built through the same `makeLinkColumn` helper rather
          than one-off `Link` JSX per column.
        </Text>
      </Box>
      <Table data={linkableCellsExampleData} columns={columns} />
    </Box>
  );
};

export default TableMeta;
