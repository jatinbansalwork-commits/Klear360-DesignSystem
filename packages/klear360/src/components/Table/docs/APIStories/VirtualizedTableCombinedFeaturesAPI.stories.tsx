import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fireEvent } from 'storybook/test';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableRow, TableCell, TableVirtualizedWrapper, TableBody } from '../../TableBody';
import { TableToolbar, TableToolbarSearch } from '../../TableToolbar';
import { TablePagination } from '../../TablePagination';
import { createTransactionTableNodes, formatDate } from '../exampleData';
import type { TransactionTableItem } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';

export default {
  title: 'Components/Table/API/VirtualizedTable (Combined Features)',
  tags: ['autodocs'],
  component: TableVirtualizedWrapper,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="Virtualization combined with every other high-traffic Table feature at once (sticky header, a frozen leading column, column + global filtering, and server-mode pagination), modeled on a ~15-column, 100-rows-per-page dataset (KlearNow's Track & Trace Table). See the Virtualization section of the decisions doc for the measured re-render/FPS budget this combination holds to."
          componentName="TableVirtualizedWrapper"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableVirtualizedWrapper>;

const PAGE_SIZE = 100;
const TOTAL_ROWS = 300;

// A fake "server" - the single source of truth both pagination and filtering query against, the
// same pattern TableFullFeaturedExample.stories.tsx uses, trimmed to just what this story needs
// (one filterable/sortable column) since the point here is proving the FEATURE COMBINATION works,
// not re-demonstrating fake-server wiring that's already covered there.
const ALL_ROWS: TransactionTableItem[] = createTransactionTableNodes(TOTAL_ROWS);

const matchesCompanyName = (item: TransactionTableItem, value: string): boolean =>
  item.companyName.toLowerCase().includes(value.toLowerCase());

const filterFunctions = {
  COMPANY_NAME: (item: TransactionTableItem, value: string) => matchesCompanyName(item, value),
};

const CombinedFeaturesTemplate: StoryFn<typeof TableComponent> = () => {
  // 0-indexed, matching TablePagination's own `currentPage` convention (see
  // TableFullFeaturedExample.stories.tsx, which likewise keeps a 1-indexed page elsewhere and
  // converts at the TablePagination boundary).
  const [page, setPage] = React.useState(0);
  const [globalFilterValue, setGlobalFilterValue] = React.useState('');

  const filteredRows = React.useMemo(
    () =>
      globalFilterValue
        ? ALL_ROWS.filter((item) => matchesCompanyName(item, globalFilterValue))
        : ALL_ROWS,
    [globalFilterValue],
  );

  const pageRows = React.useMemo(
    () => filteredRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filteredRows, page],
  );

  // Changing the filter can leave `page` pointing past the end of the newly-filtered result set -
  // reset to the first page whenever the filter value itself changes, same as a real server-backed
  // list would on a fresh query.
  React.useEffect(() => {
    setPage(0);
  }, [globalFilterValue]);

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="700px">
      <TableComponent
        data={{ nodes: pageRows }}
        height="500px"
        selectionType="multiple"
        isFirstColumnSticky
        filterFunctions={filterFunctions}
        globalFilterValue={globalFilterValue}
        onGlobalFilterValueChange={setGlobalFilterValue}
        toolbar={
          <TableToolbar>
            <TableToolbarSearch placeholder="Search company name" />
          </TableToolbar>
        }
        pagination={
          <TablePagination
            paginationType="server"
            totalItemCount={filteredRows.length}
            currentPage={page}
            // `onPageChange` is called with `{ page }` (0-indexed), not a bare number - see
            // TablePagination.web.tsx's `handlePageChange`.
            onPageChange={({ page: nextPage }) => setPage(nextPage)}
            defaultPageSize={PAGE_SIZE}
            showPageSizePicker={false}
          />
        }
      >
        {() => (
          <TableVirtualizedWrapper>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>CBP Transaction #</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>Transaction State</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Vessel Name</TableHeaderCell>
                <TableHeaderCell>Filing Date</TableHeaderCell>
                <TableHeaderCell>Shipment #</TableHeaderCell>
                <TableHeaderCell>MBL</TableHeaderCell>
                <TableHeaderCell>HBL</TableHeaderCell>
                <TableHeaderCell>Country of Export</TableHeaderCell>
                <TableHeaderCell>Port of Loading</TableHeaderCell>
                <TableHeaderCell>Port of Discharge</TableHeaderCell>
                <TableHeaderCell>Container #</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {(tableItem: TransactionTableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.cbpTransactionNumber}</TableCell>
                  <TableCell>{tableItem.username}</TableCell>
                  <TableCell>{tableItem.transactionState}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableCell>{tableItem.vesselName}</TableCell>
                  <TableCell>{formatDate(tableItem.filingDate)}</TableCell>
                  <TableCell>{tableItem.shipmentNumber}</TableCell>
                  <TableCell>{tableItem.mbl}</TableCell>
                  <TableCell>{tableItem.hbl}</TableCell>
                  <TableCell>{tableItem.countryOfExport}</TableCell>
                  <TableCell>{tableItem.portOfLoading}</TableCell>
                  <TableCell>{tableItem.portOfDischarge}</TableCell>
                  <TableCell>{tableItem.containerNumber}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableVirtualizedWrapper>
        )}
      </TableComponent>
    </Box>
  );
};

