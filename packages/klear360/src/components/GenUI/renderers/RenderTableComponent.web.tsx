/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import { useCopyToClipboard } from '../markdown/useCopyToClipboard';
import { useGenUIAction } from '../GenUIContext';
import { genUISpacingContract } from '../GenUISpacing';
import { getValidFeedbackColor } from '../GenUIComponentTypes';
import type {
  TableCellLink,
  TableCellType,
  TableComponent,
  TableRowAction,
  TableRowActionEvent,
} from '../GenUIComponentTypes';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '~components/Table';
import { Link } from '~components/Link';
import {
  CheckIcon,
  CloseIcon,
  EditIcon,
  TrashIcon,
  DownloadIcon,
  EyeIcon,
  CopyIcon,
} from '~components/Icons';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Amount } from '~components/Amount';
import { Indicator } from '~components/Indicator';
import { Badge } from '~components/Badge';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

// Primitive copy button — just the icon + tooltip, no text label.
// Compose this inside any cell that needs copy behaviour.
const Copyable = ({ value }: { value?: string }) => {
  const { copied, handleCopy } = useCopyToClipboard(value ?? '');

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy'} placement="top">
      <TooltipInteractiveWrapper>
        <IconButton
          icon={CopyIcon}
          size="medium"
          emphasis="intense"
          accessibilityLabel={`Copy ${value}`}
          onClick={handleCopy}
        />
      </TooltipInteractiveWrapper>
    </Tooltip>
  );
};

// Text + copy icon
const CopyableText = ({ value }: { value?: string }) => (
  <Box display="flex" alignItems="center" gap="spacing.2">
    <Text size="medium">{value ?? '-'}</Text>
    <Copyable value={value} />
  </Box>
);

// Table cell link renderer - fires action for consumer to handle
const TableCellLinkRenderer = ({ cell }: { cell?: Partial<TableCellLink> }) => {
  const onActionClick = useGenUIAction();

  const linkNode = cell?.action ? (
    <Link
      variant="button"
      onClick={() => {
        if (onActionClick && cell.action) {
          onActionClick(cell.action);
        }
      }}
    >
      {cell.text ?? ''}
    </Link>
  ) : (
    <Text size="medium">{cell?.text}</Text>
  );

  if (cell?.copyable && cell?.text) {
    return (
      <Box display="flex" alignItems="center" gap="spacing.2">
        {linkNode}
        <Copyable value={cell.text} />
      </Box>
    );
  }

  return linkNode;
};

// Helper to render a single table cell based on its component type
const RenderTableCellContent = ({ cell }: { cell?: Partial<TableCellType> }) => {
  if (!cell) {
    return <Text size="medium">-</Text>;
  }

  // Handle incomplete cell object during streaming
  if (!cell.component) {
    return <Text size="medium">-</Text>;
  }

  // Handle component-based cell types
  switch (cell.component) {
    case 'TEXT': {
      if (cell.copyable && cell.value) {
        return <CopyableText value={cell.value} />;
      }
      return <Text size="medium">{cell.value ?? '-'}</Text>;
    }

    case 'AMOUNT': {
      const currency = cell.currency || 'INR';
      // Ensure value is a valid number (handle streaming where value might be string/undefined)
      const numValue = typeof cell.value === 'string' ? parseFloat(cell.value) : cell.value;
      if (typeof numValue !== 'number' || isNaN(numValue)) {
        return <Text size="medium">-</Text>;
      }
      return <Amount value={numValue} currency={currency as 'INR' | 'MYR'} size="medium" />;
    }

    case 'INDICATOR': {
      // Handle streaming where value might be incomplete
      if (!cell.value) {
        return <Text size="medium">-</Text>;
      }
      const indicatorColor = getValidFeedbackColor(cell.color, 'neutral');
      return (
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Indicator accessibilityLabel={cell.value} color={indicatorColor} />
          <Text size="medium">{cell.value}</Text>
        </Box>
      );
    }

    case 'BADGE': {
      const badgeColor = getValidFeedbackColor(cell.color, 'neutral');
      return (
        <Badge color={badgeColor} emphasis="subtle">
          {cell.value || '-'}
        </Badge>
      );
    }

    case 'DATE': {
      // Handle streaming where value might be incomplete
      if (!cell.value) {
        return <Text size="medium">-</Text>;
      }

      // Parse the date value using dayjs
      const dateValue = dayjs(cell.value);

      // Check if date is valid
      if (!dateValue.isValid()) {
        return <Text size="medium">{cell.value}</Text>;
      }

      // Use custom dateFormat if provided, otherwise use default
      // Format tokens: https://day.js.org/docs/en/display/format
      const defaultFormat = 'DD MMM YYYY, HH:mm';
      const formatted = dateValue.format(cell.dateFormat || defaultFormat);

      return <Text size="medium">{formatted}</Text>;
    }

    case 'LINK': {
      // Handle streaming where text might be incomplete
      if (!cell.text) {
        return <Text size="medium">-</Text>;
      }

      return <TableCellLinkRenderer cell={cell} />;
    }

    default:
      // Handle unknown component types during streaming
      return <Text size="medium">{String((cell as { value?: string }).value || '-')}</Text>;
  }
};

