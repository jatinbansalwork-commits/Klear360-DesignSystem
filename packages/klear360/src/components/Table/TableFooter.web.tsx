import React from 'react';
import {
  ScopedTableFooter,
  StyledFooterRow,
  StyledFooterCell,
} from './tableScopedStyled.web';
import { classes } from './tokens';
import { ComponentIds } from './componentIds';
import type {
  TableFooterProps,
  TableFooterRowProps,
  TableFooterCellProps,
} from './types';
import { useTableRowContext } from './TableContext';
import { Text } from '~components/Typography';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _TableFooter = ({ children, ...rest }: TableFooterProps): React.ReactElement => {
  return (
    <ScopedTableFooter
      isFooter
      {...metaAttribute({ name: MetaConstants.TableFooter })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </ScopedTableFooter>
  );
};

const TableFooter = assignWithoutSideEffects(_TableFooter, {
  displayName: 'TableFooter',
  componentId: ComponentIds.TableFooter,
});

const _TableFooterRow = ({ children, ...rest }: TableFooterRowProps): React.ReactElement => {
  const { showBorderedCells } = useTableRowContext();
  return (
    <StyledFooterRow
      {...metaAttribute({ name: MetaConstants.TableFooterRow })}
      {...makeAnalyticsAttribute(rest)}
      $showBorderedCells={showBorderedCells}
    >
      {children}
    </StyledFooterRow>
  );
};

const TableFooterRow = assignWithoutSideEffects(_TableFooterRow, {
  displayName: 'TableFooterRow',
  componentId: ComponentIds.TableFooterRow,
});

const _TableFooterCell = ({
  children,
  textAlign,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  ...rest
}: TableFooterCellProps): React.ReactElement => {
  const isChildrenString = typeof children === 'string';
  const { backgroundColor, rowDensity } = useTableRowContext();

  const hasRowSpan = Boolean(gridRowStart && gridRowEnd);
  const gridRowValue = hasRowSpan ? `${gridRowStart} / ${gridRowEnd}` : undefined;

  return (
    <StyledFooterCell
      className={hasRowSpan ? classes.HAS_ROW_SPANNING : ''}
      gridColumnStart={gridColumnStart}
      gridColumnEnd={gridColumnEnd}
      $gridRow={gridRowValue}
      $backgroundColor={backgroundColor}
      $rowDensity={rowDensity}
      $textAlign={textAlign}
      {...metaAttribute({ name: MetaConstants.TableFooterCell })}
      {...makeAnalyticsAttribute(rest)}
    >
      {isChildrenString ? (
        <Text color="surface.text.gray.subtle" size="small" weight="medium">
          {children}
        </Text>
      ) : (
        children
      )}
    </StyledFooterCell>
  );
};

const TableFooterCell = assignWithoutSideEffects(_TableFooterCell, {
  displayName: 'TableFooterCell',
  componentId: ComponentIds.TableFooterCell,
});

export { TableFooter, TableFooterRow, TableFooterCell };
