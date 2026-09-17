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
} from '../../Table';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Sorting',
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

const sortFunctions = {
  TRANSACTION_ID: (array) =>
    [...array].sort((a, b) => a.transactionId.localeCompare(b.transactionId)),
  COMPANY_NAME: (array) => [...array].sort((a, b) => a.companyName.localeCompare(b.companyName)),
  ETD: (array) => [...array].sort((a, b) => a.etd.getTime() - b.etd.getTime()),
  TRANSACTION_STATE: (array) =>
    [...array].sort((a, b) => a.transactionState.localeCompare(b.transactionState)),
};

const multiColumnSortData = createTransactionTableData(15);

export const MultiColumnSort = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Multi Column Sort</Heading>
        <Text>
          Click a sortable column to sort by just that column - ascending, then descending, then
          back to unsorted. Shift-click another sortable column to add it as a secondary (then
          tertiary) sort key instead of replacing the current sort - a small number badge shows each
          column&apos;s priority once more than one is active.
        </Text>
      </Box>
      <Table data={multiColumnSortData} sortFunctions={sortFunctions}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="TRANSACTION_ID">Transaction ID</TableHeaderCell>
                <TableHeaderCell headerKey="TRANSACTION_STATE">Transaction State</TableHeaderCell>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell headerKey="ETD">ETD</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={getTransactionStateColor(tableItem.transactionState)}
                    >
                      {tableItem.transactionState}
                    </Badge>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

const presortData = createTransactionTableData(15);

export const Presort = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Presort</Heading>
        <Text>
          The initialSort prop sorts the table on mount - here by ETD, descending - instead of
          requiring a first click.
        </Text>
      </Box>
      <Table
        data={presortData}
        sortFunctions={sortFunctions}
        initialSort={{ sortKey: 'ETD', direction: 'desc' }}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="TRANSACTION_ID">Transaction ID</TableHeaderCell>
                <TableHeaderCell headerKey="TRANSACTION_STATE">Transaction State</TableHeaderCell>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell headerKey="ETD">ETD</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={getTransactionStateColor(tableItem.transactionState)}
                    >
                      {tableItem.transactionState}
                    </Badge>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

export default TableMeta;
