import React, { useEffect, useMemo } from 'react';
// eslint-disable-next-line import/extensions -- @table-library/react-table-library's package.json "exports" map requires the explicit .js extension on this subpath
// eslint-disable-next-line import/extensions -- see above
import { Virtualized } from '@table-library/react-table-library/virtualized.js';
import { useTableRowContext, useTableDataContext } from './TableContext';
import {
  ScopedTableBody,
  StyledCell,
  CellWrapper,
  ScopedTableRow,
} from './tableScopedStyled.web';
import { useTheme } from '~components/Klear360Provider';
import { checkboxCellWidth, classes, tableRow } from './tokens';
import { ComponentIds } from './componentIds';
import type {
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableVirtualizedWrapperProps,
  RowHeightType,
  TableNode,
} from './types';
import { Text } from '~components/Typography';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { IconButton } from '~components/Button/IconButton';
import { ChevronRightIcon } from '~components/Icons';
import { getComponentId } from '~utils/isValidAllowedChildren';
export { StyledCell, CellWrapper };

const _TableBody = <Item,>({ children, ...rest }: TableBodyProps<Item>): React.ReactElement => {
  const { showStripedRows, selectionType } = useTableRowContext();
  const isSelectable = selectionType !== 'none';

  return (
    <ScopedTableBody
      $isSelectable={isSelectable}
      $showStripedRows={Boolean(showStripedRows)}
      $showBorderedCells={true}
      {...metaAttribute({ name: MetaConstants.TableBody })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children as React.ReactNode}
    </ScopedTableBody>
  );
};

const TableBody = assignWithoutSideEffects(_TableBody, {
  displayName: 'TableBody',
  componentId: ComponentIds.TableBody,
});

const ExpandChevron = ({
  isExpanded,
  children,
}: {
  isExpanded: boolean;
  children: React.ReactNode;
}): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{
        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
        transformOrigin: 'center center',
        transitionProperty: 'transform',
        transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
        transitionTimingFunction: castWebType(theme.motion.easing.standard),
      }}
    >
      {children}
    </BaseBox>
  );
};

