/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Body, Row, Cell, Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table.js';
import { Footer, FooterRow, FooterCell } from '@table-library/react-table-library/table.js';
import { Table as ReactTableLib } from '@table-library/react-table-library/table.js';
import { useTableRowContext } from './TableContext';
import { tableRow, tableHeader, tableFooter } from './tokens';
import type {
  TableBackgroundColors,
  TableCellProps,
  TableProps,
  TableToolbarPlacement,
} from './types';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import { getTableActionsHoverStyles, getTableRowBackgroundTransition } from './utils';
import { getTableBodyStyles } from './commonStyles';
import getIn from '~utils/lodashButBetter/get';
import { getMediaQuery, makeMotionTime, makeSize, makeSpace } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import type { Theme } from '~components/Klear360Provider';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { size } from '~tokens/global';
import { ScopedRuntimeStyles, useStableScopeClass } from '~utils/web/scopedCssFromObject';

type ScopedProps<P> = P & { className?: string };

function withScopedTableStyles<P extends { className?: string }>(
  Component: React.ComponentType<P>,
  getStyleObject: (args: {
    theme: Theme;
    props: P;
    rowContext?: ReturnType<typeof useTableRowContext>;
  }) => Record<string, unknown>,
  options?: { useRowContext?: boolean },
): React.FC<P> {
  const Wrapped = (props: P): React.ReactElement => {
    const { theme } = useTheme();
    const rowContext = options?.useRowContext ? useTableRowContext() : undefined;
    const scopeClass = useStableScopeClass('tbl');
    const styleObject = React.useMemo(
      () => getStyleObject({ theme, props, rowContext }),
      [theme, props, rowContext],
    );

    return (
      <>
        <ScopedRuntimeStyles scopeClass={scopeClass} styleObject={styleObject} />
        <Component
          {...props}
          className={[scopeClass, props.className].filter(Boolean).join(' ')}
        />
      </>
    );
  };
  Wrapped.displayName = `Scoped(${Component.displayName ?? 'Component'})`;
  return Wrapped;
}

type TableBodyStyledProps = ScopedProps<{
  $isSelectable: boolean;
  $showStripedRows: boolean;
  children?: React.ReactNode;
}> &
  Record<string, unknown>;

const ScopedTableBody = withScopedTableStyles(
  Body as React.ComponentType<TableBodyStyledProps>,
  ({ theme, props }) => ({
    '&&&': {
      border: 'none',
      transition: getTableRowBackgroundTransition(theme),
      '& tr:last-child .cell-wrapper': { borderBottom: 'none' },
      ...getTableBodyStyles({
        addCommonStyles: true,
        theme,
        isSelectable: props.$isSelectable,
        showStripedRows: props.$showStripedRows,
        isVirtualized: false,
      }),
    },
  }),
);

type StyledCellProps = ScopedProps<{
  $backgroundColor: TableBackgroundColorProp;
  $gridRow?: string;
  children?: React.ReactNode;
}> &
  Record<string, unknown>;

const StyledCell = withScopedTableStyles(Cell as React.ComponentType<StyledCellProps>, ({ theme, props }) => ({
  '&&&': {
    height: '100%',
    backgroundColor: getIn(theme.colors, props.$backgroundColor),
    gridRow: props.$gridRow,
    '& > div:first-child': { alignSelf: 'stretch' },
    '&:focus-visible': { ...getFocusRingStyles({ theme, negativeOffset: true }) },
  },
}));

type CellWrapperProps = BaseBoxProps & {
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  showStripedRows?: boolean;
  hasPadding?: boolean;
  textAlign?: TableCellProps['textAlign'];
};

const CellWrapperInner = ({
  $rowDensity,
  showStripedRows,
  hasPadding = true,
  textAlign,
  className,
  ...rest
}: CellWrapperProps): React.ReactElement => {
  const { theme } = useTheme();
  const scopeClass = useStableScopeClass('tblcw');
  const styleObject = React.useMemo(() => {
    const rowBackgroundTransition = `background-color ${makeMotionTime(
      getIn(theme.motion, tableRow.backgroundColorMotionDuration),
    )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`;

    return {
      '&&&': {
        transition: rowBackgroundTransition,
        backgroundColor: tableRow.nonStripeWrapper.backgroundColor,
        paddingLeft: hasPadding ? makeSpace(getIn(theme, tableRow.paddingLeft[$rowDensity])) : '0px',
        paddingRight: hasPadding
          ? makeSpace(getIn(theme, tableRow.paddingRight[$rowDensity]))
          : '0px',
        minHeight: makeSize(getIn(size, tableRow.minHeight[$rowDensity])),
        height: '100%',
        width: '100%',
        justifyContent: textAlign,
        ...(!showStripedRows && {
          borderBottomWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderBottomColor: getIn(theme.colors, tableRow.borderColor),
          borderBottomStyle: 'solid',
        }),
      },
    };
  }, [theme, $rowDensity, showStripedRows, hasPadding, textAlign]);

  return (
    <>
      <ScopedRuntimeStyles scopeClass={scopeClass} styleObject={styleObject} />
      <BaseBox {...rest} className={[scopeClass, className].filter(Boolean).join(' ')} />
    </>
  );
};

