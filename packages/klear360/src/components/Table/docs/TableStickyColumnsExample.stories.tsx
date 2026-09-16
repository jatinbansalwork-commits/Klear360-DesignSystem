import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { IconButton } from '~components/Button/IconButton';
import { EyeIcon, EditIcon, FileTextIcon } from '~components/Icons';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Sticky Columns',
  component: Table,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

const stickyColumnsExampleData = createTransactionTableData(20);

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
  },
  {
    key: 'companyName',
    header: 'Company Name',
    render: (item) => item.companyName,
    width: '220px',
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

export const StickyColumns = (): React.ReactElement => {
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
          columns scroll horizontally underneath.
        </Text>
      </Box>
      <Table
        data={stickyColumnsExampleData}
        columns={columns}
        stickyColumnCount={3}
        stickyColumnWidths={['140px', '150px', '220px']}
        isHeaderSticky
      />
    </Box>
  );
};

export default TableMeta;
