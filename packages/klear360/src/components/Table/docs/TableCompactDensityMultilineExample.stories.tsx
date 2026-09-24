import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Compact Density Multiline',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const multilineExampleData = createTransactionTableData(5);

const baseColumns: TableColumnConfig<TransactionTableItem>[] = [
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
    width: '160px',
  },
  {
    key: 'companyName',
    header: 'Company Name',
    render: (item) => item.companyName,
    width: '220px',
  },
];

/**
 * `rowDensity="compact"` sizes a row via `minHeight: 36px` plus `alignItems: center` alone -
 * `TableCell` has no `paddingTop`/`paddingBottom` of its own at any density (`tableRow` in
 * `tokens.ts` only defines `paddingLeft`/`paddingRight`, both constant across densities, and a
 * per-density `minHeight`; there's no vertical-padding token at all). For single-line content
 * that's invisible: whatever's shorter than 36px just gets centered with the leftover `minHeight`
 * space as free breathing room on both sides.
 *
 * That stops being free the moment a cell's content is *taller* than 36px, which two stacked
 * `Badge`s (`Box display="flex" flexDirection="column" gap="spacing.4"`, no padding of its own)
 * easily are. The row's grid track isn't clipped to `minHeight` - it grows to fit the taller
 * content (confirmed elsewhere in this doc set, e.g. the Empty States example's spanning row;
 * measured here at 45px instead of the base 36px) - but since there's *no* padding to grow into,
 * the grown row's border sits almost exactly at the content's own edges: ~1.5px above the first
 * badge, ~2.5px below the second (measured via `getBoundingClientRect`), versus the
 * `spacing.4`/12px this table already uses for horizontal cell padding. A single line of text or
 * one badge never shows this, since it fits inside 36px with real slack to spare.
 *
 * **This is confirmed as a real gap, not intentional behavior** (see the row-density decisions
 * doc for the full writeup) - `TableCell` was never designed with multi-line/stacked content in
 * mind at all, at any density, and compact is simply where the lack of vertical padding becomes
 * visible soonest, since its `minHeight` leaves the least slack before content exceeds it. Normal
 * (48px) and comfortable (60px) have the identical zero-padding root cause; they just tolerate
 * more before it shows.
 */
export const CompactDensityMultilineGap = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    ...baseColumns,
    {
      key: 'transactionState',
      header: 'Status (2 badges, no extra padding)',
      render: (item) => (
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Badge size="small" color={getTransactionStateColor(item.transactionState)}>
            {item.transactionState}
          </Badge>
          <Badge size="small" color="neutral">
            Under Review
          </Badge>
        </Box>
      ),
      width: '200px',
    },
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="300px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Compact Density Multiline (The Gap)</Heading>
        <Text>
          Two stacked `Badge`s at `rowDensity=&quot;compact&quot;`, with no padding added by either
          the cell or the content - they touch the row&apos;s top/bottom border directly. Compare to
          `CompactDensityMultilineRecipe` below.
        </Text>
      </Box>
      <Table data={multilineExampleData} columns={columns} rowDensity="compact" />
    </Box>
  );
};

/**
 * The recommended fix for this today: the *consumer* adds their own vertical padding to the
 * content they render into the cell - here, `paddingY="spacing.2"` on the wrapping `Box` around
 * the stacked badges - rather than changing `TableCell`/`rowDensity` itself. See the row-density
 * decisions doc for why a shared minimum padding was rejected in favor of this recipe.
 *
 * For the common single-title-plus-single-description-line shape specifically (not two stacked
 * badges like this story, but close), `TableTitleDescriptionCell`
 * (`TableTitleDescriptionExample.stories.tsx`) bakes this exact recipe in, so most consumers
 * won't need to hand-roll it at all.
 */
