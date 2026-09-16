import type { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import type { TableProps } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableToolbar, TableToolbarSearch } from '../../TableToolbar';
import { createTransactionTableData, getTransactionStateColor } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';

export default {
  title: 'Components/Table/API',
  component: TableComponent,
  argTypes: {
    data: {
      control: {
        disable: true,
      },
    },
    filterFunctions: {
      control: {
        disable: true,
      },
    },
    columnFilterValues: {
      control: {
        disable: true,
      },
    },
    defaultColumnFilterValues: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="A column becomes filterable purely by having its headerKey present in the `filterFunctions` prop - Table then renders a compact search input in that column's header automatically. The same predicate is reused for the global search (via TableToolbarSearch): a row matches the global filter if any filterable column's predicate matches."
          componentName="Table"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<TableProps<unknown>>;

const data = createTransactionTableData(30);

const filterFunctions = {
  COMPANY_NAME: (item, value) => item.companyName.toLowerCase().includes(value.toLowerCase()),
  TRANSACTION_STATE: (item, value) =>
    item.transactionState.toLowerCase().includes(value.toLowerCase()),
  VESSEL_NAME: (item, value) => item.vesselName.toLowerCase().includes(value.toLowerCase()),
};

const FilteringTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent
        height="400px"
        toolbar={
          <TableToolbar>
            <TableToolbarSearch placeholder="Search all columns" />
          </TableToolbar>
        }
        onGlobalFilterValueChange={action('onGlobalFilterValueChange')}
        onColumnFilterValuesChange={action('onColumnFilterValuesChange')}
        {...args}
        data={data}
        filterFunctions={filterFunctions}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell headerKey="TRANSACTION_STATE">Transaction State</TableHeaderCell>
                <TableHeaderCell headerKey="VESSEL_NAME">Vessel Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={getTransactionStateColor(tableItem.transactionState)}
                    >
                      {tableItem.transactionState}
                    </Badge>
                  </TableCell>
                  <TableCell>{tableItem.vesselName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableFiltering = FilteringTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableFiltering.storyName = 'TableFiltering';
