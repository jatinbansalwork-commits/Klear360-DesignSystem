import React from 'react';
import styled from 'styled-components';
import { ComponentIds } from './componentIds';
import { tableToolbar } from './tokens';
import { useTableContext } from './TableContext';
import type { TableToolbarProps, TableToolbarActionsProps, TableToolbarSearchProps } from './types';
import { SearchInput } from '~components/Input/SearchInput';
import { makeMotionTime, makeSize } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Divider } from '~components/Divider';
import { Link } from '~components/Link';
import { getStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/Klear360Provider';

/**
 * TableToolbarActions is a component that is used to render actions in the TableToolbar.
 * It is a flex container that will render its children in a row on desktop and a column on mobile.
 *
 * Action buttons never shrink below their natural (single-line) width - `flexShrink={0}` here
 * means that once the toolbar runs out of horizontal room, the whole actions block wraps onto
 * its own line (the toolbar row itself is `flexWrap: wrap`) instead of individual buttons being
 * squeezed narrower than their label, which wraps that label onto two lines.
 *
 * Use `size="small"` buttons here so their height (32px) matches `TableToolbarSearch`'s - both
 * resolve to the same underlying size token when `size="small"`.
 * @param children - any react element
 * @param styledProps - accepts all of the styled props from Box
 */
const _TableToolbarActions = ({
  children,
  ...rest
}: TableToolbarActionsProps): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  return (
    <BaseBox
      display="flex"
      flex={onMobile ? 1 : 0}
      flexShrink={0}
      justifyContent={onMobile ? 'flex-start' : 'flex-end'}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

const TableToolbarActions = assignWithoutSideEffects(_TableToolbarActions, {
  componentId: ComponentIds.TableToolbarActions,
});

/**
 * TableToolbarSearch renders a search input wired to the Table's global filter state (see
 * `TableProps['globalFilterValue']`/`filterFunctions`). Place it as a `TableToolbar` child,
 * alongside `TableToolbarActions` if present.
 */
const _TableToolbarSearch = ({
  placeholder = 'Search',
  accessibilityLabel = 'Search table',
  ...rest
}: TableToolbarSearchProps): React.ReactElement => {
  const { globalFilterValue, setGlobalFilterValue } = useTableContext();
  return (
    // Grows to use the toolbar's empty space (rather than sitting at a fixed 240px, which reads
    // as an afterthought squeezed next to TableToolbarActions) while staying readable on mobile
    // and not crowding out actions on very wide toolbars.
    <BaseBox flex={1} minWidth="200px" maxWidth="400px" {...makeAnalyticsAttribute(rest)}>
      <SearchInput
        size="small"
        value={globalFilterValue}
        onChange={({ value }) => setGlobalFilterValue(value ?? '')}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel}
      />
    </BaseBox>
  );
};

const TableToolbarSearch = assignWithoutSideEffects(_TableToolbarSearch, {
  componentId: ComponentIds.TableToolbarSearch,
});

const ToolbarWrapper = styled(BaseBox)(({ theme }) => ({
  transition: `background-color ${makeMotionTime(
    getIn(theme.motion, tableToolbar.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableToolbar.backgroundColorMotionEasing)}`,
}));

const _TableToolbar = ({
  children,
  title,
  selectedTitle: controlledSelectedTitle,
}: TableToolbarProps): React.ReactElement => {
  const {
    selectionType,
    selectedRows,
    deselectAllRows,
    currentPaginationState,
    totalItems,
    tableToolbarPlacement,
  } = useTableContext();
  const { platform } = useTheme();
  const isSelected = selectedRows && selectedRows.length > 0;

  const defaultTitle = currentPaginationState
    ? `Showing ${currentPaginationState.page * currentPaginationState.size + 1}-${
        currentPaginationState.page * currentPaginationState.size + currentPaginationState.size
      } Items`
    : `Showing 1-${totalItems} Items`;
  const selectedItemsCount = selectedRows ? selectedRows.length : 0;
  const selectedTitle = isSelected
    ? controlledSelectedTitle ??
      `${selectedRows.length} ${selectedItemsCount === 1 ? 'Item' : 'Items'} Selected`
    : null;

  const onMobile = platform === 'onMobile';

  const deselectButton = (
    <Link size="small" marginLeft="spacing.3" variant="button" onClick={() => deselectAllRows()}>
      Deselect
    </Link>
  );

  return (
    <BaseBox>
      <ToolbarWrapper
        display="flex"
        backgroundColor={tableToolbar.backgroundColor}
        padding={tableToolbar.padding}
        flexWrap="wrap"
        flexDirection={onMobile && tableToolbarPlacement === 'inline' ? 'column' : 'row'}
        gap="spacing.5"
        minHeight={makeSize(tableToolbar.minHeight)}
      >
        <BaseBox display="flex" alignItems="center" flex={1}>
          <BaseBox>
            <Text
              size="small"
              weight="medium"
              color={isSelected ? 'surface.text.gray.normal' : 'surface.text.gray.subtle'}
            >
              {selectedTitle ?? title ?? defaultTitle}
            </Text>
          </BaseBox>

          {selectionType !== 'none' && isSelected && (
            <BaseBox display="flex" marginLeft="spacing.3" height="spacing.6">
              <Divider orientation="vertical" thickness="thick" />
              {deselectButton}
            </BaseBox>
          )}
        </BaseBox>
        {children}
      </ToolbarWrapper>
    </BaseBox>
  );
};

const TableToolbar = assignWithoutSideEffects(_TableToolbar, {
  componentId: ComponentIds.TableToolbar,
});

export { TableToolbar, TableToolbarActions, TableToolbarSearch };
