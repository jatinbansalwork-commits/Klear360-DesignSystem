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
import { createTransactionTableData, transactionStateOptions } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { EmptyState } from '~components/EmptyState';
import { Button } from '~components/Button';
import { ListSearchIcon } from '~components/Icons';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Fixed Height',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const filterFunctions = {
  COMPANY_NAME: (item: TransactionTableItem, value: string | string[]) =>
    typeof value === 'string' && item.companyName.toLowerCase().includes(value.toLowerCase()),
  TRANSACTION_STATE: (item: TransactionTableItem, value: string | string[]) =>
    Array.isArray(value) ? value.length === 0 || value.includes(item.transactionState) : true,
};

const FixedHeightTable = ({
  rowCount,
  title,
}: {
  rowCount: number;
  title: string;
}): React.ReactElement => {
  const data = React.useMemo(() => createTransactionTableData(rowCount), [rowCount]);
  return (
    <Box display="flex" flexDirection="column" gap="spacing.3">
      <Heading size="small">{title}</Heading>
      <Table
        data={data}
        height="400px"
        isHeaderSticky
        filterFunctions={filterFunctions}
        filterConfig={{
          TRANSACTION_STATE: { type: 'multiselect', options: transactionStateOptions },
        }}
        emptyState={
          <EmptyState
            size="small"
            asset={<ListSearchIcon size="xlarge" color="surface.icon.gray.muted" />}
            title="No transactions found"
            description="Try a different search, or clear the filters."
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell headerKey="TRANSACTION_STATE">Transaction State</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>
                    <Code size="medium">{item.transactionId}</Code>
                  </TableCell>
                  <TableCell>{item.companyName}</TableCell>
                  <TableCell>{item.transactionState}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

/**
 * A fixed-`height` Table keeps every header row (label row, grouped rows, filter row) and body
 * row at its natural height no matter how many rows there are - leftover height stays empty
 * table surface below the last row. With no rows, `emptyState` fills the remaining body space
 * and is centered in it, while the header and filter row stay visible and usable.
 */
export const RowCounts = (): React.ReactElement => (
  <Box
    backgroundColor="surface.background.gray.intense"
    padding="spacing.5"
    display="flex"
    flexDirection="column"
    gap="spacing.7"
  >
    <Text>
      Each table below is <Code size="medium">height=&quot;400px&quot;</Code> with a sticky header
      and filter row. The header and filter rows are the same height in all three.
    </Text>
    <FixedHeightTable rowCount={0} title="0 rows (emptyState)" />
    <FixedHeightTable rowCount={1} title="1 row" />
    <FixedHeightTable rowCount={3} title="3 rows" />
  </Box>
);

/**
 * Filter down to nothing (e.g. type "zzz" into Company Name): the header and filter row keep
 * their size and position, and `emptyState` replaces the rows - so the filter that caused the
 * empty result is still right there to clear.
 */
export const FilterToEmpty = (): React.ReactElement => (
  <Box backgroundColor="surface.background.gray.intense" padding="spacing.5">
    <FixedHeightTable rowCount={20} title="Type “zzz” into Company Name" />
    <Box paddingTop="spacing.4">
      <Button variant="tertiary" size="small" onClick={() => window.location.reload()}>
        Reset story
      </Button>
    </Box>
  </Box>
);

export default TableMeta;
