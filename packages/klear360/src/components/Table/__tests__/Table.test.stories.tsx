/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../';
import { TableToolbar, TableToolbarSearch } from '../TableToolbar';

type Item = {
  id: string;
  name: string;
  status: string;
  method: string;
};

const nodes: Item[] = [
  { id: '1', name: 'John Doe', status: 'Completed', method: 'Bank Transfer' },
  { id: '2', name: 'Jane Doe', status: 'Pending', method: 'Credit Card' },
  { id: '3', name: 'Bob Smith', status: 'Failed', method: 'Bank Transfer' },
  { id: '4', name: 'Alice Smith', status: 'Completed', method: 'PayPal' },
];

const filterFunctions = {
  NAME: (item: Item, value: string) => item.name.toLowerCase().includes(value.toLowerCase()),
  STATUS: (item: Item, value: string) => item.status.toLowerCase().includes(value.toLowerCase()),
  METHOD: (item: Item, value: string) => item.method.toLowerCase().includes(value.toLowerCase()),
};

const FilterableTable = (): React.ReactElement => (
  <Table<Item>
    data={{ nodes }}
    filterFunctions={filterFunctions}
    toolbar={
      <TableToolbar>
        <TableToolbarSearch placeholder="Search all columns" />
      </TableToolbar>
    }
  >
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
            <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
            <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index} item={item}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.method}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

export default {
  title: 'Components/Interaction Tests/Table',
};

export const GlobalSearch: StoryFn = (): React.ReactElement => <FilterableTable />;

GlobalSearch.play = async () => {
  const { getByRole, getAllByRole, queryByText } = within(document.body);
  const searchInput = getByRole('textbox', { name: 'Search table' });

  // 4 body rows + 1 sortable header row + 1 auto-injected per-column filter row.
  await expect(getAllByRole('row')).toHaveLength(6);

  await userEvent.type(searchInput, 'jane');
  await expect(queryByText('Jane Doe')).toBeInTheDocument();
  await expect(queryByText('John Doe')).not.toBeInTheDocument();
  await expect(queryByText('Bob Smith')).not.toBeInTheDocument();

  // Matches by any filterable column, not just name.
  await userEvent.clear(searchInput);
  await userEvent.type(searchInput, 'paypal');
  await expect(queryByText('Alice Smith')).toBeInTheDocument();
  await expect(queryByText('Jane Doe')).not.toBeInTheDocument();

  // Clearing the search restores the full list.
  await userEvent.clear(searchInput);
  await expect(getAllByRole('row')).toHaveLength(6);
};

export const ColumnFilter: StoryFn = (): React.ReactElement => <FilterableTable />;

ColumnFilter.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const statusFilter = getByRole('textbox', { name: 'Filter by Status' });

  await userEvent.type(statusFilter, 'completed');
  await expect(queryByText('John Doe')).toBeInTheDocument();
  await expect(queryByText('Alice Smith')).toBeInTheDocument();
  await expect(queryByText('Jane Doe')).not.toBeInTheDocument();
  await expect(queryByText('Bob Smith')).not.toBeInTheDocument();
};

export const CombinedFilters: StoryFn = (): React.ReactElement => <FilterableTable />;

CombinedFilters.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const statusFilter = getByRole('textbox', { name: 'Filter by Status' });
  const searchInput = getByRole('textbox', { name: 'Search table' });

  // Column filter narrows to "Completed" rows (John Doe, Alice Smith)...
  await userEvent.type(statusFilter, 'completed');
  // ...global search then narrows further within that set.
  await userEvent.type(searchInput, 'alice');

  await expect(queryByText('Alice Smith')).toBeInTheDocument();
  await expect(queryByText('John Doe')).not.toBeInTheDocument();
};

export const Accessibility: StoryFn = (): React.ReactElement => <FilterableTable />;

Accessibility.play = async () => {
  const { getByRole } = within(document.body);
  const searchInput = getByRole('textbox', { name: 'Search table' });
  const nameFilter = getByRole('textbox', { name: 'Filter by Name' });
  const statusFilter = getByRole('textbox', { name: 'Filter by Status' });
  const methodFilter = getByRole('textbox', { name: 'Filter by Method' });

  // Every filter input has a distinct, meaningful accessible name and is reachable by keyboard
  // (plain native inputs, so Tab order and typing work without any custom key handling).
  await Promise.all(
    [searchInput, nameFilter, statusFilter, methodFilter].flatMap((input) => [
      expect(input).toBeVisible(),
      expect(input).not.toBeDisabled(),
    ]),
  );

  nameFilter.focus();
  await expect(nameFilter).toHaveFocus();
  await userEvent.tab();
  await expect(statusFilter).toHaveFocus();
  await userEvent.tab();
  await expect(methodFilter).toHaveFocus();
};
