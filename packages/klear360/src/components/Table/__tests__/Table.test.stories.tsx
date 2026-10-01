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
import { TablePagination } from '../TablePagination';

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
  const statusFilter = getByRole('textbox', { name: 'Search Status' });

  await userEvent.type(statusFilter, 'completed');
  await expect(queryByText('John Doe')).toBeInTheDocument();
  await expect(queryByText('Alice Smith')).toBeInTheDocument();
  await expect(queryByText('Jane Doe')).not.toBeInTheDocument();
  await expect(queryByText('Bob Smith')).not.toBeInTheDocument();
};

export const CombinedFilters: StoryFn = (): React.ReactElement => <FilterableTable />;

CombinedFilters.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const statusFilter = getByRole('textbox', { name: 'Search Status' });
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
  const nameFilter = getByRole('textbox', { name: 'Search Name' });
  const statusFilter = getByRole('textbox', { name: 'Search Status' });
  const methodFilter = getByRole('textbox', { name: 'Search Method' });

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

const statusOptions = [
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
];

const DropdownFilterTable = (): React.ReactElement => (
  <Table<Item>
    data={{ nodes }}
    filterFunctions={{
      STATUS: (item: Item, value: string | string[]) =>
        Array.isArray(value) ? value.includes(item.status) : true,
    }}
    filterConfig={{ STATUS: { type: 'multiselect', options: statusOptions } }}
  >
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
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

export const DropdownFilter: StoryFn = (): React.ReactElement => <DropdownFilterTable />;

/**
 * A `filterConfig`'d column renders `TableHeaderFilterDropdownCell` (a `combobox`, exact-match
 * multiselect) instead of the plain-text filter `ColumnFilter` above exercises - so unlike that
 * one, "Failed" never matches "fail" typed into a text box; only the exact option ticked in the
 * picker.
 */
DropdownFilter.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const statusFilter = getByRole('combobox', { name: 'Select Status' });

  await userEvent.click(statusFilter);
  await userEvent.click(getByRole('option', { name: 'Completed' }));

  await expect(queryByText('John Doe')).toBeInTheDocument();
  await expect(queryByText('Alice Smith')).toBeInTheDocument();
  await expect(queryByText('Jane Doe')).not.toBeInTheDocument();
  await expect(queryByText('Bob Smith')).not.toBeInTheDocument();

  // Multiselect - a second ticked option widens the match rather than narrowing it further.
  await userEvent.click(getByRole('option', { name: 'Pending' }));
  await expect(queryByText('Jane Doe')).toBeInTheDocument();
};

type GroupItem = { id: string; name: string; nodes: GroupItem[] | null };

const groupedNodes: GroupItem[] = [
  {
    id: 'group-a',
    name: 'Group A',
    nodes: [
      { id: 'a1', name: 'Item A1', nodes: null },
      { id: 'a2', name: 'Item A2', nodes: null },
    ],
  },
  { id: 'group-b', name: 'Group B', nodes: [{ id: 'b1', name: 'Item B1', nodes: null }] },
];

const GroupedTable = (): React.ReactElement => (
  <Table<GroupItem> data={{ nodes: groupedNodes }} isGrouped>
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

export const GroupedRowExpandCollapse: StoryFn = (): React.ReactElement => <GroupedTable />;

/**
 * Every group starts expanded (`defaultExpandedRowIds` defaults to every group id) - collapsing
 * one group hides only its own children, both toggles keyboard-reachable via their own
 * `Expand row <id>` / `Collapse row <id>` accessible name.
 */
GroupedRowExpandCollapse.play = async () => {
  const { getByRole, queryByText } = within(document.body);

  await expect(queryByText('Item A1')).toBeInTheDocument();
  await expect(queryByText('Item A2')).toBeInTheDocument();

  await userEvent.click(getByRole('button', { name: 'Collapse row group-a' }));
  await expect(queryByText('Item A1')).not.toBeInTheDocument();
  await expect(queryByText('Item A2')).not.toBeInTheDocument();
  // Group B is untouched by collapsing Group A.
  await expect(queryByText('Item B1')).toBeInTheDocument();

  await userEvent.click(getByRole('button', { name: 'Expand row group-a' }));
  await expect(queryByText('Item A1')).toBeInTheDocument();
};

type PaginationItem = { id: string; name: string };

const paginationNodes: PaginationItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  name: `Row ${index + 1}`,
}));

