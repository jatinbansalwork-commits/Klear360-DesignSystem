import type { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableToolbar, TableToolbarSearch } from '../../TableToolbar';
import { createTransactionTableData, getTransactionStateColor } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/Table/API/TableToolbarSearch',
  tags: ['autodocs'],
  component: TableToolbarSearch,
  args: {
    placeholder: 'Search',
    accessibilityLabel: 'Search table',
  },
  argTypes: {
    ...getStyledPropsArgTypes(),
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the search input.',
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name for the search input.',
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="TableToolbarSearch renders a search input wired to the Table's global filter state (see `Table`'s `globalFilterValue`/`filterFunctions` props). Place it as a `TableToolbar` child, alongside `TableToolbarActions` if present. A row matches the global filter if any filterable column's predicate - the same predicates used for per-column filtering - matches. You can find a complete list of TableToolbarSearch props here"
          componentName="TableToolbarSearch"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableToolbarSearch>;

const data = createTransactionTableData(20);

const filterFunctions = {
  TRANSACTION_ID: (item, value) => item.transactionId.toLowerCase().includes(value.toLowerCase()),
  COMPANY_NAME: (item, value) => item.companyName.toLowerCase().includes(value.toLowerCase()),
  USERNAME: (item, value) => item.username.toLowerCase().includes(value.toLowerCase()),
  VESSEL_NAME: (item, value) => item.vesselName.toLowerCase().includes(value.toLowerCase()),
  TRANSACTION_STATE: (item, value) =>
    item.transactionState.toLowerCase().includes(value.toLowerCase()),
};

const TableTemplate: StoryFn<typeof TableToolbarSearch> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent
        data={data}
        filterFunctions={filterFunctions}
        onGlobalFilterValueChange={action('onGlobalFilterValueChange')}
        toolbar={
          <TableToolbar>
            <TableToolbarSearch {...args} />
          </TableToolbar>
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="TRANSACTION_ID">Transaction ID</TableHeaderCell>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell headerKey="USERNAME">Username</TableHeaderCell>
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

export const TableToolbarSearchStory = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableToolbarSearchStory.storyName = 'TableToolbarSearch';