const CellWrapper = CellWrapperInner;

type StyledRowProps = ScopedProps<{
  $isSelectable: boolean;
  $isHoverable: boolean;
  $showBorderedCells: boolean;
  $isGrouped: boolean;
  $isGroupHeader: boolean;
  children?: React.ReactNode;
}> &
  Record<string, unknown>;

const ScopedTableRow = withScopedTableStyles(
  Row as unknown as React.ComponentType<StyledRowProps>,
  ({ theme, props, rowContext }) => {
    const { hasHoverActions, checkboxDisplay, selectionType } = rowContext ?? {
      hasHoverActions: false,
      checkboxDisplay: undefined,
      selectionType: 'none',
    };

    const rowBackgroundTransition = `background-color ${makeMotionTime(
      getIn(theme.motion, tableRow.backgroundColorMotionDuration),
    )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`;

    return {
      '&&&': {
        backgroundColor: 'transparent',
        '& .cell-wrapper': props.$showBorderedCells
          ? {
              borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
              borderRightStyle: 'solid',
              borderRightColor: getIn(theme.colors, tableRow.borderColor),
            }
          : undefined,
        '& td:last-child .cell-wrapper': { borderRight: 'none' },
        ...(hasHoverActions
          ? {
              [`@media ${getMediaQuery({ min: theme.breakpoints.m })}`]: {
                '& td:last-child': {
                  opacity: 0,
                  position: 'sticky',
                  zIndex: 2,
                  right: 0,
                  width: '0px',
                  '& > div:first-child': { overflow: 'visible' },
                },
                '& td:last-child:focus-within': {
                  opacity: 1,
                  ...getTableActionsHoverStyles({
                    theme,
                    hoverColor: tableRow.nonStripe.backgroundColor,
                  }),
                },
                '&:hover td:last-child': { opacity: 1 },
              },
            }
          : {}),
        ...((props.$isHoverable || props.$isSelectable) && {
          '&:hover:not(.disabled-row) .cell-wrapper-base': {
            transition: rowBackgroundTransition,
            cursor: 'pointer',
            backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorHover),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.nonStripe.backgroundColorHover,
              theme,
            }),
          },
        }),
        ...(props.$isSelectable && {
          '&:focus:not(.disabled-row) .cell-wrapper-base': {
            transition: rowBackgroundTransition,
            backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorFocus),
            cursor: 'pointer',
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.nonStripe.backgroundColorFocus,
              backgroundGradientColor: tableRow.nonStripe.backgroundColorHover,
              theme,
            }),
          },
          '&:active:not(.disabled-row) .cell-wrapper-base': {
            transition: rowBackgroundTransition,
            backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorActive),
            cursor: 'pointer',
          },
        }),
        '&:focus': getFocusRingStyles({ theme, negativeOffset: true }),
        ...(props.$isGroupHeader && {
          '& td': {
            backgroundColor: getIn(theme.colors, tableRow.groupHeaderBackgroundColor),
          },
        }),
        ...(props.$isGrouped && {
          '& .cell-wrapper': { border: 'none' },
        }),
        ...(checkboxDisplay === 'on-hover' &&
          selectionType === 'multiple' && {
            '& td:first-child .cell-wrapper > *': {
              opacity: 0,
              transition: `opacity ${makeMotionTime(
                getIn(theme.motion, tableRow.backgroundColorMotionDuration),
              )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`,
            },
            '&:hover td:first-child .cell-wrapper > *': { opacity: 1 },
            '&:focus td:first-child .cell-wrapper > *': { opacity: 1 },
            '&.row-select-selected td:first-child .cell-wrapper > *': { opacity: 1 },
          }),
      },
    };
  },
  { useRowContext: true },
);

type EditableStyledCellProps = StyledCellProps & {
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
};

