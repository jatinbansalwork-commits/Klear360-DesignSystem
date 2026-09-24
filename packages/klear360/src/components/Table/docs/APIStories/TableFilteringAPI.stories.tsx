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
  title: 'Components/Table/API/Table Filtering',
  tags: ['autodocs'],
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

// A predicate whose column may be `filterConfig`'d receives a plain `string` from both a
// dropdown-type column's own filter AND from global search, or a `string[]` from a
// multiselect-type column's own filter (never from global search, which is always plain text) -
// so it must handle both shapes. Falling back to a normal substring match for the string case
// (rather than e.g. unconditionally returning `true`) keeps the column correctly excluded from
// global search matches once the value is a `string[]` that doesn't actually apply here.
const matchesStringOrArray = (itemValue: string, filterValue: string | string[]): boolean =>
  Array.isArray(filterValue)
    ? filterValue.includes(itemValue)
    : itemValue.toLowerCase().includes(filterValue.toLowerCase());

const filterFunctions = {
  COMPANY_NAME: (item, value) => matchesStringOrArray(item.companyName, value),
  TRANSACTION_STATE: (item, value) => matchesStringOrArray(item.transactionState, value),
  VESSEL_NAME: (item, value) => matchesStringOrArray(item.vesselName, value),
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

const transactionStateOptions = [
  { label: 'Sent', value: 'SENT' },
  { label: 'In Process', value: 'IN PROCESS' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'New', value: 'NEW' },
  { label: 'Retransmit', value: 'RETRANSMIT' },
  { label: 'Accepted', value: 'ACCEPTED' },
];

/**
 * `filterConfig` renders a dropdown (single value) picker instead of the default text input, for
 * any column also opted into `filterFunctions` (`COMPANY_NAME` and `VESSEL_NAME` keep their plain
 * text inputs since they're absent from `filterConfig`). Global search (`TableToolbarSearch`) is
 * included here too, to demonstrate that it still works correctly alongside a `filterConfig`'d
 * column - see `matchesStringOrArray` above for why the shared predicate needs to handle a plain
 * `string` (from both this column's own dropdown value and from global search) as well as a
 * `string[]` (from a multiselect-type column's own filter, see `TableFilteringWithMultiselect`
 * below).
 */
export const TableFilteringWithDropdown: StoryFn<typeof TableComponent> = () => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent
        height="400px"
        data={data}
        filterFunctions={filterFunctions}
        filterConfig={{
          TRANSACTION_STATE: { type: 'dropdown', options: transactionStateOptions },
        }}
        toolbar={
          <TableToolbar>
            <TableToolbarSearch placeholder="Search all columns" />
          </TableToolbar>
        }
        onColumnFilterValuesChange={action('onColumnFilterValuesChange')}
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

/**
 * `type: 'multiselect'` allows picking any number of values - `columnFilterValues.TRANSACTION_STATE`
 * is a `string[]` here (vs. a plain `string` for the `type: 'dropdown'` story above).
 */
export const TableFilteringWithMultiselect: StoryFn<typeof TableComponent> = () => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent
        height="400px"
        data={data}
        filterFunctions={filterFunctions}
        filterConfig={{
          TRANSACTION_STATE: { type: 'multiselect', options: transactionStateOptions },
        }}
        toolbar={
          <TableToolbar>
            <TableToolbarSearch placeholder="Search all columns" />
          </TableToolbar>
        }
        onColumnFilterValuesChange={action('onColumnFilterValuesChange')}
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
