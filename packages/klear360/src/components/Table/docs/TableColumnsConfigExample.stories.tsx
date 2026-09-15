import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import type { TableExampleItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Columns Config',
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

const columnsExampleData = createTableData(5);

const columns: TableColumnConfig<TableExampleItem>[] = [
  {
    key: 'paymentId',
    header: 'ID',
    render: (item) => <Code size="medium">{item.paymentId}</Code>,
    sortable: true,
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (item) => <Amount value={item.amount} />,
    sortable: true,
  },
  {
    key: 'date',
    header: 'Date',
    render: (item) => formatDate(item.date),
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => (
      <Badge size="medium" color={getStatusColor(item.status)}>
        {item.status}
      </Badge>
    ),
    width: '150px',
  },
];

export const TableDrivenByColumnsConfig = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table Driven by Columns Config</Heading>
        <Text>
          Instead of hand-writing TableHeader/TableBody JSX, pass a columns array and Table builds
          the header row and body cells for you.
        </Text>
      </Box>
      <Table
        data={columnsExampleData}
        columns={columns}
        sortFunctions={{
          paymentId: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
          amount: (array) => array.sort((a, b) => a.amount - b.amount),
        }}
      />
    </Box>
  );
};

export default TableMeta;