const PaginationTable = (): React.ReactElement => (
  <Table<PaginationItem>
    data={{ nodes: paginationNodes }}
    pagination={<TablePagination defaultPageSize={2} showPageNumberSelector showLabel />}
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

export const PaginationTotalCount: StoryFn = (): React.ReactElement => <PaginationTable />;

/**
 * `showLabel` (the prop every existing Table pagination doc example was missing, leaving the
 * total row count silently unrendered everywhere) surfaces "Showing X-Y Items" next to the page
 * controls, and it updates as the current page changes.
 */
PaginationTotalCount.play = async () => {
  const { getByRole, getByText } = within(document.body);

  await expect(getByText('Showing 1-2 Items')).toBeInTheDocument();

  await userEvent.click(getByRole('button', { name: 'Page 2' }));
  await expect(getByText('Showing 3-4 Items')).toBeInTheDocument();

  await userEvent.click(getByRole('button', { name: 'Page 3' }));
  await expect(getByText('Showing 5-5 Items')).toBeInTheDocument();
};

const FixedHeightTable = ({ rowCount }: { rowCount: number }): React.ReactElement => (
  <Table<Item>
    data={{
      nodes: Array.from({ length: rowCount }, (_, index) => ({
        ...nodes[index % nodes.length],
        id: String(index + 1),
      })),
    }}
    height="400px"
    isHeaderSticky
    filterFunctions={filterFunctions}
    emptyState={<p>{`No results (${rowCount} rows)`}</p>}
  >
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell headerKey="NAME">{`Name (${rowCount} rows)`}</TableHeaderCell>
            <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item) => (
            <TableRow key={item.id} item={item}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

export const FixedHeightRowCounts: StoryFn = (): React.ReactElement => (
  <>
    <FixedHeightTable rowCount={0} />
    <FixedHeightTable rowCount={3} />
    <FixedHeightTable rowCount={100} />
  </>
);

/**
 * A fixed-height Table's header rows (label + filter row) are the same height with 0, 3 or 100
 * body rows - the grid never stretches rows into leftover height - and `emptyState` is centered
 * in the body space below the header.
 */
FixedHeightRowCounts.play = async () => {
  const tables = Array.from(document.querySelectorAll<HTMLElement>('table[role="table"]'));
  const headerRowHeights = tables.map((table) =>
    Array.from(table.querySelectorAll('thead tr')).map(
      (row) => row.firstElementChild!.getBoundingClientRect().height,
    ),
  );

  await expect(tables).toHaveLength(3);
  await expect(headerRowHeights[0]).toEqual(headerRowHeights[2]);
  await expect(headerRowHeights[1]).toEqual(headerRowHeights[2]);

  const emptyCell = within(tables[0]).getByText('No results (0 rows)').closest('td')!;
  const cellBox = emptyCell.getBoundingClientRect();
  const contentBox = emptyCell.firstElementChild!.getBoundingClientRect();
  const tableBox = tables[0].getBoundingClientRect();
  const headerHeight = headerRowHeights[0].reduce((sum, height) => sum + height, 0);
  await expect(
    Math.round(
      Math.abs(cellBox.top + cellBox.height / 2 - (contentBox.top + contentBox.height / 2)),
    ),
  ).toBe(0);
  await expect(Math.round(cellBox.height)).toBe(Math.round(tableBox.height - headerHeight));
};
