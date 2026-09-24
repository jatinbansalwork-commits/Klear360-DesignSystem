import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table, TableTitleDescriptionCell } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Title Description Cell',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const titleDescriptionExampleData = createTransactionTableData(6);

const complianceNotes = [
  'Declared HS code did not match the commercial invoice description; broker sign-off required before this can proceed to customs clearance.',
  'Awaiting carrier confirmation of container weight - discrepancy flagged against the booking manifest during pre-clearance review.',
  'Filed on time.',
  'Duplicate ISF filing detected for this shipment; the earlier filing was voided automatically and this one is now the record of truth.',
  'Consignee address does not match the one on file for this importer - confirm before this entry is finalized.',
  'Filed on time.',
];

const baseColumns: TableColumnConfig<TransactionTableItem>[] = [
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
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
  },
];

/**
 * The recommended pattern for a "title + secondary text" cell (company name + compliance note,
 * a person's name + role, a shipment ID + carrier note - any two-line title/description pair) -
 * `TableTitleDescriptionCell` used directly in a column's `render`, exactly like `Badge`/`Code`/
 * any other cell content.
 *
 * `descriptionBehavior="truncate"` (the default, shown here) clamps `description` to
 * `descriptionLines` (2, also the default) and shows the full note as a native tooltip on hover -
 * but only for rows where it's actually cut off. Row 3 and row 6 below ("Filed on time.") are
 * short enough to never truncate, so hovering them shows nothing extra - there's nothing hidden
 * to reveal. Hover a longer note (row 1, 2, 4, or 5) to see the tooltip appear.
 */
export const TitleDescriptionTruncated = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    {
      key: 'companyName',
      header: 'Company / Compliance Note',
      render: (item, index) => (
        <TableTitleDescriptionCell
          title={item.companyName}
          description={complianceNotes[index % complianceNotes.length]}
        />
      ),
      width: '320px',
    },
    ...baseColumns,
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Title + Description (Truncated)</Heading>
        <Text>
          Compliance notes clamp to 2 lines - hover a truncated one to see the full note as a
          tooltip. Short notes (&quot;Filed on time.&quot;) never truncate, so they show no tooltip.
        </Text>
      </Box>
      <Table data={titleDescriptionExampleData} columns={columns} rowDensity="compact" />
    </Box>
  );
};

/**
 * `descriptionBehavior="wrap"` - for when the full note should always be visible without a hover
 * interaction (e.g. printed/exported views, or notes short enough that clamping would rarely even
 * trigger). Rows grow to fit their own note independently - row 3/6&apos;s one-liner and row 1&apos;s
 * three-line note sit in the same table without either being forced to match the other&apos;s
 * height. No tooltip here - nothing is ever hidden, so there's nothing for one to reveal.
 */
export const TitleDescriptionWrapped = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    {
      key: 'companyName',
      header: 'Company / Compliance Note',
      render: (item, index) => (
        <TableTitleDescriptionCell
          title={item.companyName}
          description={complianceNotes[index % complianceNotes.length]}
          descriptionBehavior="wrap"
        />
      ),
      width: '320px',
    },
    ...baseColumns,
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Title + Description (Wrapped)</Heading>
        <Text>
          Same data, `descriptionBehavior=&quot;wrap&quot;` - every note renders in full, so rows
          with longer notes are visibly taller than rows with short ones.
        </Text>
      </Box>
      <Table data={titleDescriptionExampleData} columns={columns} rowDensity="compact" />
    </Box>
  );
};

export default TableMeta;
