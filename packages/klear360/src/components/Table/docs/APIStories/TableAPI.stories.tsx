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
  title: 'Components/Table/API',
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
    onGlobalFilterValueChange: {
      control: {
        disable: true,
      },
    },
    onColumnFilterValuesChange: {
      control: {
        disable: true,
      },
    },
    isGrouped: {
      description:
        'The isGrouped prop determines whether the table has grouped data with parent-child relationships or not. When true, enables tree-aware selection where selecting a parent automatically selects all children. The default value is `false`.',
    },
    checkboxDisplay: {
      description:
        'Controls when the row-level selection checkbox is visible. `\'always\'` (default): checkbox is always visible. Fully backward-compatible. `\'on-hover\'`: checkbox is hidden by default and appears when the row is hovered. Once a row is selected the checkbox stays visible so the user can deselect it. The header "select-all" checkbox is **not** affected by this prop - it is always visible. Only applies when `selectionType="multiple"`.',
      options: ['always', 'on-hover'],
      control: {
        type: 'radio',
      },
    },
    multiSelectTrigger: {
      description: 'Selection mode determines how the table rows can be selected.',
      options: ['checkbox', 'row'],
      control: {
        type: 'radio',
      },
    },
    stickyColumnCount: {
      description:
        'Number of leading columns (left to right, after any multi-select checkbox column) to freeze while the rest of the table scrolls horizontally. `isFirstColumnSticky` is shorthand for `stickyColumnCount={1}` and needs no `stickyColumnWidths`. Freezing more than one column requires `stickyColumnWidths`, since the sticky offsets are computed from known widths rather than measured at render time.',
    },
    stickyColumnWidths: {
      description:
        "Explicit pixel width (e.g. `'160px'`) for each of the leading `stickyColumnCount` columns, in order. Required when `stickyColumnCount` is greater than `1`. Pair these with matching `width`s on the same columns (via the `columns` config's `width` or `gridTemplateColumns`) so the sticky offsets line up with what's actually rendered.",
      control: {
        disable: true,
      },
    },
    backgroundColor: {
      description: 'The backgroundColor prop determines the background color of the table.',
    },
    showStripedRows: {
      description:
        'The showStripedRows prop determines whether the table should have striped rows or not. The default value is `false`.',
    },
    gridTemplateColumns: {
      description:
        'The gridTemplateColumns prop determines the grid-template-columns CSS property of the table. The default value is `repeat(N,minmax(100px, 1fr))` where N is the column count.',
    },
    isLoading: {
      description:
        'The isLoading prop determines whether the table is loading or not. The default value is `false`.',
    },
    isRefreshing: {
      description:
        'The isRefreshing prop determines whether the table is refreshing or not. The default value is `false`.',
    },
    showBorderedCells: {
      description:
        'The showBorderedCells prop determines whether the table should have bordered cells or not.',
    },
    defaultSelectedIds: {
      description:
        'An array of default selected row ids. This will be used to set the initial selected rows.',
      control: {
        disable: true,
      },
    },
    initialSort: {
      description:
        "Sets the table's sort state on mount, so it renders already sorted by this column instead of requiring a click. `sortKey` must match a key in `sortFunctions`.",
      control: {
        disable: true,
      },
    },
    columns: {
      description:
        'Column config array, as an alternative to hand-writing TableHeader/TableBody JSX via `children`. Table builds the header row and body cells from this array instead. Use this or `children`, not both.',
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
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Payout</Button>
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
