import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  Table,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarActions,
  TablePagination,
} from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { EyeIcon, EditIcon, FileTextIcon } from '~components/Icons';
import { useTheme } from '~components/Klear360Provider';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Sticky Columns',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

// 50 rows (rather than a token 20) so the pagination below actually has multiple pages to page
// through - a one-page table wouldn't demonstrate anything.
const stickyColumnsExampleData = createTransactionTableData(50);

// The 3 leading columns (Actions, Transaction ID, Company Name) are frozen while the rest of the
// wide table scrolls horizontally underneath them - each needs an explicit `width` matching the
// `stickyColumnWidths` passed to `Table` below, so the sticky offsets line up with what renders.
const columns: TableColumnConfig<TransactionTableItem>[] = [
  {
    key: 'actions',
    header: 'Actions',
    render: (item) => (
      <Box display="flex" gap="spacing.3">
        <IconButton
          isHighlighted
          icon={EyeIcon}
          accessibilityLabel={`View ${item.transactionId}`}
        />
        <IconButton
          isHighlighted
          icon={EditIcon}
          accessibilityLabel={`Edit ${item.transactionId}`}
        />
        <IconButton
          isHighlighted
          icon={FileTextIcon}
          accessibilityLabel={`View documents for ${item.transactionId}`}
        />
      </Box>
    ),
    width: '140px',
  },
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
    width: '150px',
    sortable: true,
  },
  {
    key: 'companyName',
    header: 'Company Name',
    render: (item) => item.companyName,
    width: '220px',
    sortable: true,
  },
  {
    key: 'cbpTransactionNumber',
    header: 'CBP Transaction Number',
    render: (item) => item.cbpTransactionNumber,
    width: '200px',
  },
  {
    key: 'username',
    header: 'Username',
    render: (item) => item.username,
    width: '160px',
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
    sortable: true,
  },
  {
    key: 'etd',
    header: 'ETD',
    render: (item) => formatDate(item.etd),
    width: '130px',
    sortable: true,
  },
  {
    key: 'vesselName',
    header: 'Vessel Name',
    render: (item) => item.vesselName,
    width: '220px',
    sortable: true,
  },
  {
    key: 'filingDate',
    header: 'Filing Date',
    render: (item) => formatDate(item.filingDate),
    width: '130px',
  },
  {
    key: 'shipmentNumber',
    header: 'Shipment #',
    render: (item) => item.shipmentNumber,
    width: '140px',
  },
  {
    key: 'mbl',
    header: 'MBL',
    render: (item) => item.mbl,
    width: '160px',
  },
  {
    key: 'hbl',
    header: 'HBL',
    render: (item) => item.hbl,
    width: '160px',
  },
  {
    key: 'countryOfExport',
    header: 'Country of Export',
    render: (item) => item.countryOfExport,
    width: '180px',
  },
];

// Same predicates power both the global search below and (if you add per-column headerKey
// filter inputs) column filtering - see the Filtering API page for that half of the pattern.
const filterFunctions = {
  companyName: (item: TransactionTableItem, value: string) =>
    item.companyName.toLowerCase().includes(value.toLowerCase()),
  vesselName: (item: TransactionTableItem, value: string) =>
    item.vesselName.toLowerCase().includes(value.toLowerCase()),
  transactionState: (item: TransactionTableItem, value: string) =>
    item.transactionState.toLowerCase().includes(value.toLowerCase()),
};

const sortFunctions = {
  transactionId: (array: TransactionTableItem[]) =>
    array.sort((a, b) => a.transactionId.localeCompare(b.transactionId)),
  companyName: (array: TransactionTableItem[]) =>
    array.sort((a, b) => a.companyName.localeCompare(b.companyName)),
  transactionState: (array: TransactionTableItem[]) =>
    array.sort((a, b) => a.transactionState.localeCompare(b.transactionState)),
  etd: (array: TransactionTableItem[]) => array.sort((a, b) => a.etd.getTime() - b.etd.getTime()),
  vesselName: (array: TransactionTableItem[]) =>
    array.sort((a, b) => a.vesselName.localeCompare(b.vesselName)),
};