export const CompactDensityMultilineRecipe = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    ...baseColumns,
    {
      key: 'transactionState',
      header: 'Status (2 badges, paddingY="spacing.2")',
      render: (item) => (
        <Box display="flex" flexDirection="column" gap="spacing.1" paddingY="spacing.2">
          <Badge size="small" color={getTransactionStateColor(item.transactionState)}>
            {item.transactionState}
          </Badge>
          <Badge size="small" color="neutral">
            Under Review
          </Badge>
        </Box>
      ),
      width: '200px',
    },
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="300px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Compact Density Multiline (The Recipe)</Heading>
        <Text>
          Same two stacked badges, same `rowDensity=&quot;compact&quot;` - the only change is
          `paddingY=&quot;spacing.2&quot;` on the `Box` wrapping them, added by the consumer inside
          `render`. Still visibly denser than `normal`/`comfortable` (that&apos;s the point of
          choosing compact), just no longer touching the row border.
        </Text>
      </Box>
      <Table data={multilineExampleData} columns={columns} rowDensity="compact" />
    </Box>
  );
};

/**
 * A separate, unrelated trap at `rowDensity="compact"` (not about padding this time): `Badge`
 * `size="xsmall"`/`size="small"` render their label at 10px (`Text` `variant="body"
 * size="xsmall"`) - smaller than the 12px `Text` `size="small"` the `Notes` column next to it
 * uses. Reaching for the smallest `Badge` size can feel like it matches a compact row, but it
 * doesn't need to, and it makes the status column read *less* prominent than the plain text
 * beside it - backwards for something meant to draw the eye. See the Badge decisions doc
 * (`Recommended minimum size inside table cells`) for the full writeup.
 */
export const CompactDensityBadgeSizeMismatch = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    ...baseColumns,
    {
      key: 'transactionState',
      header: 'Status (Badge size="small", 10px)',
      render: (item) => (
        <Badge size="small" color={getTransactionStateColor(item.transactionState)}>
          {item.transactionState}
        </Badge>
      ),
      width: '220px',
    },
    {
      key: 'notes',
      header: 'Notes (Text size="small", 12px)',
      render: () => <Text size="small">Reviewed by compliance</Text>,
      width: '220px',
    },
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="300px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Compact Density Badge Size (The Mismatch)</Heading>
        <Text>
          `Badge size=&quot;small&quot;` next to plain `Text size=&quot;small&quot;` - the badge
          label reads visibly smaller than the notes beside it, even though both say
          &quot;small&quot;. Compare to `CompactDensityBadgeSizeRecipe` below.
        </Text>
      </Box>
      <Table data={multilineExampleData} columns={columns} rowDensity="compact" />
    </Box>
  );
};

/**
 * The recommended fix: use `Badge`'s own default, `size="medium"` (12px text, matching the `Text
 * size="small"` next to it), instead of reaching for `size="small"`/`size="xsmall"` to visually
 * match the compact row. `Badge`'s `size="medium"` is only 20px tall (`badgeHeight.medium`), which
 * still fits comfortably inside a 36px compact row - there's no space actually saved by sizing the
 * badge down, only readability lost.
 */
export const CompactDensityBadgeSizeRecipe = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    ...baseColumns,
    {
      key: 'transactionState',
      header: 'Status (Badge size="medium", 12px)',
      render: (item) => (
        <Badge size="medium" color={getTransactionStateColor(item.transactionState)}>
          {item.transactionState}
        </Badge>
      ),
      width: '220px',
    },
    {
      key: 'notes',
      header: 'Notes (Text size="small", 12px)',
      render: () => <Text size="small">Reviewed by compliance</Text>,
      width: '220px',
    },
  ];

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="300px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Compact Density Badge Size (The Recipe)</Heading>
        <Text>
          Same row, same `rowDensity=&quot;compact&quot;` - only the `Badge`&apos;s `size` changed,
          from `&quot;small&quot;` to `&quot;medium&quot;` (Badge&apos;s own default). Now both
          columns read at the same 12px, and the 20px-tall badge still fits the compact row with
          room to spare.
        </Text>
      </Box>
      <Table data={multilineExampleData} columns={columns} rowDensity="compact" />
    </Box>
  );
};

export default TableMeta;
