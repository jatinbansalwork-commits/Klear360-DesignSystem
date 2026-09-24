import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Table, TableToolbar } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Wide Dataset',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

// 30 rows - enough that scrolling both directions (this many columns, this many rows) feels like
// a real operational table rather than a token 3-row demo.
const wideDatasetExampleData = createTransactionTableData(30);

// 19 columns, each given a `width` sized to what it actually holds - short fixed-format codes
// (IDs, HS codes, container numbers) get a narrow fixed px width, free-text names get a wider
// `minmax` range so long values aren't clipped, and numeric/date columns sit in between. None of
// these rely on the `minmax(100px, 1fr)` fallback every column gets when `width` is omitted: at
// 19 columns that fallback would give a 6-character HS code and a 30-character company name the
// same flexible share of whatever space is left, which is rarely what either column needs -
// explicit widths are what actually make a wide table like this scannable.
const columns: TableColumnConfig<TransactionTableItem>[] = [
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
    width: '150px',
    sortable: true,
  },
  {
    key: 'companyName',
    header: 'Company Name',
    render: (item) => item.companyName,
    width: '220px',
    sortable: true,
  },
  {
    key: 'cbpTransactionNumber',
    header: 'CBP Transaction Number',
    render: (item) => item.cbpTransactionNumber,
    width: '190px',
  },
  {
    key: 'username',
    header: 'Username',
    render: (item) => item.username,
    width: '150px',
  },
  {
    key: 'transactionState',
    header: 'Transaction State',
    render: (item) => (
      <Badge size="medium" color={getTransactionStateColor(item.transactionState)}>
        {item.transactionState}
      </Badge>
    ),
    width: '150px',
    sortable: true,
  },
  {
    key: 'etd',
    header: 'ETD',
    render: (item) => formatDate(item.etd),
    width: '110px',
    sortable: true,
  },
  {
    key: 'vesselName',
    header: 'Vessel Name',
    render: (item) => item.vesselName,
    width: '220px',
  },
  {
    key: 'filingDate',
    header: 'Filing Date',
    render: (item) => formatDate(item.filingDate),
    width: '110px',
  },
  {
    key: 'shipmentNumber',
    header: 'Shipment #',
    render: (item) => item.shipmentNumber,
    width: '120px',
  },
  {
    key: 'mbl',
    header: 'MBL',
    render: (item) => item.mbl,
    width: '150px',
  },
  {
    key: 'hbl',
    header: 'HBL',
    render: (item) => item.hbl,
    width: '150px',
  },
  {
    key: 'containerNumber',
    header: 'Container #',
    render: (item) => item.containerNumber,
    width: '140px',
  },
  {
    key: 'countryOfExport',
    header: 'Country of Export',
    render: (item) => item.countryOfExport,
    width: '180px',
  },
  {
    key: 'portOfLoading',
    header: 'Port of Loading',
    render: (item) => item.portOfLoading,
    width: '150px',
  },
  {
    key: 'portOfDischarge',
    header: 'Port of Discharge',
    render: (item) => item.portOfDischarge,
    width: '150px',
  },
  {
    key: 'grossWeightKg',
    header: 'Gross Weight (kg)',
    render: (item) => item.grossWeightKg.toLocaleString('en-US'),
    width: '130px',
    textAlign: 'right',
  },
  {
    key: 'hsCode',
    header: 'HS Code',
    render: (item) => <Code size="medium">{item.hsCode}</Code>,
    width: '110px',
  },
  {
    key: 'entryType',
    header: 'Entry Type',
    render: (item) => item.entryType,
    width: '110px',
  },
  {
    key: 'incoterm',
    header: 'Incoterm',
    render: (item) => item.incoterm,
    width: '100px',
  },
];

/**
 * A realistic wide table - 19 columns, each with a `width` chosen for what it holds (see the
 * `columns` comment above) - paired with `stickyColumnCount`/`stickyColumnWidths` to freeze
 * `Transaction ID` and `Company Name` on the left. `selectionType="multiple"` adds a checkbox
 * column, which `Table` freezes automatically at a fixed width alongside the two named columns -
 * `stickyColumnCount` only counts the columns *after* it (see `stickyColumnCount`'s own docs), so
 * `stickyColumnCount={2}` + `stickyColumnWidths={['150px', '220px']}` here freezes three columns
 * total: checkbox, Transaction ID, Company Name.
 *
 * Horizontal scroll itself needs no special setup - it's just what happens when the columns'
 * combined `width`s (roughly 2,800px here) exceed the table's container. The wrapping `Box`'s
 * `overflow="auto"` (the same prop every other Table example already sets) is what turns that
 * overflow into a scrollbar rather than the columns being squeezed to fit; sticky columns then
 * stay pinned to the left edge of that scroll area while the rest of the row scrolls underneath.
 * `isHeaderSticky` is layered on top so the header also stays put on vertical scroll.
 */
export const WideDataset = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="500px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Wide Dataset</Heading>
        <Text>
          19 columns with meaningful per-column widths instead of the equal `minmax(100px, 1fr)`
          fallback, scrolling horizontally underneath `Transaction ID`/`Company Name` (and the
          selection checkbox), which stay frozen via `stickyColumnCount`/`stickyColumnWidths`.
        </Text>
      </Box>
      <Table
        data={wideDatasetExampleData}
        columns={columns}
        stickyColumnCount={2}
        stickyColumnWidths={['150px', '220px']}
        isHeaderSticky
        selectionType="multiple"
        onSelectionChange={action('onSelectionChange')}
        sortFunctions={{
          transactionId: (array) =>
            array.sort((a, b) => a.transactionId.localeCompare(b.transactionId)),
          companyName: (array) => array.sort((a, b) => a.companyName.localeCompare(b.companyName)),
          transactionState: (array) =>
            array.sort((a, b) => a.transactionState.localeCompare(b.transactionState)),
          etd: (array) => array.sort((a, b) => a.etd.getTime() - b.etd.getTime()),
        }}
        toolbar={
          <TableToolbar title={`Showing ${wideDatasetExampleData.nodes.length} Transactions`} />
        }
        height="420px"
      />
    </Box>
  );
};

/**
 * The same 19 columns and data as `WideDataset`, but with every column's `width` removed so each
 * one falls back to `minmax(100px, 1fr)` - the default when `columns` doesn't specify a width.
 * With this many columns competing for the same flexible share, a 6-character HS code column ends
 * up exactly as wide as a 30-character company name column, and most text either wraps awkwardly
 * or sits in far more (or less) space than it needs. This story exists purely as the "before" to
 * `WideDataset`'s "after" - showing why explicit per-column widths matter once a table gets this
 * wide, rather than something to copy.
 */
export const WithoutExplicitWidths = (): React.ReactElement => {
  const columnsWithoutWidths: TableColumnConfig<TransactionTableItem>[] = columns.map(
    ({ width: _width, ...column }) => column,
  );

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="500px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Without Explicit Widths</Heading>
        <Text>
          Same columns and data as `WideDataset`, with every `width` stripped out - each column
          falls back to `minmax(100px, 1fr)` and ends up an equal share of the available space
          regardless of what it holds.
        </Text>
      </Box>
      <Table data={wideDatasetExampleData} columns={columnsWithoutWidths} height="420px" />
    </Box>
  );
};

export default TableMeta;
