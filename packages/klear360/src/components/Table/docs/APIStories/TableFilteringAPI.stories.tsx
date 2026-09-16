import React, { useState } from 'react';
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
import { Button } from '~components/Button';

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

// Shared row rendering for the controlled/uncontrolled filtering demos below - same header/body
// shape as the base TableFiltering story above, reusing the same dataset and filterFunctions.
const renderFilterableTable = (
  tableData: ReturnType<typeof createTransactionTableData>['nodes'],
): React.ReactElement => (
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
            <Badge size="medium" color={getTransactionStateColor(tableItem.transactionState)}>
              {tableItem.transactionState}
            </Badge>
          </TableCell>
          <TableCell>{tableItem.vesselName}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </>
);

/**
 * Demonstrates `globalFilterValue` + `onGlobalFilterValueChange` used in controlled mode - the
 * story owns the search value in React state and passes it back in as `globalFilterValue`,
 * updating that state in `onGlobalFilterValueChange`. This is the standard controlled-input
 * pattern already used elsewhere for other controlled Table props (see the `selectionType` /
 * `onSelectionChange` pairing in the Sticky Columns example).
 */
const ControlledGlobalFilterTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');

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
        {...args}
        data={data}
        filterFunctions={filterFunctions}
        globalFilterValue={globalFilterValue}
        onGlobalFilterValueChange={(value) => {
          setGlobalFilterValue(value);
          action('onGlobalFilterValueChange')(value);
        }}
      >
        {(tableData) => renderFilterableTable(tableData)}
      </TableComponent>
    </Box>
  );
};

export const ControlledGlobalFilter = ControlledGlobalFilterTemplate.bind({});
ControlledGlobalFilter.storyName = 'ControlledGlobalFilter';

/**
 * Demonstrates `defaultGlobalFilterValue` - an uncontrolled table that seeds the global search
 * value on mount and renders already pre-filtered, with no state management required.
 */
const DefaultGlobalFilterValueTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
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
        {...args}
        data={data}
        filterFunctions={filterFunctions}
        defaultGlobalFilterValue="EVER"
      >
        {(tableData) => renderFilterableTable(tableData)}
      </TableComponent>
    </Box>
  );
};

export const DefaultGlobalFilterValue = DefaultGlobalFilterValueTemplate.bind({});
DefaultGlobalFilterValue.storyName = 'DefaultGlobalFilterValue';

/**
 * Demonstrates `columnFilterValues` + `onColumnFilterValuesChange` used in controlled mode - the
 * same controlled pairing idea as `ControlledGlobalFilter`, but for the per-column filter values
 * map. A "Clear column filters" button shows the story owning that state, not just echoing it.
 */
const ControlledColumnFiltersTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  const [columnFilterValues, setColumnFilterValues] = useState<Record<string, string>>({});

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Button
          variant="secondary"
          onClick={() => {
            setColumnFilterValues({});
            action('onColumnFilterValuesChange')({});
          }}
        >
          Clear column filters
        </Button>
      </Box>
      <TableComponent
        height="400px"
        {...args}
        data={data}
        filterFunctions={filterFunctions}
        columnFilterValues={columnFilterValues}
        onColumnFilterValuesChange={(values) => {
          setColumnFilterValues(values);
          action('onColumnFilterValuesChange')(values);
        }}
      >
        {(tableData) => renderFilterableTable(tableData)}
      </TableComponent>
    </Box>
  );
};

export const ControlledColumnFilters = ControlledColumnFiltersTemplate.bind({});
ControlledColumnFilters.storyName = 'ControlledColumnFilters';

/**
 * Demonstrates `defaultColumnFilterValues` - an uncontrolled table that seeds per-column filter
 * values on mount, with no state management required.
 */
const DefaultColumnFilterValuesTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent
        height="400px"
        onColumnFilterValuesChange={action('onColumnFilterValuesChange')}
        {...args}
        data={data}
        filterFunctions={filterFunctions}
        defaultColumnFilterValues={{ TRANSACTION_STATE: 'ACCEPTED' }}
      >
        {(tableData) => renderFilterableTable(tableData)}
      </TableComponent>
    </Box>
  );
};

export const DefaultColumnFilterValues = DefaultColumnFilterValuesTemplate.bind({});
DefaultColumnFilterValues.storyName = 'DefaultColumnFilterValues';
