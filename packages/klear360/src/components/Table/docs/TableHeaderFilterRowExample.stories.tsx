import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../Table';
import {
  createTransactionTableData,
  getTransactionStateColor,
  transactionStateOptions,
} from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Header Filter Row',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const filterRowExampleData = createTransactionTableData(20);

// `COMPANY_NAME`/`VESSEL_NAME` stay plain-text (absent from `filterConfig`); `TRANSACTION_STATE`
// is `filterConfig`'d as `multiselect` below, so it renders a dropdown picker instead - same
// `filterFunctions` mechanism drives both, just with a `string[]` value for the multiselect column
// instead of a plain `string`.
const filterFunctions = {
  COMPANY_NAME: (item: { companyName: string }, value: string | string[]) =>
    typeof value === 'string' && item.companyName.toLowerCase().includes(value.toLowerCase()),
  TRANSACTION_STATE: (item: { transactionState: string }, value: string | string[]) =>
    Array.isArray(value) ? value.includes(item.transactionState) : true,
  VESSEL_NAME: (item: { vesselName: string }, value: string | string[]) =>
    typeof value === 'string' && item.vesselName.toLowerCase().includes(value.toLowerCase()),
};

/**
 * `TRANSACTION_STATE`'s `filterConfig` entry (`type: 'multiselect'`) makes it render
 * `TableHeaderFilterDropdownCell` - a `SelectInput` - instead of the plain text input
 * `COMPANY_NAME`/`VESSEL_NAME` get automatically from just being in `filterFunctions`. Sitting in
 * the same auto-injected filter row, all three now share one visual language: borderless, filling
 * their cell edge-to-edge, a leading search icon, border only appearing on focus. That's
 * `TableHeaderFilterDropdownCell` passing `SelectInput`'s own `isTableInputCell` prop (new -
 * previously `SelectInput` had no way to opt into this styling outside `TableEditableCell`'s
 * context-driven bundle, so this cell rendered with `SelectInput`'s normal bordered, button-like
 * look, which read as inconsistent next to a plain search box in the same row).
 *
 * `isTableInputCell` doesn't change `SelectInput` anywhere else - see the plain, bordered
 * `SelectInput` below the table, rendered completely standalone with no special props, for
 * comparison. The borderless look is opt-in per usage, not a change to `SelectInput`'s default
 * appearance.
 */
export const MixedFilterRow = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Header Filter Row: Mixed Filter Types</Heading>
        <Text>
          `Company Name` and `Vessel Name` are plain-text column filters; `Transaction State` is a
          `filterConfig` multiselect dropdown - all three now look like one consistent filter row
          instead of the dropdown standing out as a bordered button among plain search boxes.
        </Text>
      </Box>
      <Table
        data={filterRowExampleData}
        filterFunctions={filterFunctions}
        filterConfig={{
          TRANSACTION_STATE: { type: 'multiselect', options: transactionStateOptions },
        }}
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
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>
                    <Code size="medium">{item.transactionId}</Code>
                  </TableCell>
                  <TableCell>{item.companyName}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getTransactionStateColor(item.transactionState)}>
                      {item.transactionState}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.vesselName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>

      <Box paddingTop="spacing.6">
        <Text size="small" weight="medium" color="surface.text.gray.muted">
          For comparison - `SelectInput` rendered standalone, no `isTableInputCell`, its normal
          bordered appearance:
        </Text>
        <Box maxWidth="280px" paddingTop="spacing.2">
          <Dropdown selectionType="single">
            <SelectInput
              label="Transaction State"
              placeholder="Select a status"
              onChange={action('standaloneSelectInputChange')}
            />
            <DropdownOverlay>
              <ActionList>
                {transactionStateOptions.map((option) => (
                  <ActionListItem key={option.value} title={option.label} value={option.value} />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>
    </Box>
  );
};

export default TableMeta;