export const CombinedFeatures = CombinedFeaturesTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
CombinedFeatures.storyName = 'CombinedFeatures';

/**
 * Exercises the exact combination Track & Trace's invoice/line-item grid needs:
 * multi-select + sticky leading column + sticky header (forced on by virtualization) + a column
 * filter + global search + server-mode pagination, together, at a 100-rows-per-page scale.
 *
 * Verifies (in a real browser, not jsdom - `react-virtualized-auto-sizer`, which the underlying
 * `@table-library/react-table-library/virtualized` depends on for sizing, measures 0x0 in jsdom):
 * 1. The frozen company-name column stays visible (and its sticky background renders) after a
 *    page change - proving sticky-column CSS and the virtualized row list compose correctly.
 * 1b. The frozen column's bounding box stays pinned at the scroll container's left edge *after
 *    actually scrolling the table horizontally* - not just that `position: sticky` is set, but
 *    that it visibly holds position while virtualized rows scroll underneath it.
 * 2. Filtering via global search narrows the visible rows to only matches - proving the column
 *    filter row survives being folded into the virtualized header's sticky overlay.
 * 3. Changing the server-mode page swaps the dataset the virtualized list renders - proving
 *    pagination and virtualization don't conflict (an previously-undocumented combination).
 */
CombinedFeatures.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // `ISF-021D-1` is a unique transaction id (one per row), unlike company name which repeats
  // across ~1/8 of all rows - a safe, specific marker that page 1 (rows 1-100) has mounted.
  await waitFor(() => expect(canvas.getByText('ISF-021D-1')).toBeInTheDocument());

  // 1. Sticky column: the frozen first cell of a mounted row actually gets `position: sticky`
  // (not just the right CSS class/attribute - the real computed style, which only a real browser,
  // not jsdom, can evaluate reliably here).
  const firstCell = canvasElement.querySelector('[data-klear360-component="table-cell"]');
  expect(firstCell).toBeTruthy();
  expect(getComputedStyle(firstCell as Element).position).toBe('sticky');

  // 1b. Scroll the table horizontally and confirm the frozen cell's left edge doesn't move - the
  // nearest scrollable ancestor (scrollWidth > clientWidth) is the virtualized list's own scroll
  // container, since the header/handle/row-mounting all happen inside it (see Table's
  // virtualization decisions doc).
  let scrollContainer: HTMLElement | null = firstCell as HTMLElement;
  while (scrollContainer && scrollContainer.scrollWidth <= scrollContainer.clientWidth) {
    scrollContainer = scrollContainer.parentElement;
  }
  expect(scrollContainer).toBeTruthy();
  const leftBefore = (firstCell as Element).getBoundingClientRect().left;
  scrollContainer!.scrollLeft = 300;
  await waitFor(() => expect(scrollContainer!.scrollLeft).toBeGreaterThan(0));
  const leftAfter = (firstCell as Element).getBoundingClientRect().left;
  expect(leftAfter).toBe(leftBefore);
  scrollContainer!.scrollLeft = 0;

  // 2. Global search narrows the virtualized rows to only matches.
  const searchInput = canvas.getByPlaceholderText('Search company name');
  fireEvent.change(searchInput, { target: { value: 'shenzhen' } });
  await waitFor(() => {
    const rows = canvas.getAllByRole('row').slice(1); // drop the header row
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((row) => {
      expect(within(row).getByText(/shenzhen/i)).toBeInTheDocument();
    });
  });

  // Clear the filter back out before exercising pagination, so page 2 isn't accidentally empty.
  fireEvent.change(searchInput, { target: { value: '' } });
  await waitFor(() => expect(canvas.getByText('ISF-021D-1')).toBeInTheDocument());

  // 3. Server-mode pagination swaps the virtualized dataset without breaking virtualization.
  const nextPageButton = canvas.getByRole('button', { name: /next/i });
  await userEvent.click(nextPageButton);
  await waitFor(() => {
    expect(canvas.getByText('ISF-021D-101')).toBeInTheDocument();
  });
};
