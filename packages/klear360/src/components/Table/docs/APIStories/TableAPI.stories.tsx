import type { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import type { TableProps } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from '../../TableFooter';
import { TablePagination } from '../../TablePagination';
import { TableToolbarActions, TableToolbar, TableToolbarSearch } from '../../TableToolbar';
import { createTransactionTableData, formatDate, getTransactionStateColor } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { useTheme } from '~components/Klear360Provider';

export default {
  title: 'Components/Table/API/Table',
  tags: ['autodocs'],
  component: TableComponent,
  args: {
    selectionType: 'none',
    rowDensity: 'normal',
  },
  argTypes: {
    ...getStyledPropsArgTypes(),
    data: {
      control: {
        disable: true,
      },
    },
    sortFunctions: {
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
    toolbar: {
      control: {
        disable: true,
      },
    },
    pagination: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => <StoryPageWrapper componentDescription="" componentName="Table" />,
    },
  },
} as Meta<TableProps<unknown>>;

const data = createTransactionTableData(200);

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
        height="400px"
        onSelectionChange={({ values }) => action('onSelectionChange')(values)}
        onSortChange={({ sortKey, isSortReversed }) =>
          action('onSortChange')({ sortKey, isSortReversed })
        }
        onGlobalFilterValueChange={action('onGlobalFilterValueChange')}
        onColumnFilterValuesChange={action('onColumnFilterValuesChange')}
        toolbar={
          <TableToolbar>
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
        {...args}
        data={data}
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
        filterFunctions={{
          VESSEL_NAME: (item, value) => item.vesselName.toLowerCase().includes(value.toLowerCase()),
          TRANSACTION_STATE: (item, value) =>
            item.transactionState.toLowerCase().includes(value.toLowerCase()),
        }}
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
            <TableFooter>
              <TableFooterRow>
                {args.selectionType === 'multiple' && <TableFooterCell>-</TableFooterCell>}
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const Table = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Table.storyName = 'Table';