/**
 * This is the design system's flagship, "kitchen sink" Table example - sticky columns, sorting,
 * global + per-column search, row selection with bulk toolbar actions, and pagination, all
 * together on one realistic dataset - so a developer evaluating Table can see how these features
 * compose in one place instead of hunting across separate single-feature demos.
 */
export const StickyColumns = (): React.ReactElement => {
  const [selectedCount, setSelectedCount] = React.useState(0);
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Sticky Columns</Heading>
        <Text>
          Freeze the leading `Actions`, `Transaction ID`, and `Company Name` columns via
          `stickyColumnCount` and `stickyColumnWidths` so they stay in view while the remaining
          columns scroll horizontally underneath - combined here with sorting, global and per-column
          search, row selection with bulk toolbar actions, and pagination, since a real table rarely
          uses just one feature at a time. (On mobile, sticky columns are automatically disabled
          instead, so the table stays scrollable.)
        </Text>
      </Box>
      <Table
        data={stickyColumnsExampleData}
        columns={columns}
        stickyColumnCount={3}
        stickyColumnWidths={['140px', '150px', '220px']}
        isHeaderSticky
        sortFunctions={sortFunctions}
        onSortChange={action('onSortChange')}
        filterFunctions={filterFunctions}
        onGlobalFilterValueChange={action('onGlobalFilterValueChange')}
        selectionType="multiple"
        onSelectionChange={({ selectedIds }) => setSelectedCount(selectedIds.length)}
        toolbar={
          <TableToolbar
            title="Showing Transactions"
            selectedTitle={`${selectedCount} Transaction${selectedCount > 1 ? 's' : ''} Selected`}
          >
            <TableToolbarActions>
              <Button
                size="small"
                variant="secondary"
                marginRight="spacing.3"
                isFullWidth={onMobile}
              >
                Export
              </Button>
              <Button size="small" isFullWidth={onMobile}>
                Mark as Reviewed
              </Button>
            </TableToolbarActions>
            <TableToolbarSearch placeholder="Search company, vessel, or state" />
          </TableToolbar>
        }
        pagination={
          <TablePagination
            defaultPageSize={10}
            pageSizeOptions={[10, 20, 50]}
            showPageSizePicker
            showPageNumberSelector
            onPageChange={action('onPageChange')}
            onPageSizeChange={action('onPageSizeChange')}
            showLabel
          />
        }
      />
    </Box>
  );
};

// Same columns as `StickyColumns`, but with `actions` moved to the end - pinning an Actions
// column to the trailing edge (rather than leading) is the more common real-world pattern for
// this feature, so it gets its own dedicated example.
const trailingActionsColumns: TableColumnConfig<TransactionTableItem>[] = [
  ...columns.filter((column) => column.key !== 'actions'),
  columns.find((column) => column.key === 'actions')!,
];

/**
 * Demonstrates `trailingStickyColumnCount`/`trailingStickyColumnWidths` - freezing the trailing
 * `Actions` column to the right edge while combined with the existing leading sticky columns
 * (`Transaction ID`, `Company Name`), so both edges stay pinned while everything else scrolls
 * underneath.
 */
export const TrailingStickyColumns = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Trailing Sticky Columns</Heading>
        <Text>
          Freeze `Transaction ID` and `Company Name` on the left (`stickyColumnCount` /
          `stickyColumnWidths`) and `Actions` on the right (`trailingStickyColumnCount` /
          `trailingStickyColumnWidths`) at the same time, so the columns that matter most stay in
          view no matter how wide the table scrolls. (Disabled on mobile, same as leading sticky
          columns.)
        </Text>
      </Box>
      <Table
        data={stickyColumnsExampleData}
        columns={trailingActionsColumns}
        stickyColumnCount={2}
        stickyColumnWidths={['150px', '220px']}
        trailingStickyColumnCount={1}
        trailingStickyColumnWidths={['140px']}
        isHeaderSticky
        sortFunctions={sortFunctions}
        onSortChange={action('onSortChange')}
      />
    </Box>
  );
};

export default TableMeta;
