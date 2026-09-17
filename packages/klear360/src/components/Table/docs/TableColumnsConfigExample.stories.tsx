import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Columns Config',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    chromatic: { disableSnapshot: true },
  },
};

const columnsExampleData = createTransactionTableData(5);

const columns: TableColumnConfig<TransactionTableItem>[] = [
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
    sortable: true,
  },
  {
    key: 'companyName',
    header: 'Company Name',
    render: (item) => item.companyName,
    sortable: true,
  },
  {
    key: 'etd',
    header: 'ETD',
    render: (item) => formatDate(item.etd),
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
          transactionId: (array) =>
            array.sort((a, b) => a.transactionId.localeCompare(b.transactionId)),
          companyName: (array) => array.sort((a, b) => a.companyName.localeCompare(b.companyName)),
        }}
      />
    </Box>
  );
};

export default TableMeta;
