import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableRow, TableCell, TableVirtualizedWrapper, TableBody } from '../../TableBody';
import { TableToolbarActions, TableToolbar } from '../../TableToolbar';
import { createTransactionTableData, formatDate, getTransactionStateColor } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';

export default {
  title: 'Components/Table/API/VirtualizedTable',
  tags: ['autodocs'],
  component: TableVirtualizedWrapper,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableVirtulized props here"
          componentName="TableVirtulized"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableVirtualizedWrapper>;

const data = createTransactionTableData(5000);

const TableTemplate: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="700px">
      <TableComponent
        data={data}
        height="500px"
        rowDensity="comfortable"
        selectionType="multiple"
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button size="small" variant="secondary" marginRight="spacing.3">
                Export
              </Button>
              <Button size="small">Payout</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
        {() => (
          <TableVirtualizedWrapper>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Vessel Name</TableHeaderCell>
                <TableHeaderCell>Transaction State</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {(tableItem: Item, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{tableItem.username}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableCell>{tableItem.vesselName}</TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={getTransactionStateColor(tableItem.transactionState)}
                    >
                      {tableItem.transactionState}
                    </Badge>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableVirtualizedWrapper>
        )}
      </TableComponent>
    </Box>
  );
};

export const VirtualizedTable = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
VirtualizedTable.storyName = 'VirtualizedTable';