const EditableStyledCell = withScopedTableStyles(
  Cell as React.ComponentType<EditableStyledCellProps>,
  ({ theme, props }) => ({
    '&&&': {
      height: '100%',
      backgroundColor: getIn(theme.colors, props.$backgroundColor),
      gridRow: props.$gridRow,
      '& > div:first-child': { alignSelf: 'stretch' },
      '&:focus-visible': getFocusRingStyles({ theme, negativeOffset: true }),
      '&:focus-within': {
        ...(props.$rowDensity !== 'comfortable'
          ? getFocusRingStyles({ theme, negativeOffset: true })
          : {}),
      },
    },
  }),
);

type ScopedHeaderProps = ScopedProps<{ $tableToolbarPlacement: TableToolbarPlacement }> &
  Record<string, unknown>;

const ScopedTableHeader = withScopedTableStyles(
  Header as unknown as React.ComponentType<ScopedHeaderProps>,
  ({ props }) => ({
    '&&&': {
      '& tr:first-child th': { borderTop: 'none' },
      display: props.$tableToolbarPlacement === 'overlay' ? 'none' : undefined,
    },
  }),
);

type TableBackgroundColorProp = TableBackgroundColors | 'transparent';

type StyledFilterHeaderCellProps = ScopedProps<{
  $backgroundColor: TableBackgroundColorProp;
  $stickyTopOffsetPx?: number;
}> &
  Record<string, unknown>;

const StyledFilterHeaderCell = withScopedTableStyles(
  HeaderCell as React.ComponentType<StyledFilterHeaderCellProps>,
  ({ theme, props }) => ({
    '&&&': {
      ...(props.$stickyTopOffsetPx ? { top: `${props.$stickyTopOffsetPx}px` } : {}),
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      backgroundColor: getIn(theme.colors, props.$backgroundColor),
      borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
      borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
      borderBottomStyle: 'solid',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: makeSpace(getIn(theme.spacing, '2')),
      paddingBottom: makeSpace(getIn(theme.spacing, '2')),
      '&:focus-within': getFocusRingStyles({ theme, negativeOffset: true }),
    },
  }),
);

type StyledHeaderRowProps = ScopedProps<{
  $showBorderedCells: boolean;
  $gridTemplateColumns: string | undefined;
  $hasHoverActions: boolean;
  $selectionType: TableProps<unknown>['selectionType'];
  $columnCount: number;
  $isVirtualized?: boolean;
}> &
  Record<string, unknown>;

const StyledHeaderRow = withScopedTableStyles(
  HeaderRow as unknown as React.ComponentType<StyledHeaderRowProps>,
  ({ theme, props }) => ({
    '& th': props.$showBorderedCells
      ? {
          borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderRightColor: getIn(theme.colors, tableRow.borderColor),
          borderRightStyle: 'solid',
          ...(props.$isVirtualized && {
            display: 'grid',
            gridTemplateColumns: `${
              props.$gridTemplateColumns
                ? `${props.$gridTemplateColumns} ${props.$hasHoverActions ? 'min-content' : ''}`
                : ` ${
                    props.$selectionType === 'multiple' ? 'min-content' : ''
                  } repeat(${props.$columnCount},minmax(100px, 1fr)) ${
                    props.$hasHoverActions ? 'min-content' : ''
                  }`
            } !important`,
          }),
        }
      : undefined,
    '& th:last-child ': { borderRight: 'none' },
  }),
);

type StyledHeaderCellProps = ScopedProps<{
  $isSortable: boolean;
  $backgroundColor: TableBackgroundColorProp;
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  $hasPadding: boolean;
  $textAlign?: 'left' | 'center' | 'right';
  $gridRow?: string;
  $stickyTopOffsetPx?: number;
}> &
  Record<string, unknown>;

const StyledHeaderCell = withScopedTableStyles(
  HeaderCell as React.ComponentType<StyledHeaderCellProps>,
  ({ theme, props }) => ({
    '&&&': {
      display: props.$textAlign ? 'flex' : 'block',
      justifyContent: props.$textAlign ? 'space-between' : 'initial',
      height: '100%',
      backgroundColor: getIn(theme.colors, props.$backgroundColor),
      borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
      borderTopWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
      borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
      borderTopColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
      borderBottomStyle: 'solid',
      borderTopStyle: 'solid',
      cursor: props.$isSortable ? 'pointer' : 'auto',
      gridRow: props.$gridRow,
      ...(props.$stickyTopOffsetPx ? { top: `${props.$stickyTopOffsetPx}px` } : {}),
      '> div': {
        backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: props.$textAlign ? props.$textAlign : 'space-between',
        alignItems: 'center',
        height: '100%',
        paddingLeft: props.$hasPadding
          ? makeSpace(getIn(theme, tableRow.paddingLeft[props.$rowDensity]))
          : undefined,
        paddingRight: props.$hasPadding
          ? makeSpace(getIn(theme, tableRow.paddingRight[props.$rowDensity]))
          : undefined,
        minHeight: makeSize(getIn(size, tableRow.minHeight[props.$rowDensity])),
      },
      '&:focus-visible': getFocusRingStyles({ theme, negativeOffset: true }),
    },
  }),
);

