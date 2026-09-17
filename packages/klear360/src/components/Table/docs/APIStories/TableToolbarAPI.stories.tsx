import type { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TablePagination } from '../../TablePagination';
import { TableToolbarActions, TableToolbar, TableToolbarSearch } from '../../TableToolbar';
import { createTransactionTableData, formatDate, getTransactionStateColor } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { useTheme } from '~components/Klear360Provider';

export default {
  title: 'Components/Table/API/TableToolbar',
  tags: ['autodocs'],
  component: TableToolbar,
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableToolbar props here"
          componentName="TableToolbar"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableToolbar>;

const data = createTransactionTableData(20);

const TableTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent
        data={data}
        selectionType="multiple"
        onSelectionChange={({ values }) => action('onSelectionChange')(values)}
        sortFunctions={{
          TRANSACTION_ID: (array) =>
            array.sort((a, b) => a.transactionId.localeCompare(b.transactionId)),
          COMPANY_NAME: (array) => array.sort((a, b) => a.companyName.localeCompare(b.companyName)),
          USERNAME: (array) => array.sort((a, b) => a.username.localeCompare(b.username)),
          ETD: (array) => array.sort((a, b) => a.etd.getTime() - b.etd.getTime()),
          VESSEL_NAME: (array) => array.sort((a, b) => a.vesselName.localeCompare(b.vesselName)),
          TRANSACTION_STATE: (array) =>
            array.sort((a, b) => a.transactionState.localeCompare(b.transactionState)),
        }}
        onSortChange={({ sortKey, isSortReversed }) =>
          action('onSortChange')({ sortKey, isSortReversed })
        }
        filterFunctions={{
          VESSEL_NAME: (item, value) => item.vesselName.toLowerCase().includes(value.toLowerCase()),
          TRANSACTION_STATE: (item, value) =>
            item.transactionState.toLowerCase().includes(value.toLowerCase()),
        }}
        toolbar={
          <TableToolbar {...args}>
            <TableToolbarSearch placeholder="Search all columns" />
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
                Payout
              </Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            onPageChange={action('onPageChange')}
            defaultPageSize={10}
            onPageSizeChange={action('onPageSizeChange')}
            showPageSizePicker
            showPageNumberSelector
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="TRANSACTION_ID">Transaction ID</TableHeaderCell>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell headerKey="USERNAME">Username</TableHeaderCell>
                <TableHeaderCell headerKey="ETD">ETD</TableHeaderCell>
                <TableHeaderCell headerKey="VESSEL_NAME">Vessel Name</TableHeaderCell>
                <TableHeaderCell headerKey="TRANSACTION_STATE">Transaction State</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
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
              ))}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableToolbarStory = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableToolbarStory.storyName = 'TableToolbar';
