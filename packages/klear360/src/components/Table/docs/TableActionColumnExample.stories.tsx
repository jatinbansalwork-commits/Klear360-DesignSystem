import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Table } from '../../Table';
import type { TableColumnConfig } from '../types';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { IconButton } from '~components/Button/IconButton';
import { EyeIcon, EditIcon, FileTextIcon } from '~components/Icons';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Action Column',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const actionColumnExampleData = createTransactionTableData(6);

const baseColumns: TableColumnConfig<TransactionTableItem>[] = [
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
  },
  {
    key: 'companyName',
    header: 'Company Name',
    render: (item) => item.companyName,
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
  {
    key: 'etd',
    header: 'ETD',
    render: (item) => formatDate(item.etd),
    width: '130px',
  },
];

/**
 * A narrow single-icon action column (view-details) built via the declarative `columns` config,
 * centered using `TableColumnConfig`'s `textAlign` field.
 *
 * Until now, `TableColumnConfig` had no `textAlign` - a real gap, since the primitives it builds
 * on top of (`TableHeaderCell`/`TableCell`) already accept `textAlign="left" | "center" | "right"`
 * when hand-written via the `children` render-prop API. `columns` just never threaded it through.
 *
 * Evaluated adding `textAlign` to `TableColumnConfig` vs. only documenting a Box-wrapping
 * workaround, and added it: this introduces no new alignment concept (it already exists one layer
 * down, on the cells themselves), it's a fully optional/backward-compatible field, and the
 * alternative would have meant every consumer with a narrow icon/action column hand-rolling the
 * same one-line centering wrapper indefinitely, for something already modeled as first-class
 * elsewhere in this same component. See `ActionColumnWithMultipleIcons` below for the case
 * `textAlign` alone doesn't cover, where a Box wrapper is still the right tool.
 *
 * `isHighlighted` on the `IconButton` below isn't just the hover/focus background - without it
 * (or `emphasis="moderate"`), `IconButton` applies no `width`/`height` at all, so its clickable
 * area shrinks to the icon glyph's own size (12x12px at `size="small"`), under WCAG 2.2's 24x24px
 * minimum target size (SC 2.5.8). An action column is exactly where this is easiest to miss - a
 * narrow, icon-only cell with no surrounding control to accidentally provide the hit box some
 * other way - which is why every `IconButton` in this file sets it. `IconButton` also warns about
 * this itself in development when the combination is missing; see its own Storybook page
 * ("Touch Target Size (Accessibility)") for the full explanation.
 */
export const NarrowActionColumn = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <IconButton
          isHighlighted
          icon={EyeIcon}
          size="small"
          accessibilityLabel={`View ${item.transactionId}`}
          onClick={() => action('onView')(item.transactionId)}
        />
      ),
      width: '72px',
      textAlign: 'center',
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
        <Heading>Narrow Action Column</Heading>
        <Text>
          `textAlign: &apos;center&apos;` on the `actions` column centers both its header label and
          the icon button in every row, without touching `render`&apos;s own markup.
        </Text>
      </Box>
      <Table data={actionColumnExampleData} columns={columns} />
    </Box>
  );
};

/**
 * `textAlign` centers a column uniformly - it has no notion of *spacing between* multiple pieces
 * of content, so a row of several action icons (rather than one) still needs its own wrapper:
 * `Box` with `display="flex"`, `justifyContent="center"`, and a `gap`, exactly as this column's
 * `render` used to be the only way to center anything before `textAlign` existed. Reach for this
 * whenever a column needs alignment *plus* layout `textAlign` doesn't model - custom gap,
 * icon-and-label combinations, or alignment that depends on the row's own data.
 */
export const ActionColumnWithMultipleIcons = (): React.ReactElement => {
  const columns: TableColumnConfig<TransactionTableItem>[] = [
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Box display="flex" justifyContent="center" gap="spacing.3">
          <IconButton
            isHighlighted
            icon={EyeIcon}
            size="small"
            accessibilityLabel={`View ${item.transactionId}`}
          />
          <IconButton
            isHighlighted
            icon={EditIcon}
            size="small"
            accessibilityLabel={`Edit ${item.transactionId}`}
          />
          <IconButton
            isHighlighted
            icon={FileTextIcon}
            size="small"
            accessibilityLabel={`View documents for ${item.transactionId}`}
          />
        </Box>
      ),
      width: '120px',
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
        <Heading>Action Column With Multiple Icons</Heading>
        <Text>
          Three actions per row need a `gap` between them, not just alignment - `textAlign` on its
          own can&apos;t express that, so `render` wraps them in a centering `Box` instead. (The
          header label is left as-is here; add `textAlign: &apos;center&apos;` too if it should
          match.)
        </Text>
      </Box>
      <Table data={actionColumnExampleData} columns={columns} />
    </Box>
  );
};

export default TableMeta;