type ScopedFooterProps = ScopedProps<Record<string, unknown>>;

const ScopedTableFooter = withScopedTableStyles(
  Footer as React.ComponentType<ScopedFooterProps>,
  ({ theme }) => ({
    '&&&': {
      backgroundColor: getIn(theme.colors, tableFooter.backgroundColor),
      '& tr:last-child th': { borderBottom: 'none' },
    },
  }),
);

type StyledFooterRowProps = ScopedProps<{ $showBorderedCells: boolean }> & Record<string, unknown>;

const StyledFooterRow = withScopedTableStyles(
  FooterRow as unknown as React.ComponentType<StyledFooterRowProps>,
  ({ theme, props }) => ({
    '& th': props.$showBorderedCells
      ? {
          borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderRightColor: getIn(theme.colors, tableRow.borderColor),
          borderRightStyle: 'solid',
        }
      : undefined,
    '& th:last-child ': { borderRight: 'none' },
  }),
);

type StyledFooterCellProps = ScopedProps<{
  $backgroundColor: TableBackgroundColorProp;
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  $textAlign?: string;
  $gridRow?: string;
}> &
  Record<string, unknown>;

const StyledFooterCell = withScopedTableStyles(
  FooterCell as React.ComponentType<StyledFooterCellProps>,
  ({ theme, props }) => ({
    '&&&': {
      height: '100%',
      backgroundColor: getIn(theme.colors, props.$backgroundColor),
      borderBottomWidth: makeSpace(getIn(theme.border.width, tableFooter.borderBottomAndTopWidth)),
      borderTopWidth: makeSpace(getIn(theme.border.width, tableFooter.borderBottomAndTopWidth)),
      borderBottomColor: getIn(theme.colors, tableFooter.borderBottomAndTopColor),
      borderTopColor: getIn(theme.colors, tableFooter.borderBottomAndTopColor),
      borderBottomStyle: 'solid',
      borderTopStyle: 'solid',
      gridRow: props.$gridRow,
      '> div': {
        backgroundColor: getIn(theme.colors, tableFooter.backgroundColor),
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        paddingLeft: makeSpace(getIn(theme, tableRow.paddingLeft[props.$rowDensity])),
        paddingRight: makeSpace(getIn(theme, tableRow.paddingRight[props.$rowDensity])),
        minHeight: makeSize(getIn(size, tableRow.minHeight[props.$rowDensity])),
        alignItems: 'center',
        justifyContent: props.$textAlign ? props.$textAlign : 'left',
      },
    },
  }),
);

type ScopedReactTableProps = ScopedProps<{
  $styledProps?: {
    height?: BoxProps['height'];
    width?: BoxProps['width'];
    isVirtualized?: boolean;
    isSelectable?: boolean;
    showStripedRows?: boolean;
  };
}> &
  Record<string, unknown>;

const ScopedReactTable = withScopedTableStyles(
  ReactTableLib as React.ComponentType<ScopedReactTableProps>,
  ({ theme, props }) => {
    const styledPropsCSSObject = getBaseBoxStyles({
      theme,
      height: props.$styledProps?.height,
      ...(props.$styledProps?.isVirtualized && { width: '100%' }),
    });
    const $isSelectable = props.$styledProps?.isSelectable;
    const $showStripedRows = props.$styledProps?.showStripedRows;
    return {
      '&&&': {
        ...styledPropsCSSObject,
        overflow: `${props.$styledProps?.isVirtualized ? 'unset' : 'auto'} !important`,
      },
      ...(props.$styledProps?.isVirtualized
        ? getTableBodyStyles({
            isVirtualized: props.$styledProps.isVirtualized,
            theme,
            height: props.$styledProps?.height,
            width: '100%',
            isSelectable: $isSelectable,
            showStripedRows: $showStripedRows,
          })
        : null),
    };
  },
);

export {
  ScopedTableBody,
  StyledCell,
  CellWrapper,
  ScopedTableRow,
  EditableStyledCell,
  ScopedTableHeader,
  StyledFilterHeaderCell,
  StyledHeaderRow,
  StyledHeaderCell,
  ScopedTableFooter,
  StyledFooterRow,
  StyledFooterCell,
  ScopedReactTable,
};
