import type { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import type { TableProps } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableToolbarActions, TableToolbar } from '../../TableToolbar';
import { TablePagination } from '../../TablePagination';
import { createTransactionTableData, formatDate, getTransactionStateColor } from '../exampleData';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { IconButton } from '~components/Button/IconButton';
import { CopyIcon, TrashIcon } from '~components/Icons';

export default {
  title: 'Components/Table/API/Table Striped Rows',
  tags: ['autodocs'],
  component: TableComponent,
  args: {
    showStripedRows: true,
    selectionType: 'multiple',
    rowDensity: 'normal',
  },
  argTypes: {
    showStripedRows: {
      control: 'boolean',
      description: 'Show striped/zebra rows',
    },
    selectionType: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
    rowDensity: {
      control: 'select',
      options: ['compact', 'normal', 'comfortable'],
    },
  },
} as Meta<TableProps<unknown>>;

const data = createTransactionTableData(8);

export const TableStripedSelection: StoryFn<typeof TableComponent> = () => (
  <Box
    backgroundColor="surface.background.gray.moderate"
    padding="spacing.8"
    overflow="auto"
    minHeight="400px"
  >
    <TableComponent
      data={data}
      showStripedRows
      selectionType="multiple"
      onSelectionChange={({ selectedIds }) => action('onSelectionChange')(selectedIds)}
      toolbar={
        <TableToolbar title="Showing 1-8 Items">
          <TableToolbarActions>
            <Button size="small" variant="secondary" marginRight="spacing.3">
              Export
            </Button>
            <Button size="small">Payout</Button>
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
              <TableHeaderCell>Transaction ID</TableHeaderCell>
              <TableHeaderCell>Company Name</TableHeaderCell>
              <TableHeaderCell>Username</TableHeaderCell>
              <TableHeaderCell>ETD</TableHeaderCell>
              <TableHeaderCell>Vessel Name</TableHeaderCell>
              <TableHeaderCell>Transaction State</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((tableItem) => (
              <TableRow key={tableItem.id} item={tableItem}>
                <TableCell>
                  <Code size="medium">{tableItem.transactionId}</Code>
                </TableCell>
                <TableCell>{tableItem.companyName}</TableCell>
                <TableCell>{tableItem.username}</TableCell>
                <TableCell>{formatDate(tableItem.etd)}</TableCell>
                <TableCell>{tableItem.vesselName}</TableCell>
                <TableCell>
                  <Badge size="medium" color={getTransactionStateColor(tableItem.transactionState)}>
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

TableStripedSelection.storyName = 'TableStripedSelection';

export const TableStripedSelectionNoToolbarNoPagination: StoryFn<typeof TableComponent> = () => (
  <Box
    backgroundColor="surface.background.gray.moderate"
    padding="spacing.8"
    overflow="auto"
    minHeight="400px"
  >
    <TableComponent
      data={data}
      showStripedRows
      selectionType="multiple"
      onSelectionChange={({ selectedIds }) => action('onSelectionChange')(selectedIds)}
    >
      {(tableData) => (
        <>
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
            {tableData.map((tableItem) => (
              <TableRow key={tableItem.id} item={tableItem}>
                <TableCell>
                  <Code size="medium">{tableItem.transactionId}</Code>
                </TableCell>
                <TableCell>{tableItem.companyName}</TableCell>
                <TableCell>{tableItem.username}</TableCell>
                <TableCell>{formatDate(tableItem.etd)}</TableCell>
                <TableCell>{tableItem.vesselName}</TableCell>
                <TableCell>
                  <Badge size="medium" color={getTransactionStateColor(tableItem.transactionState)}>
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

TableStripedSelectionNoToolbarNoPagination.storyName = 'TableStripedSelectionNoToolbarNoPagination';

export const TableStripedHoverNoSelection: StoryFn<typeof TableComponent> = () => (
  <Box
    backgroundColor="surface.background.gray.moderate"
    padding="spacing.8"
    overflow="auto"
    minHeight="400px"
  >
    <TableComponent
      data={data}
      showStripedRows
      selectionType="multiple"
      onSelectionChange={({ selectedIds }) => action('onSelectionChange')(selectedIds)}
    >
      {(tableData) => (
        <>
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
            {tableData.map((tableItem) => (
              <TableRow
                key={tableItem.id}
                item={tableItem}
                hoverActions={
                  <>
                    <IconButton
                      accessibilityLabel="Copy"
                      isHighlighted
                      icon={CopyIcon}
                      onClick={() => action('copy')(tableItem)}
                    />
                    <IconButton
                      accessibilityLabel="Delete"
                      isHighlighted
                      icon={TrashIcon}
                      onClick={() => action('delete')(tableItem)}
                    />
                  </>
                }
              >
                <TableCell>
                  <Code size="medium">{tableItem.transactionId}</Code>
                </TableCell>
                <TableCell>{tableItem.companyName}</TableCell>
                <TableCell>{tableItem.username}</TableCell>
                <TableCell>{formatDate(tableItem.etd)}</TableCell>
                <TableCell>{tableItem.vesselName}</TableCell>
                <TableCell>
                  <Badge size="medium" color={getTransactionStateColor(tableItem.transactionState)}>
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

TableStripedHoverNoSelection.storyName = 'TableStripedHoverWithSelection';
