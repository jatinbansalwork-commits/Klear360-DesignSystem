import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { Table } from '../Table';
import { TableBody, TableCell, TableRow, TableVirtualizedWrapper } from '../TableBody';
import { TableFooter, TableFooterCell, TableFooterRow } from '../TableFooter';
import { TableHeader, TableHeaderCell, TableHeaderRow } from '../TableHeader';
import { TableToolbar, TableToolbarSearch } from '../TableToolbar';
import type { TableProps } from '../types';
import { TablePagination } from '../TablePagination';
import { TableEditableCell } from '../TableEditableCell';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Amount } from '~components/Amount';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';

// `renderWithTheme` wraps only the initial render; rerenders need the provider again
const withTheme = (ui: React.ReactElement): React.ReactElement => (
  <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
    {ui}
  </Klear360Provider>
);

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  type: string;
  method: string;
  name: string;
};

const nodes: Item[] = [
  {
    id: '1',
    paymentId: 'klear01',
    amount: 100,
    status: 'pending',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '2',
    paymentId: 'klear02',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '3',
    paymentId: 'klear03',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '4',
    paymentId: 'klear04',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '5',
    paymentId: 'klear05',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '6',
    paymentId: 'klear06',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '7',
    paymentId: 'klear07',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '8',
    paymentId: 'klear08',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '9',
    paymentId: 'klear09',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '10',
    paymentId: 'klear10',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '11',
    paymentId: 'klear11',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '12',
    paymentId: 'klear12',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '13',
    paymentId: 'klear13',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '14',
    paymentId: 'klear14',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '15',
    paymentId: 'klear15',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '16',
    paymentId: 'klear16',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '17',
    paymentId: 'klear17',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '18',
    paymentId: 'klear18',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '19',
    paymentId: 'klear19',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '20',
    paymentId: 'klear20',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '21',
    paymentId: 'klear21',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
  {
    id: '22',
    paymentId: 'klear22',
    amount: 240,
    status: 'pending',
    type: 'credit',
    method: 'UPI',
    name: 'Jane Doe',
  },
  {
    id: '23',
    paymentId: 'klear23',
    amount: 120,
    status: 'failed',
    type: 'debit',
    method: 'Debit Card',
    name: 'Alice Smith',
  },
  {
    id: '24',
    paymentId: 'klear24',
    amount: 300,
    status: 'completed',
    type: 'credit',
    method: 'Credit Card',
    name: 'Bob Smith',
  },
  {
    id: '25',
    paymentId: 'klear25',
    amount: 200,
    status: 'completed',
    type: 'credit',
    method: 'Netbanking',
    name: 'John Doe',
  },
];

// Grouped data for testing
const groupedNodes = [
  {
    id: 'group1',
    name: 'Group 1',
    amount: 500,
    treeXLevel: 0,
    nodes: [
      { id: 'child1-1', name: 'Child 1-1', amount: 200, treeXLevel: 1, nodes: null },
      { id: 'child1-2', name: 'Child 1-2', amount: 300, treeXLevel: 1, nodes: null },
    ],
  },
  {
    id: 'group2',
    name: 'Group 2',
    amount: 400,
    treeXLevel: 0,
    nodes: [{ id: 'child2-1', name: 'Child 2-1', amount: 400, treeXLevel: 1, nodes: null }],
  },
];

// Spanning data for testing
const spanningNodes = [
  { id: '1', merchant: 'Flipkart', method: 'UPI', amount: 100 },
  { id: '2', merchant: 'Flipkart', method: 'Card', amount: 200 },
  { id: '3', merchant: 'Swiggy', method: 'UPI', amount: 150 },
];

describe('<Table />', () => {
  it('should render table', () => {
    const { container, getAllByRole, queryAllByRole } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} toolbar={<TableToolbar />}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
    // 5 body rows + 1 header row + 1 footer row - both the header and footer row correctly have
    // role="row" (see the role="rowheader"/"rowfooter" bug fixes - neither is a real WAI-ARIA
    // role - in TableHeader.web.tsx and Table.web.tsx), so both are included here too.
    expect(getAllByRole('row')).toHaveLength(7);
    expect(getAllByRole('rowgroup')).toHaveLength(3);
    expect(getAllByRole('columnheader')).toHaveLength(6);
    // 30 body cells + 6 footer cells - footer cells are role="cell" too, for the same reason
    // "columnfooter" isn't a real WAI-ARIA role.
    expect(getAllByRole('cell')).toHaveLength(36);
    // Neither "rowheader" nor "columnfooter"/"rowfooter" appear anywhere - none are valid
    // WAI-ARIA roles for these elements.
    expect(queryAllByRole('rowheader')).toHaveLength(0);
    expect(queryAllByRole('rowfooter')).toHaveLength(0);
    expect(queryAllByRole('columnfooter')).toHaveLength(0);
  });

  it('should render table with compact rowDensity', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} rowDensity="compact">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with comfortable rowDensity', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} rowDensity="comfortable">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with showStripedRows', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} showStripedRows={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with isLoading', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} isLoading={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with isRefreshing', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 2) }} isRefreshing={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with TableEditableCell and Bordered cells', () => {
    const { container } = renderWithTheme(
      <Table showBorderedCells={true} data={{ nodes: nodes.slice(0, 2) }} isRefreshing={true}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableEditableCell placeholder="Enter Amount" accessibilityLabel="Amount" />
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with sticky header, footer & first column', () => {
    const { container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 10) }}
        height="300px"
        isHeaderSticky
        isFooterSticky
        isFirstColumnSticky
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('disables sticky columns on mobile, where the frozen width would leave no room to scroll', () => {
    // Simulate a mobile viewport by making the `xs` breakpoint's media query match - this is
    // what `useIsMobile` (via `useBreakpoint`) checks internally. jsdom doesn't implement
    // `matchMedia` at all, so it has to be assigned rather than spied on.
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (jest.fn((query: string) => ({
      matches: query.includes('min-width: 320px') && query.includes('max-width: 479px'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown) as typeof window.matchMedia;

    const { getByText } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 3) }} isFirstColumnSticky>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    // The first body cell should no longer be pinned with `position: sticky` on mobile - a
    // frozen column's width would otherwise easily exceed the whole viewport, leaving no
    // scrollable area to reach the rest of the table at all.
    const firstBodyCell = getByText(nodes[0].paymentId).closest('td');
    expect(firstBodyCell).not.toHaveStyle({ position: 'sticky' });

    window.matchMedia = originalMatchMedia;
  });

  it('should render table with a trailing sticky column', () => {
    const { getByText } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 3) }} isLastColumnSticky>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const lastBodyCell = getByText(String(nodes[0].amount)).closest('td');
    expect(lastBodyCell).toHaveStyle({ position: 'sticky', right: '0px' });
  });

  it('should render table with both leading and trailing sticky columns', () => {
    const { getByText, getAllByText } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 3) }}
        stickyColumnCount={1}
        trailingStickyColumnCount={1}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const firstBodyCell = getByText(nodes[0].paymentId).closest('td');
    const lastBodyCell = getAllByText(nodes[0].status)[0].closest('td');
    expect(firstBodyCell).toHaveStyle({ position: 'sticky', left: '0px' });
    expect(lastBodyCell).toHaveStyle({ position: 'sticky', right: '0px' });
  });

  it('disables trailing sticky columns on mobile, same as leading sticky columns', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (jest.fn((query: string) => ({
      matches: query.includes('min-width: 320px') && query.includes('max-width: 479px'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown) as typeof window.matchMedia;

    const { getByText } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 3) }} isLastColumnSticky>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const lastBodyCell = getByText(String(nodes[0].amount)).closest('td');
    expect(lastBodyCell).not.toHaveStyle({ position: 'sticky' });

    window.matchMedia = originalMatchMedia;
  });

  it('throws in dev mode when trailingStickyColumnCount > 1 without matching trailingStickyColumnWidths', () => {
    expect(() =>
      renderWithTheme(
        <Table data={{ nodes: nodes.slice(0, 3) }} trailingStickyColumnCount={2}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      ),
    ).toThrow('`trailingStickyColumnWidths` must provide a pixel width');
  });

  it('should render table with sorting', () => {
    const onSortChange = jest.fn();
    const { getByLabelText, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        sortFunctions={{
          STATUS: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
        }}
        onSortChange={onSortChange}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    const sortButton = getByLabelText('Toggle Sort');
    expect(sortButton).toBeInTheDocument();
    fireEvent.click(sortButton);
    expect(getAllByRole('row')[1]).toHaveTextContent('pending');
    expect(onSortChange).toHaveBeenCalledWith({ sortKey: 'STATUS', isSortReversed: false });
    fireEvent.click(sortButton);
    expect(onSortChange).toHaveBeenCalledWith({ sortKey: 'STATUS', isSortReversed: true });
    expect(getAllByRole('row')[1]).toHaveTextContent('completed');
  });

  it('should clear sort on the third click (removable sort)', () => {
    const onSortChange = jest.fn();
    const { getByLabelText, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        sortFunctions={{
          AMOUNT: (array) => [...array].sort((a, b) => a.amount - b.amount),
        }}
        onSortChange={onSortChange}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const sortButton = getByLabelText('Toggle Sort');
    fireEvent.click(sortButton); // ascending
    fireEvent.click(sortButton); // descending
    fireEvent.click(sortButton); // cleared back to unsorted

    expect(onSortChange).toHaveBeenLastCalledWith({ sortKey: 'NONE', isSortReversed: false });
    const rows = getAllByRole('row').slice(1); // drop the header row
    // Back to the original, unsorted insertion order.
    expect(rows[0]).toHaveTextContent('100');
    expect(rows[1]).toHaveTextContent('240');
    expect(rows[2]).toHaveTextContent('120');
    expect(rows[3]).toHaveTextContent('300');
    expect(rows[4]).toHaveTextContent('200');
  });

  it('should presort via the initialSort prop on mount', () => {
    const { getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        sortFunctions={{
          AMOUNT: (array) => [...array].sort((a, b) => a.amount - b.amount),
        }}
        initialSort={{ sortKey: 'AMOUNT', direction: 'asc' }}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const rows = getAllByRole('row').slice(1); // drop the header row
    expect(rows[0]).toHaveTextContent('100');
    expect(rows[1]).toHaveTextContent('120');
    expect(rows[2]).toHaveTextContent('200');
    expect(rows[3]).toHaveTextContent('240');
    expect(rows[4]).toHaveTextContent('300');
  });

  it('should support multi-column sort via shift-click, adding a secondary sort key', () => {
    const { getAllByLabelText, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        sortFunctions={{
          STATUS: (array) => [...array].sort((a, b) => a.status.localeCompare(b.status)),
          AMOUNT: (array) => [...array].sort((a, b) => a.amount - b.amount),
        }}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const [statusSortButton, amountSortButton] = getAllByLabelText('Toggle Sort');

    // Primary: sort by STATUS ascending.
    fireEvent.click(statusSortButton);
    // Secondary: shift-click AMOUNT - added as a secondary key, STATUS stays primary.
    fireEvent.click(amountSortButton, { shiftKey: true });

    const rows = getAllByRole('row').slice(1); // drop the header row
    // completed (200, 300) < failed (120) < pending (100, 240), ties broken by AMOUNT ascending.
    expect(rows[0]).toHaveTextContent('completed');
    expect(rows[0]).toHaveTextContent('200');
    expect(rows[1]).toHaveTextContent('completed');
    expect(rows[1]).toHaveTextContent('300');
    expect(rows[2]).toHaveTextContent('failed');
    expect(rows[3]).toHaveTextContent('pending');
    expect(rows[3]).toHaveTextContent('100');
    expect(rows[4]).toHaveTextContent('pending');
    expect(rows[4]).toHaveTextContent('240');

    // Shift-clicking the secondary key again (AMOUNT) cycles just its own direction, without
    // disturbing the primary (STATUS).
    fireEvent.click(amountSortButton, { shiftKey: true });
    const rowsAfterAmountDesc = getAllByRole('row').slice(1); // drop the header row
    expect(rowsAfterAmountDesc[0]).toHaveTextContent('completed');
    expect(rowsAfterAmountDesc[0]).toHaveTextContent('300');
    expect(rowsAfterAmountDesc[1]).toHaveTextContent('completed');
    expect(rowsAfterAmountDesc[1]).toHaveTextContent('200');

    // A third shift-click on AMOUNT removes just that key - STATUS-only order returns, with
    // ties broken by original (stable) row order rather than by AMOUNT any more.
    fireEvent.click(amountSortButton, { shiftKey: true });
    const rowsAfterAmountRemoved = getAllByRole('row').slice(1); // drop the header row
    expect(rowsAfterAmountRemoved[0]).toHaveTextContent('completed');
    expect(rowsAfterAmountRemoved[0]).toHaveTextContent('300');
    expect(rowsAfterAmountRemoved[1]).toHaveTextContent('completed');
    expect(rowsAfterAmountRemoved[1]).toHaveTextContent('200');
  });

  it('should call onHover when mouse enters the row', async () => {
    const onHover = jest.fn();
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} selectionType="single">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index} onHover={onHover}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const firstSelectableRow = getByText('klear01').closest('td');
    if (firstSelectableRow) await user.hover(firstSelectableRow);
    expect(onHover).toHaveBeenCalledWith({ item: nodes[0] });
  });

  it('should call onClick when the row is clicked', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} selectionType="single">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index} onClick={onClick}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const firstSelectableRow = getByText('klear01').closest('td');
    if (firstSelectableRow) await user.click(firstSelectableRow);
    expect(onClick).toHaveBeenCalledWith({ item: nodes[0] });
  });

  it('should render table with single select', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText, container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="single"
        onSelectionChange={onSelectionChange}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const firstSelectableRow = getByText('klear01').closest('td');
    if (firstSelectableRow) await user.click(firstSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [nodes[0]], selectedIds: ['1'] });

    // Check that the selected row has the intended styles
    const selectedRow = getByText('klear01').closest('tr');
    expect(selectedRow).toHaveAttribute('aria-selected', 'true');
    expect(container).toMatchSnapshot();

    const secondSelectableRow = getByText('klear02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [nodes[1]], selectedIds: ['2'] });

    // Check that the new selected row has the intended styles and previous is deselected
    const newSelectedRow = getByText('klear02').closest('tr');
    const previousRow = getByText('klear01').closest('tr');
    expect(newSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(previousRow).toHaveAttribute('aria-selected', 'false');
  });

  it('should render table with multi select', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText, getAllByRole, container } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        toolbar={<TableToolbar />}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    expect(getByText('Showing 1-5 Items')).toBeInTheDocument();
    expect(getAllByRole('checkbox')).toHaveLength(6);
    const firstSelectableRow = getByText('klear01').closest('td');
    if (firstSelectableRow) await user.click(firstSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [nodes[0]], selectedIds: ['1'] });

    // Check that the first selected row has the intended styles
    const firstSelectedRow = getByText('klear01').closest('tr');
    expect(firstSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(container).toMatchSnapshot();

    const secondSelectableRow = getByText('klear02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({
      values: [nodes[0], nodes[1]],
      selectedIds: ['1', '2'],
    });
    expect(getByText('2 Items Selected')).toBeInTheDocument();

    // Check that both selected rows have the intended styles
    const secondSelectedRow = getByText('klear02').closest('tr');
    expect(firstSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(secondSelectedRow).toHaveAttribute('aria-selected', 'true');
    expect(container).toMatchSnapshot();

    const deselectButton = getByText('Deselect');
    await user.click(deselectButton);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [], selectedIds: [] });

    // Check that all rows are deselected after clicking deselect
    expect(firstSelectedRow).toHaveAttribute('aria-selected', 'false');
    expect(secondSelectedRow).toHaveAttribute('aria-selected', 'false');
    expect(container).toMatchSnapshot();
  });

  it('should render table with single select and defaultSelectedIds', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="single"
        onSelectionChange={onSelectionChange}
        defaultSelectedIds={['1']}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    const firstSelectableRow = getByText('klear01').closest('tr');
    expect(firstSelectableRow).toHaveAttribute('aria-selected', 'true');
    const secondSelectableRow = getByText('klear02').closest('td');
    if (secondSelectableRow) await user.click(secondSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({
      values: [nodes[1]],
      selectedIds: ['2'],
    });
  });

  it('should render table with multi select and defaultSelectedIds', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByText, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: nodes.slice(0, 5) }}
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        defaultSelectedIds={['1', '2']}
        toolbar={<TableToolbar />}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    expect(getByText('2 Items Selected')).toBeInTheDocument();
    expect(getAllByRole('checkbox')).toHaveLength(6);
    const firstSelectableRow = getByText('klear01').closest('tr');
    expect(firstSelectableRow).toHaveAttribute('aria-selected', 'true');
    const secondSelectableRow = getByText('klear02').closest('tr');
    expect(secondSelectableRow).toHaveAttribute('aria-selected', 'true');
    const thirdSelectableRow = getByText('klear03').closest('td');
    if (thirdSelectableRow) await user.click(thirdSelectableRow);
    expect(onSelectionChange).toHaveBeenCalledWith({
      values: [nodes[0], nodes[1], nodes[2]],
      selectedIds: ['1', '2', '3'],
    });

    expect(getByText('3 Items Selected')).toBeInTheDocument();
    const deselectButton = getByText('Deselect');
    await user.click(deselectButton);
    expect(onSelectionChange).toHaveBeenCalledWith({ values: [], selectedIds: [] });
  });

  it('should render table with client side pagination', async () => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();
    const user = userEvent.setup();
    const { getByLabelText, queryByText, getByRole, getAllByRole } = renderWithTheme(
      <Table
        data={{
          nodes: [...nodes, ...nodes, ...nodes, ...nodes, ...nodes, ...nodes, ...nodes, ...nodes],
        }}
        pagination={
          <TablePagination
            onPageChange={onPageChange}
            defaultPageSize={10}
            onPageSizeChange={onPageSizeChange}
            showPageSizePicker
            showPageNumberSelector
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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
      </Table>,
    );
    const nextPageButton = getByLabelText('Next Page');
    const previousPageButton = getByLabelText('Previous Page');
    const goForward5PagesButton = getByLabelText('Go forward 5 pages');
    // Check if pagination buttons work
    expect(nextPageButton).toBeInTheDocument();
    expect(previousPageButton).toBeInTheDocument();
    expect(goForward5PagesButton).toBeInTheDocument();
    expect(queryByText('klear01')).toBeInTheDocument();
    // Go to next page
    fireEvent.click(nextPageButton);
    expect(queryByText('klear01')).not.toBeInTheDocument();
    expect(queryByText('klear11')).toBeInTheDocument();
    expect(onPageChange).toHaveBeenCalledTimes(1);
    // Go to previous page
    fireEvent.click(previousPageButton);
    expect(queryByText('klear01')).toBeInTheDocument();

    // Check if page size picker works
    const selectInput = getByRole('combobox', { name: 'Select items per page' });
    // 1 header row + 10 body rows + 1 footer row - the footer row is now correctly role="row"
    // too (see the role="rowfooter" bug fix in Table.web.tsx).
    expect(getAllByRole('row')).toHaveLength(12);
    expect(selectInput).toBeInTheDocument();
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    await user.click(getByRole('option', { name: '25' }));
    // 1 header row + 25 body rows + 1 footer row.
    expect(getAllByRole('row')).toHaveLength(27);
    await user.click(goForward5PagesButton);
    expect(onPageChange).toHaveBeenLastCalledWith({ page: 5 });
    const goBack5PagesButton = getByLabelText('Go back 5 pages');
    fireEvent.click(goBack5PagesButton);
    expect(onPageChange).toHaveBeenLastCalledWith({ page: 0 });
  }, 10000);

  it('should render table with server side pagination', () => {
    const ServerPaginatedTable = (): React.ReactElement => {
      const [apiData, setAPIData] = useState({ nodes: nodes.slice(0, 10) });
      const onPageChange = ({ page }: { page: number }): void => {
        setAPIData({ nodes: nodes.slice(page * 10, page * 10 + 10) });
      };

      return (
        <Table
          data={apiData}
          pagination={
            <TablePagination
              onPageChange={onPageChange}
              paginationType="server"
              totalItemCount={nodes.length}
              showPageSizePicker
              showPageNumberSelector
            />
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                    <TableCell>{tableItem.type}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      );
    };
    const { getByLabelText, queryByText } = renderWithTheme(<ServerPaginatedTable />);
    const nextPageButton = getByLabelText('Next Page');
    const previousPageButton = getByLabelText('Previous Page');
    // Check if pagination buttons work
    expect(nextPageButton).toBeInTheDocument();
    expect(previousPageButton).toBeInTheDocument();
    expect(queryByText('klear01')).toBeInTheDocument();
    // Go to next page
    fireEvent.click(nextPageButton);
    expect(queryByText('klear01')).not.toBeInTheDocument();
    expect(queryByText('klear11')).toBeInTheDocument();
    // Go to previous page
    fireEvent.click(previousPageButton);
    expect(queryByText('klear01')).toBeInTheDocument();
  });

  beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
  afterAll(() => jest.restoreAllMocks());

  it('should throw error for missing props in server side pagination', () => {
    const ServerPaginatedTable = (): React.ReactElement => {
      const [apiData] = useState({ nodes: nodes.slice(0, 10) });

      return (
        <Table
          data={apiData}
          pagination={
            // @ts-expect-error onPageChange and totalItemCount are missing intentionally
            <TablePagination paginationType="server" showPageSizePicker showPageNumberSelector />
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow item={tableItem} key={index}>
                    <TableCell>{tableItem.paymentId}</TableCell>
                    <TableCell>{tableItem.amount}</TableCell>
                    <TableCell>{tableItem.status}</TableCell>
                    <TableCell>{tableItem.type}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{tableItem.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      );
    };
    try {
      renderWithTheme(<ServerPaginatedTable />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          '[Klear360: TablePagination]: `onPageChange` and `totalItemCount` props are required when paginationType is server.',
        );
      }
    }
  });
  it('should accept data-analytics-* props', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: nodes.slice(0, 5) }} data-analytics-table="test">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell data-analytics-table-header="table-header-cell-test">
                  Payment ID
                </TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody data-analytics-body="table-body-test">
              {tableData.map((tableItem, index) => (
                <TableRow item={tableItem} key={index} data-analytics-row="table-row-test">
                  <TableCell data-analytics-cell="table-cell-test">{tableItem.paymentId}</TableCell>
                  <TableCell>{tableItem.amount}</TableCell>
                  <TableCell>{tableItem.status}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render virtualized table', () => {
    const ReactVirtualTable = (): React.ReactElement => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [apiData, _] = useState({ nodes: nodes.slice(0, 10) });
      return (
        <Box>
          <Table
            data={apiData}
            onSelectionChange={console.log}
            selectionType="multiple"
            sortFunctions={{
              ID: (array) => array.sort((a, b) => Number(a.id) - Number(b.id)),
              AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
              PAYMENT_ID: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
              STATUS: (array) => array.sort((a, b) => a.status.localeCompare(b.status)),
            }}
            defaultSelectedIds={['1', '3']}
            rowDensity="normal"
            isFirstColumnSticky
            height="500px"
          >
            {() => (
              <TableVirtualizedWrapper>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                    <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                    <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                    <TableHeaderCell headerKey="STATUS">Status </TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody<Item>>
                  {(tableItem, index) => (
                    <TableRow
                      key={index}
                      item={tableItem}
                      onClick={() => {
                        console.log('where');
                      }}
                    >
                      <TableCell>
                        <Code size="medium">{tableItem.paymentId}</Code>
                      </TableCell>
                      <TableEditableCell
                        accessibilityLabel="Amount"
                        placeholder="Enter text"
                        successText="Amount is valid"
                      />

                      <TableCell>{tableItem.method}</TableCell>
                      <TableCell>
                        <Badge
                          size="medium"
                          color={
                            tableItem.status === 'Completed'
                              ? 'positive'
                              : tableItem.status === 'Pending'
                              ? 'notice'
                              : tableItem.status === 'Failed'
                              ? 'negative'
                              : 'primary'
                          }
                        >
                          {tableItem.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableVirtualizedWrapper>
            )}
          </Table>
        </Box>
      );
    };
    const { container } = renderWithTheme(<ReactVirtualTable />);

    expect(container).toMatchSnapshot();
  });

  // Spanning Tests
  it('should render table with row spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableRow key={tableData[0]?.id} item={tableData[0]}>
                <TableCell gridRowStart={2} gridRowEnd={4}>
                  {tableData[0]?.merchant}
                </TableCell>
                <TableCell>{tableData[0]?.method}</TableCell>
                <TableCell>{tableData[0]?.amount}</TableCell>
              </TableRow>
              <TableRow key={tableData[1]?.id} item={tableData[1]}>
                <TableCell>{tableData[1]?.method}</TableCell>
                <TableCell>{tableData[1]?.amount}</TableCell>
              </TableRow>
              <TableRow key={tableData[2]?.id} item={tableData[2]}>
                <TableCell>{tableData[2]?.merchant}</TableCell>
                <TableCell>{tableData[2]?.method}</TableCell>
                <TableCell>{tableData[2]?.amount}</TableCell>
              </TableRow>
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with header spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell gridColumnStart={1} gridColumnEnd={4}>
                  Transaction Details
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with footer spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell gridColumnStart={1} gridColumnEnd={3}>
                  Total Summary
                </TableFooterCell>
                <TableFooterCell>450</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with column spanning', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: spanningNodes }} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableRow item={tableData[0]}>
                <TableCell gridColumnStart={1} gridColumnEnd={4}>
                  Summary Row - Total Items: {tableData.length}
                </TableCell>
              </TableRow>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell>{item.merchant}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  // Grouping Tests
  it('should render table with grouping', () => {
    const { container } = renderWithTheme(
      <Table data={{ nodes: groupedNodes }} isGrouped showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell
                    gridColumnStart={item.treeXLevel === 0 ? 1 : undefined}
                    gridColumnEnd={item.treeXLevel === 0 ? 3 : undefined}
                  >
                    {item.name}
                  </TableCell>
                  {item.treeXLevel !== 0 && <TableCell>{item.amount}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render table with grouping and selection', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { container, getAllByRole } = renderWithTheme(
      <Table
        data={{ nodes: groupedNodes }}
        isGrouped
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        showBorderedCells
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell
                    gridColumnStart={item.treeXLevel === 0 ? 2 : undefined}
                    gridColumnEnd={item.treeXLevel === 0 ? 4 : undefined}
                  >
                    {item.name}
                  </TableCell>
                  {item.treeXLevel !== 0 && <TableCell>{item.amount}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    const checkboxes = getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(6); // Header + 5 rows (2 parents + 3 children)

    // Click parent checkbox - should select parent + children
    await user.click(checkboxes[1]); // First parent group
    expect(onSelectionChange).toHaveBeenCalledWith({
      selectedIds: ['group1', 'child1-1', 'child1-2'],
      values: expect.any(Array),
    });

    expect(container).toMatchSnapshot();
  });

  const renderGroupedTable = (
    props: Pick<
      TableProps<typeof groupedNodes[number]>,
      'selectionType' | 'onSelectionChange' | 'expandedRowIds' | 'onExpandedRowIdsChange'
    > = {},
  ): RenderResult =>
    renderWithTheme(
      <Table data={{ nodes: groupedNodes }} isGrouped {...props}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id} item={item}>
                  <TableCell
                    gridColumnStart={item.treeXLevel === 0 ? 1 : undefined}
                    gridColumnEnd={item.treeXLevel === 0 ? 3 : undefined}
                  >
                    {item.name}
                  </TableCell>
                  {item.treeXLevel !== 0 && <TableCell>{item.amount}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

  it('renders every group expanded by default (uncontrolled, no defaultExpandedRowIds)', () => {
    const { getByText } = renderGroupedTable();

    expect(getByText('Child 1-1')).toBeInTheDocument();
    expect(getByText('Child 1-2')).toBeInTheDocument();
    expect(getByText('Child 2-1')).toBeInTheDocument();
  });

  it('collapses/expands a group on chevron click (uncontrolled)', async () => {
    const user = userEvent.setup();
    const { getByLabelText, queryByText } = renderGroupedTable();

    await user.click(getByLabelText('Collapse row group1'));
    expect(queryByText('Child 1-1')).not.toBeInTheDocument();
    expect(queryByText('Child 1-2')).not.toBeInTheDocument();
    // Untouched group stays expanded.
    expect(queryByText('Child 2-1')).toBeInTheDocument();

    await user.click(getByLabelText('Expand row group1'));
    expect(queryByText('Child 1-1')).toBeInTheDocument();
    expect(queryByText('Child 1-2')).toBeInTheDocument();
  });

  it('supports controlled expandedRowIds via onExpandedRowIdsChange', async () => {
    const onExpandedRowIdsChange = jest.fn();
    const user = userEvent.setup();
    const { getByLabelText, queryByText, rerender } = renderGroupedTable({
      expandedRowIds: ['group1', 'group2'],
      onExpandedRowIdsChange,
    });

    await user.click(getByLabelText('Collapse row group1'));
    expect(onExpandedRowIdsChange).toHaveBeenCalledWith(['group2']);

    // Feeding the callback's value back in as `expandedRowIds` (the expected controlled usage)
    // keeps the table in sync - e.g. across a re-render triggered by new `data`.
    rerender(
      withTheme(
        <Table data={{ nodes: groupedNodes }} isGrouped expandedRowIds={['group2']}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow key={item.id} item={item}>
                    <TableCell
                      gridColumnStart={item.treeXLevel === 0 ? 1 : undefined}
                      gridColumnEnd={item.treeXLevel === 0 ? 3 : undefined}
                    >
                      {item.name}
                    </TableCell>
                    {item.treeXLevel !== 0 && <TableCell>{item.amount}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      ),
    );
    expect(queryByText('Child 1-1')).not.toBeInTheDocument();
  });

  it('does not trigger row selection when clicking the expand chevron', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    const { getByLabelText } = renderGroupedTable({
      selectionType: 'multiple',
      onSelectionChange,
    });

    await user.click(getByLabelText('Collapse row group1'));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  // Nesting Tests
  it('should render table with nested expandable content', () => {
    const { container, getByText } = renderWithTheme(
      <Table data={{ nodes: spanningNodes.slice(0, 2) }}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <>
                  <TableRow key={item.id} item={item}>
                    <TableCell>{item.merchant}</TableCell>
                    <TableCell>{item.method}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                  </TableRow>
                  {item.id === '1' && (
                    <TableRow key={`${item.id}-details`} item={item}>
                      <TableCell gridColumnStart={1} gridColumnEnd={4}>
                        <Box padding="spacing.3" backgroundColor="surface.background.gray.subtle">
                          Expanded details for {item.merchant}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </>
        )}
      </Table>,
    );

    expect(getByText('Expanded details for Flipkart')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  describe('filtering', () => {
    const filterFunctions = {
      STATUS: (item: Item, value: string) =>
        item.status.toLowerCase().includes(value.toLowerCase()),
      NAME: (item: Item, value: string) => item.name.toLowerCase().includes(value.toLowerCase()),
      AMOUNT: (item: Item, value: string) => item.amount.toString().includes(value),
    };

    const renderFilterableTable = (
      extraProps: Partial<Omit<TableProps<Item>, 'children' | 'columns' | 'data'>> = {},
    ): RenderResult =>
      renderWithTheme(
        <Table
          data={{ nodes: nodes.slice(0, 5) }}
          filterFunctions={filterFunctions}
          {...extraProps}
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                  <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow item={item} key={index}>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );

    it('renders a filter input only for columns present in filterFunctions', () => {
      const { getAllByRole, getByRole } = renderWithTheme(
        <Table
          data={{ nodes: nodes.slice(0, 5) }}
          filterFunctions={{ STATUS: filterFunctions.STATUS }}
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                  {/* No headerKey - not filterable, so no filter input for this column. */}
                  <TableHeaderCell>Name</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow item={item} key={index}>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );
      expect(getByRole('textbox', { name: 'Filter by Status' })).toBeInTheDocument();
      // Exactly one filter input rendered - the Name column has no headerKey/filterFunctions
      // entry, so its filter-row cell stays empty (present only to keep grid alignment).
      expect(getAllByRole('textbox')).toHaveLength(1);
    });

    it('does not render a filter row when filterFunctions is not passed', () => {
      const { queryByRole } = renderWithTheme(
        <Table data={{ nodes: nodes.slice(0, 5) }}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow item={item} key={index}>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );
      expect(queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('filters rows by a single column (AND across multiple active column filters)', async () => {
      const user = userEvent.setup();
      const { getByRole, queryByText } = renderFilterableTable();

      await user.type(getByRole('textbox', { name: 'Filter by Status' }), 'pending');
      expect(queryByText('John Doe')).toBeInTheDocument(); // klear01, pending
      expect(queryByText('Jane Doe')).toBeInTheDocument(); // klear02, pending
      expect(queryByText('Alice Smith')).not.toBeInTheDocument(); // klear03, failed
      expect(queryByText('Bob Smith')).not.toBeInTheDocument(); // klear04, completed

      // Adding a second column filter narrows further (AND, not OR).
      await user.type(getByRole('textbox', { name: 'Filter by Name' }), 'jane');
      expect(queryByText('Jane Doe')).toBeInTheDocument();
      expect(queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('global filter matches if any filterable column matches (OR across columns)', async () => {
      const user = userEvent.setup();
      const { getByRole, queryByText } = renderFilterableTable({
        toolbar: (
          <TableToolbar>
            <TableToolbarSearch />
          </TableToolbar>
        ),
      });

      await user.type(getByRole('textbox', { name: 'Search table' }), 'alice');
      expect(queryByText('Alice Smith')).toBeInTheDocument(); // matches NAME
      expect(queryByText('Jane Doe')).not.toBeInTheDocument();
      expect(queryByText('Bob Smith')).not.toBeInTheDocument();
    });

    it('combines column filters (AND) with the global filter (OR across columns)', async () => {
      const user = userEvent.setup();
      const { getByRole, queryByText } = renderFilterableTable({
        toolbar: (
          <TableToolbar>
            <TableToolbarSearch />
          </TableToolbar>
        ),
      });

      await user.type(getByRole('textbox', { name: 'Filter by Status' }), 'pending');
      await user.type(getByRole('textbox', { name: 'Search table' }), 'jane');
      expect(queryByText('Jane Doe')).toBeInTheDocument();
      expect(queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('is a controlled component via columnFilterValues/globalFilterValue', () => {
      const { getByRole, queryByText, rerender } = renderFilterableTable({
        columnFilterValues: { STATUS: 'completed' },
      });
      expect(queryByText('Bob Smith')).toBeInTheDocument(); // completed
      expect(queryByText('Alice Smith')).not.toBeInTheDocument(); // failed

      rerender(
        withTheme(
          <Table
            data={{ nodes: nodes.slice(0, 5) }}
            filterFunctions={filterFunctions}
            columnFilterValues={{ STATUS: 'pending' }}
          >
            {(tableData) => (
              <>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                    <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                    <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, index) => (
                    <TableRow item={item} key={index}>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>,
        ),
      );
      expect(queryByText('John Doe')).toBeInTheDocument(); // now pending
      expect(queryByText('Bob Smith')).not.toBeInTheDocument();
      // Controlled - typing in the (now-uncontrolled-looking) filter input shouldn't be needed;
      // this just confirms the input reflects the controlled value.
      expect(getByRole('textbox', { name: 'Filter by Status' })).toHaveValue('pending');
    });

    it('filtering composes with sorting (filter first, then sort the remaining rows)', async () => {
      const user = userEvent.setup();
      const { getByLabelText, getByRole, getAllByRole } = renderWithTheme(
        <Table
          data={{ nodes: nodes.slice(0, 5) }}
          filterFunctions={filterFunctions}
          sortFunctions={{ AMOUNT: (array) => [...array].sort((a, b) => a.amount - b.amount) }}
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow item={item} key={index}>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );

      await user.type(getByRole('textbox', { name: 'Filter by Status' }), 'pending');
      // Only klear01 (100) and klear02 (240) are "pending" - AMOUNT is the only sortable column.
      fireEvent.click(getByLabelText('Toggle Sort'));

      // Skip the main header row and the filter row - only the 2 filtered body rows remain.
      const rows = getAllByRole('row').slice(2);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toHaveTextContent('100');
      expect(rows[1]).toHaveTextContent('240');
    });

    it('reflects the filtered count in the toolbar and select-all only selects filtered rows', () => {
      const onSelectionChange = jest.fn();
      const { getByRole, getByText, getAllByRole } = renderWithTheme(
        <Table
          data={{ nodes: nodes.slice(0, 5) }}
          filterFunctions={filterFunctions}
          selectionType="multiple"
          onSelectionChange={onSelectionChange}
          toolbar={<TableToolbar />}
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow item={item} key={index}>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>,
      );

      fireEvent.change(getByRole('textbox', { name: 'Filter by Status' }), {
        target: { value: 'pending' },
      });
      // 2 of 5 rows match "pending" (klear01, klear02).
      expect(getByText('Showing 1-2 Items')).toBeInTheDocument();

      // The header "select all" checkbox is the first checkbox in DOM order.
      fireEvent.click(getAllByRole('checkbox')[0]);
      // "Select all" only selects the 2 currently-filtered ("pending") rows, not all 5.
      const [{ selectedIds }] = onSelectionChange.mock.calls.at(-1);
      expect(selectedIds.sort()).toEqual(['1', '2']);
    });
  });
});
