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
  TablePagination,
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
  component: Table,
  parameters: {
    controls: { disable: true },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};

export const GlobalSearch: StoryFn = (): React.ReactElement => <FilterableTable />;

GlobalSearch.play = async () => {
  const { getByRole, getAllByRole, queryByText } = within(document.body);
  const searchInput = getByRole('textbox', { name: 'Search table' });

  // 4 body rows + 1 sortable header row + 1 filter row (auto-rendered since NAME/STATUS/METHOD
  // are all filterable).
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

// Deliberately not in the same insertion order as either the ascending or descending sort, so
// each of the three cycle states (ascending / descending / unsorted-original) is distinguishable.
const sortableNodes: Item[] = [
  { id: '1', name: 'John Doe', status: 'Completed', method: 'Bank Transfer' },
  { id: '2', name: 'Alice Smith', status: 'Pending', method: 'PayPal' },
  { id: '3', name: 'Bob Smith', status: 'Failed', method: 'Bank Transfer' },
  { id: '4', name: 'Jane Doe', status: 'Completed', method: 'Credit Card' },
];

const sortFunctions = {
  NAME: (array: Item[]) => [...array].sort((a, b) => a.name.localeCompare(b.name)),
};

const SortableTable = (): React.ReactElement => (
  <Table<Item> data={{ nodes: sortableNodes }} sortFunctions={sortFunctions}>
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Method</TableHeaderCell>
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

export const Sorting: StoryFn = (): React.ReactElement => <SortableTable />;

Sorting.play = async () => {
  const { getByRole, getAllByRole } = within(document.body);
  const nameHeader = getByRole('columnheader', { name: /Name/ });
  const toggleSort = within(nameHeader).getByRole('button', { name: 'Toggle Sort' });

  const bodyRowNames = (): (string | null)[] =>
    getAllByRole('row')
      .slice(1)
      .map((row) => within(row).getAllByRole('cell')[0].textContent);

  // Unsorted: original insertion order.
  await expect(bodyRowNames()).toEqual(['John Doe', 'Alice Smith', 'Bob Smith', 'Jane Doe']);

  // First click sorts ascending.
  await userEvent.click(toggleSort);
  await expect(bodyRowNames()).toEqual(['Alice Smith', 'Bob Smith', 'Jane Doe', 'John Doe']);

  // Second click reverses to descending.
  await userEvent.click(toggleSort);
  await expect(bodyRowNames()).toEqual(['John Doe', 'Jane Doe', 'Bob Smith', 'Alice Smith']);

  // Third click resets back to the original, unsorted order.
  await userEvent.click(toggleSort);
  await expect(bodyRowNames()).toEqual(['John Doe', 'Alice Smith', 'Bob Smith', 'Jane Doe']);
};

const SelectableTable = (): React.ReactElement => (
  <Table<Item> data={{ nodes }} selectionType="multiple">
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index} item={item}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

export const Selection: StoryFn = (): React.ReactElement => <SelectableTable />;

Selection.play = async () => {
  const { getAllByRole } = within(document.body);
  const [selectAllCheckbox, ...rowCheckboxes] = getAllByRole('checkbox');

  await expect(selectAllCheckbox).not.toBeChecked();
  rowCheckboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());

  // Selecting one (but not all) rows leaves the header checkbox indeterminate.
  await userEvent.click(rowCheckboxes[0]);
  await expect(rowCheckboxes[0]).toBeChecked();
  await expect(selectAllCheckbox).toBePartiallyChecked();

  // Selecting every remaining row checks the header checkbox too.
  await Promise.all(rowCheckboxes.slice(1).map((checkbox) => userEvent.click(checkbox)));
  await expect(selectAllCheckbox).toBeChecked();

  // The header checkbox toggles every row's selection at once.
  await userEvent.click(selectAllCheckbox);
  rowCheckboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
  await expect(selectAllCheckbox).not.toBeChecked();
};

const paginationNodes: Item[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Item ${i + 1}`,
  status: 'Completed',
  method: 'Bank Transfer',
}));

const PaginatedTable = (): React.ReactElement => (
  <Table<Item>
    data={{ nodes: paginationNodes }}
    pagination={<TablePagination defaultPageSize={5} />}
  >
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index} item={item}>
              <TableCell>{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

export const Pagination: StoryFn = (): React.ReactElement => <PaginatedTable />;

Pagination.play = async () => {
  const { getByRole, queryByText } = within(document.body);

  // Page 1 of a 5-per-page table shows only the first 5 items.
  await expect(queryByText('Item 1')).toBeInTheDocument();
  await expect(queryByText('Item 5')).toBeInTheDocument();
  await expect(queryByText('Item 6')).not.toBeInTheDocument();

  await userEvent.click(getByRole('button', { name: 'Next Page' }));
  await expect(queryByText('Item 6')).toBeInTheDocument();
  await expect(queryByText('Item 10')).toBeInTheDocument();
  await expect(queryByText('Item 1')).not.toBeInTheDocument();

  await userEvent.click(getByRole('button', { name: 'Previous Page' }));
  await expect(queryByText('Item 1')).toBeInTheDocument();
  await expect(queryByText('Item 6')).not.toBeInTheDocument();
};