// Icon mapping for row actions
const rowActionIconMap = {
  check: CheckIcon,
  close: CloseIcon,
  edit: EditIcon,
  delete: TrashIcon,
  download: DownloadIcon,
  view: EyeIcon,
  copy: CopyIcon,
} as const;

// Separate component for table row hover actions to avoid render issues
const TableRowHoverActions = ({
  rowActions,
  rowIndex,
  rowData,
}: {
  rowActions: TableRowAction[];
  rowIndex: number;
  rowData: TableCellType[];
}) => {
  const onActionClick = useGenUIAction();

  const createActionEvent = (eventName: string): TableRowActionEvent => ({
    type: 'TABLE_ROW_ACTION',
    eventName,
    data: {
      rowIndex,
      rowData,
    },
  });

  return (
    <>
      {rowActions.map((rowAction, index) => {
        // Guard: Skip incomplete button actions during streaming
        if (rowAction.type === 'BUTTON') {
          if (!rowAction.text) return null;
          return (
            <Button
              key={index}
              variant="tertiary"
              size="xsmall"
              onClick={() => {
                if (rowAction.action?.eventName && onActionClick) {
                  onActionClick(createActionEvent(rowAction.action.eventName));
                }
              }}
            >
              {rowAction.text}
            </Button>
          );
        }

        // Guard: Skip incomplete icon button actions during streaming
        if (rowAction.type === 'ICON_BUTTON') {
          const IconComponent = rowAction.icon ? rowActionIconMap[rowAction.icon] : null;
          if (!IconComponent || !rowAction.accessibilityLabel) return null;
          return (
            <IconButton
              key={index}
              icon={IconComponent}
              size="medium"
              emphasis="intense"
              accessibilityLabel={rowAction.accessibilityLabel}
              onClick={() => {
                if (rowAction.action?.eventName && onActionClick) {
                  onActionClick(createActionEvent(rowAction.action.eventName));
                }
              }}
            />
          );
        }

        return null;
      })}
    </>
  );
};

// Produces column widths using minmax(max-content, 1fr) so columns:
// 1. Never shrink below their content width (no text wrapping)
// 2. Expand proportionally to fill available width when space permits
const calculateColumnWidths = (headers: string[], _rows: Partial<TableCellType>[][]): string[] => {
  return headers.map(() => 'minmax(max-content, 1fr)');
};

const RenderTableComponent = memo(({ headers, rows, rowActions }: TableComponent) => {
  const columnWidths = useMemo(
    () => (headers && rows ? calculateColumnWidths(headers, rows) : []),
    [headers, rows],
  );

  if (!headers || !rows || headers.length === 0 || rows.length === 0) {
    return null;
  }

  // Transform rows into table data format with id
  const tableData = {
    nodes: rows.map((row, index) => ({
      id: `row-${index}`,
      cells: row,
    })),
  };

  return (
    <Box display="flex" flexDirection="column" gap={genUISpacingContract.compactCardRowGap}>
      <Table
        data={tableData}
        backgroundColor="transparent"
        rowDensity="compact"
        gridTemplateColumns={columnWidths.join(' ')}
      >
        {(data) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {headers.map((header, index) => (
                  <TableHeaderCell key={index}>{header}</TableHeaderCell>
                ))}
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  item={item}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onHover={rowActions && rowActions.length > 0 ? () => {} : undefined}
                  hoverActions={
                    rowActions && rowActions.length > 0 ? (
                      <TableRowHoverActions
                        rowActions={rowActions}
                        rowIndex={rowIndex}
                        rowData={item.cells}
                      />
                    ) : undefined
                  }
                >
                  {item.cells.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <RenderTableCellContent cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
});

export { RenderTableComponent };