const _TableCell = ({
  children,
  textAlign,
  _hasPadding,
  _isGroupExpandCell,
  _groupRowId,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  ...rest
}: TableCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const {
    selectionType,
    rowDensity,
    showStripedRows,
    backgroundColor,
    expandedRowIds,
    toggleRowExpansionById,
  } = useTableRowContext();
  const isSelectable = selectionType !== 'none';
  const isExpanded = _groupRowId !== undefined && expandedRowIds.includes(_groupRowId);

  const hasRowSpan = Boolean(gridRowStart && gridRowEnd);
  const gridRowValue = hasRowSpan ? `${gridRowStart} / ${gridRowEnd}` : undefined;

  return (
    <StyledCell
      tabIndex={0}
      role="cell"
      className={hasRowSpan ? classes.HAS_ROW_SPANNING : ''}
      $backgroundColor={backgroundColor}
      gridColumnStart={gridColumnStart}
      gridColumnEnd={gridColumnEnd}
      $gridRow={gridRowValue}
      {...metaAttribute({ name: MetaConstants.TableCell })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox className="cell-wrapper-base" display="flex" alignItems="center" height="100%">
        <CellWrapper
          className="cell-wrapper"
          $rowDensity={rowDensity}
          showStripedRows={showStripedRows}
          display="flex"
          alignItems="center"
          hasPadding={_hasPadding}
          flex={1}
          textAlign={textAlign}
          // when a direct string child is passed we want to disable pointer events
          // for custom cells components, consumers can handle pointer events themselves
          pointerEvents={isChildrenString && isSelectable ? 'none' : 'auto'}
          // allow text to wrap, so that if the <Text> overflows it can truncate
          whiteSpace="normal"
          position="relative"
          {...metaAttribute({ name: MetaConstants.TableCellWrapper })}
        >
          {_isGroupExpandCell && _groupRowId !== undefined ? (
            <BaseBox
              flexShrink={0}
              marginRight="spacing.2"
              pointerEvents="auto"
              onClick={(event: React.MouseEvent) => event.stopPropagation()}
            >
              <ExpandChevron isExpanded={isExpanded}>
                <IconButton
                  size="small"
                  icon={ChevronRightIcon}
                  accessibilityLabel={
                    isExpanded ? `Collapse row ${_groupRowId}` : `Expand row ${_groupRowId}`
                  }
                  onClick={() => toggleRowExpansionById(_groupRowId)}
                />
              </ExpandChevron>
            </BaseBox>
          ) : null}
          {isChildrenString ? (
            <Text color="surface.text.gray.subtle" size="medium" truncateAfterLines={1}>
              {children}
            </Text>
          ) : (
            children
          )}
        </CellWrapper>
      </BaseBox>
    </StyledCell>
  );
};

// Memoized so a TableDataContext change (sort/filter/pagination/tableData) - which this cell
// doesn't read at all - doesn't re-render every mounted cell. Only re-renders when this cell's
// own props change, or when TableRowContext (selection/appearance) changes.
const TableCell = assignWithoutSideEffects(
  (React.memo(_TableCell) as unknown) as typeof _TableCell,
  {
    displayName: 'TableCell',
    componentId: ComponentIds.TableCell,
  },
);

const TableCheckboxCell = ({
  isChecked,
  onChange,
  isDisabled,
  isIndeterminate,
  accessibilityLabel,
}: {
  isChecked: CheckboxProps['isChecked'];
  onChange: CheckboxProps['onChange'];
  isDisabled?: boolean;
  isIndeterminate?: boolean;
  accessibilityLabel: string;
}): React.ReactElement => {
  return (
    <TableCell>
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex={1}
        width={makeSize(checkboxCellWidth)}
        onClick={(e) => {
          /* Make entire 44px checkbox area clickable while preventing row selection */
          if (e.target === e.currentTarget && !isDisabled) {
            onChange?.({ isChecked: !isChecked });
          }
          e.stopPropagation();
        }}
      >
        <Checkbox
          isDisabled={isDisabled}
          isChecked={isChecked}
          onChange={onChange}
          isIndeterminate={isIndeterminate}
          accessibilityLabel={accessibilityLabel}
        />
      </BaseBox>
    </TableCell>
  );
};

const _TableRow = <Item,>({
  children,
  item,
  isDisabled,
  onHover,
  onClick,
  hoverActions,
  testID,
  ...rest
}: TableRowProps<Item>): React.ReactElement => {
  const {
    selectionType,
    selectedRows,
    toggleRowSelectionById,
    setDisabledRows,
    showBorderedCells,
    setHasHoverActions,
    isVirtualized,
    isGrouped,
    multiSelectTrigger,
  } = useTableRowContext();
  const isSelectable = selectionType !== 'none';
  const isMultiSelect = selectionType === 'multiple';
  const isSelected = selectedRows?.includes(item.id);
  const hasHoverActions = Boolean(hoverActions);
  const isGroupHeader =
    isGrouped &&
    (item as { treeXLevel?: number }).treeXLevel === 0 &&
    ((item as { nodes?: unknown[] }).nodes?.length ?? 0) > 0;

  const getGroupSelectionState = useMemo(() => {
    if (!isGroupHeader || !isMultiSelect || !selectedRows) {
      return { isAllSelected: false, isIndeterminate: false };
    }

    const childNodes = (item as { nodes?: string[] }).nodes ?? [];
    if (childNodes.length === 0) {
      return { isAllSelected: false, isIndeterminate: false };
    }

    const selectedChildIds = childNodes.filter((child) => selectedRows.includes(child));
    const selectedCount = selectedChildIds?.length ?? 0;
    const totalCount = childNodes?.length ?? 0;

    const isAllSelected = selectedCount === totalCount;
    const isIndeterminate = selectedCount > 0 && selectedCount < totalCount && !isSelected;

    return { isAllSelected, isIndeterminate };
  }, [isGroupHeader, isMultiSelect, selectedRows, item, isSelected]);

  const { isAllSelected, isIndeterminate } = getGroupSelectionState;

  // Group-header rows get a row-expansion chevron rendered inside their first cell, rather than
  // a dedicated always-present column - this decorates that one child (whichever `TableCell` the
  // consumer authored first) with the private props `TableCell` needs to render it, without
  // consumers having to write any extra JSX themselves (mirrors the existing `getComponentId`
  // child-walking convention used elsewhere in Table).
  const decoratedChildren = useMemo(() => {
    if (!isGroupHeader) return children;
    const childrenArray = React.Children.toArray(children);
    const firstCellIndex = childrenArray.findIndex(
      (child) => getComponentId(child) === ComponentIds.TableCell,
    );
    if (firstCellIndex === -1) return children;
    return childrenArray.map((child, index) =>
      index === firstCellIndex && React.isValidElement(child)
        ? React.cloneElement(child, {
            _isGroupExpandCell: true,
            _groupRowId: item.id,
          } as Partial<TableCellProps>)
        : child,
    );
  }, [children, isGroupHeader, item.id]);

  useEffect(() => {
    if (isDisabled) {
      setDisabledRows((prev) => [...prev, item.id]);
    }
  }, [isDisabled, item.id, setDisabledRows]);

  useIsomorphicLayoutEffect(() => {
    if (hasHoverActions) {
      setHasHoverActions(true);
    }
  }, [hasHoverActions]);

  return (
    <ScopedTableRow
      disabled={isDisabled}
      $isSelectable={isDisabled ? false : isSelectable}
      $isHoverable={isDisabled ? false : Boolean(onHover) || Boolean(onClick)}
      $showBorderedCells={showBorderedCells}
      item={item}
      className={isDisabled ? 'disabled-row' : ''}
      onMouseEnter={() => onHover?.({ item })}
      onClick={() => {
        onClick?.({ item });
        if (selectionType !== 'none' && !isDisabled && multiSelectTrigger !== 'checkbox') {
          toggleRowSelectionById(item.id);
        }
      }}
      {...makeAccessible({ selected: isSelected })}
      {...metaAttribute({ name: MetaConstants.TableRow, testID })}
      {...makeAnalyticsAttribute(rest)}
      $isVirtualized={isVirtualized}
      $isGrouped={isGrouped}
      $isGroupHeader={isGroupHeader}
    >
      {isMultiSelect && (
        <TableCheckboxCell
          isChecked={Boolean(isSelected) || Boolean(isAllSelected)}
          onChange={() => !isDisabled && toggleRowSelectionById(item.id)}
          isDisabled={isDisabled}
          isIndeterminate={isIndeterminate}
          accessibilityLabel={`Select row ${item.id}`}
        />
      )}
      {decoratedChildren}
      {hoverActions ? (
        <TableCell _hasPadding={false}>
          <BaseBox
            className={classes.HOVER_ACTIONS}
            position={{ base: 'relative', m: 'absolute' }}
            top="spacing.0"
            right="spacing.0"
            height="100%"
            flexShrink={0}
            flexGrow={1}
            width="max-content"
          >
            <BaseBox
              className={classes.HOVER_ACTIONS_LAYER2}
              height="100%"
              width="max-content"
              display="flex"
              alignItems="center"
            >
              <BaseBox
                height="100%"
                width="max-content"
                className={classes.HOVER_ACTIONS_LAYER3}
                display="flex"
                alignItems="center"
                paddingLeft={{ base: 'spacing.4', m: 'spacing.6' }}
                paddingRight="spacing.4"
                gap="spacing.3"
              >
                {hoverActions}
              </BaseBox>
            </BaseBox>
          </BaseBox>
        </TableCell>
      ) : null}
    </ScopedTableRow>
  );
};

const _Virtulized = <Item,>({
  headerHeight,
  rowHeight,
  children,
}: TableVirtualizedWrapperProps): React.ReactElement => {
  const [parsedHeader = null, parsedBody = null] = React.Children.toArray(children);
  const { rowDensity } = useTableRowContext();
  const { tableData } = useTableDataContext<Item>();
  const _tableRow = Number(tableRow.minHeight[rowDensity]);

  const _rowHeight = (item: TableNode<Item>, index: number): number => {
    if (index === 0) {
      return headerHeight ?? _tableRow;
    }
    return rowHeight ? rowHeight(item, index - 1) : _tableRow;
  };

  const bodyFunction =
    React.isValidElement(parsedBody) &&
    parsedBody.props &&
    typeof parsedBody.props === 'object' &&
    'children' in parsedBody.props
      ? parsedBody.props.children
      : null;

  return (
    <Virtualized
      tableList={tableData}
      rowHeight={_rowHeight as RowHeightType}
      header={() => parsedHeader}
      body={bodyFunction as (node: TableNode<Item>, index: number) => React.ReactNode}
    />
  );
};

// Memoized (cast through `unknown` to preserve _TableRow's own generic `<Item>` signature -
// React.memo's return type otherwise loses it) so a TableDataContext change - which this row
// doesn't read at all - doesn't re-render every mounted row. Only re-renders when this row's own
// props change, or when TableRowContext (selection/appearance) changes.
const MemoizedTableRow = (React.memo(_TableRow) as unknown) as typeof _TableRow;

const TableRow = assignWithoutSideEffects(MemoizedTableRow, {
  displayName: 'TableRow',
  componentId: ComponentIds.TableRow,
});

const TableVirtualizedWrapper = assignWithoutSideEffects(_Virtulized, {
  displayName: 'TableVirtualizedWrapper',
  componentId: ComponentIds.VirtualizedTable,
});
export { TableBody, TableRow, TableCell, TableVirtualizedWrapper };
