import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../Table';
import type { TableExampleItem } from './exampleData';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Selection',
  component: Table,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

const radioSelectionData = createTableData(6);

export const RadioSingleSelection = (): React.ReactElement => {
  const [selectedItem, setSelectedItem] = useState<TableExampleItem | undefined>(undefined);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Radio Single Selection</Heading>
        <Text>
          selectionType=&quot;single&quot; with selectionIndicator=&quot;radio&quot; renders a radio
          button in a leading column for each row, instead of relying on click/highlight alone.
        </Text>
      </Box>
      <Table
        data={radioSelectionData}
        selectionType="single"
        selectionIndicator="radio"
        onSelectionChange={({ values }) => setSelectedItem(values[0])}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
      <Box marginTop="spacing.3" display="flex" flexDirection="row" gap="spacing.2">
        <Text weight="bold">Selected Row ID:</Text>
        <Text>{selectedItem?.paymentId ?? 'None'}</Text>
      </Box>
    </Box>
  );
};

export default TableMeta;
