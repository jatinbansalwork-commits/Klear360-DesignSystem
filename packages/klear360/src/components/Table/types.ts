import type React from 'react';
import type { TableNode as TableLibraryTableNode } from '@table-library/react-table-library/types/table';
import type { Theme } from '~components/Klear360Provider';
import type { BoxProps } from '~components/Box';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { DropdownProps } from '~components/Dropdown';
import type { BaseInputProps } from '~components/Input/BaseInput';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type TableNode<Item> = Item & {
  id: Identifier;
};

type TableData<Item> = {
  nodes: TableNode<Item>[];
};

type TableBackgroundColors = `surface.background.gray.${DotNotationToken<
  Theme['colors']['surface']['background']['gray']
>}`;

type TableSortDirection = 'asc' | 'desc';

/**
 * One entry in the table's active sort order. When more than one column is sorted
 * (via shift-click, see `TableProps['sortFunctions']`), index 0 is the primary/most
 * significant column, index 1 is secondary, and so on.
 */
type TableSortOrderEntry = {
  sortKey: string;
  direction: TableSortDirection;
};

type RowHeightType = number | ((item: TableLibraryTableNode, index: number) => number);

/**
 * Common grid spanning properties for table cells
 */
type TableCellGridSpanningProps = {
  /**
   * Grid column start position (1-based). Used for CSS Grid column spanning.
   * @example
   * <TableCell gridColumnStart={1} gridColumnEnd={4}>Spans columns 1-3</TableCell>
   */
  gridColumnStart?: number;
  /**
   * Grid column end position (1-based). Used for CSS Grid column spanning.
   * @example
   * <TableCell gridColumnStart={1} gridColumnEnd={4}>Spans columns 1-3</TableCell>
   */
  gridColumnEnd?: number;
  /**
   * Grid row start position (1-based). Used for CSS Grid row spanning.
   * @example
   * <TableCell gridRowStart={1} gridRowEnd={3}>Spans rows 1-2</TableCell>
   */
  gridRowStart?: number;
  /**
   * Grid row end position (1-based). Used for CSS Grid row spanning.
   * @example
   * <TableCell gridRowStart={1} gridRowEnd={3}>Spans rows 1-2</TableCell>
   */
  gridRowEnd?: number;
};

type TableHeaderProps = {
  /**
   * The children of TableHeader should be TableHeaderRow
   * @example
   * <TableHeader>
   *   <TableHeaderRow>
   *     <TableHeaderCell>Header Cell 1</TableHeaderCell>
   *   </TableHeaderRow>
   * </TableHeader>
   **/
  children: React.ReactNode;
};

type TableHeaderRowProps = {
  /**
   * The children of TableHeaderRow should be TableHeaderCell
   * @example
   * <TableHeader>
   *   <TableHeaderRow>
   *     <TableHeaderCell>Header Cell 1</TableHeaderCell>
   *   </TableHeaderRow>
   * </TableHeader>
   **/
  children: React.ReactNode;
  /**
   * The rowDensity prop determines the density of the table.
   * The rowDensity prop can be 'compact', 'normal', or'comfortable'.
   * The default value is `normal`.
   *
   * @deprecated This prop is deprecated and will be removed in a future major version.
   * The header row is now always compact (36px height) regardless of this prop value.
   **/
  rowDensity?: TableProps<unknown>['rowDensity'];
  /**
   * Set internally by `TableHeader` when it contains more than one `TableHeaderRow` (grouped
   * multi-row headers) - `false` on every row except the last, which is always the leaf/column
   * row. Not meant to be passed directly by consumers.
   *
   * @private
   */
  _isLeafHeaderRow?: boolean;
  /**
   * Set internally by `TableHeader` for grouped multi-row headers - this row's distance in pixels
   * from the top of the header, so its cells' sticky `top` (when `Table`'s `isHeaderSticky` is
   * set) stacks below the row(s) above it instead of overlapping them.
   *
   * @private
   */
  _stickyTopOffsetPx?: number;
} & DataAnalyticsAttribute;

type TableHeaderCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The unique key of the column - identifies it for both sorting and filtering.
   * Sorting is enabled only for columns whose key is present in the `sortFunctions` prop of Table.
   * Click cycles asc → desc → unsorted; shift-click adds/toggles this column as an additional
   * sort key without disturbing the others.
   * Filtering is enabled only for columns whose key is present in the `filterFunctions` prop of
   * Table - a compact search input then renders automatically in this column's header.
   **/
  headerKey?: string;
  /**
   * The textAlign prop determines the content alignment of the table.
   * The textAlign prop can be 'left', 'center', or 'right'.
   * The default value is `left`.
   **/
  textAlign?: 'left' | 'center' | 'right';

  _hasPadding?: boolean;
  /**
   * Set internally by `TableHeaderRow` for grouped multi-row headers, mirroring
   * `TableHeaderRowProps['_stickyTopOffsetPx']`. Not meant to be passed directly by consumers.
   *
   * @private
   */
  _stickyTopOffsetPx?: number;
} & TableCellGridSpanningProps &
  DataAnalyticsAttribute;

/**
 * Declarative column config, as an alternative to hand-writing TableHeader/TableBody JSX.
 * Pass an array of these to Table's `columns` prop instead of `children` to have Table build
 * the header row and body cells for you.
 */
type TableColumnConfig<Item> = {
  /**
   * Unique key for the column. Also used as the column's `headerKey` when `sortable` is true,
   * so it lines up with the key you use in Table's `sortFunctions` prop.
   */
  key: string;
  /**
   * Content rendered in the column's header cell.
   */
  header: React.ReactNode;
  /**
   * Renders a single row's cell content for this column.
   */
  render: (item: TableNode<Item>, index: number) => React.ReactNode;
  /**
   * Column width, passed through as a `grid-template-columns` track (e.g. `'120px'`, `'1fr'`,
   * `'minmax(100px, 1fr)'`). Falls back to the same `minmax(100px, 1fr)` every column gets by
   * default when omitted. Only takes effect when the Table's own `gridTemplateColumns` prop is
   * not also set — an explicit `gridTemplateColumns` always wins, matching how that prop already
   * behaves for hand-written columns.
   */
  width?: string;
  /**
   * Gives this column's header cell a `headerKey`, the existing hook Table's sorting already
   * looks for. Sorting itself still requires a matching entry in the `sortFunctions` prop — this
   * only wires the column up to participate if you provide one.
   * @default false
   */
  sortable?: boolean;
};

/**
 * Configures a filterable column (see `TableProps['filterFunctions']`) to render a dropdown or
 * multiselect picker in its header instead of the default text input.
 */
type TableColumnFilterConfig = {
  /**
   * `'dropdown'` allows a single selected option; `'multiselect'` allows any number.
   */
  type: 'dropdown' | 'multiselect';
  /**
   * The options offered in the picker.
   */
  options: { label: string; value: string }[];
};

type TableChildrenProps<Item> =
  | {
      /**
       * The children of the Table component should be a function that returns TableHeader, TableBody and TableFooter components.
       * The function will be called with the tableData prop.
       *
       * Use this or `columns`, not both.
       */
      children: (tableData: TableNode<Item>[]) => React.ReactElement;
      columns?: never;
    }
  | {
      children?: never;
      /**
       * Column config array, as an alternative to hand-writing TableHeader/TableBody JSX via
       * `children`. Table builds the header row and body cells from this array instead.
       *
       * Use this or `children`, not both.
       */
      columns: TableColumnConfig<Item>[];
    };

type TableProps<Item> = TableChildrenProps<Item> & {
  /**
   * The data prop is an object with a nodes property that is an array of objects.
   * Each object in the array is a row in the table.
   * The object should have an id property that is a unique identifier for the row.
   */
  data: TableData<Item>;
  /**
   * Selection mode determines how the table rows can be selected.
   * @default 'row'
   **/
  multiSelectTrigger?: 'checkbox' | 'row';
  /**
   * The selectionType prop determines the type of selection that is allowed on the table.
   * The selectionType prop can be 'none', 'single' or 'multiple'.
   * @default 'none'
   **/
  selectionType?: 'none' | 'single' | 'multiple';
  /**
   * The onSelectionChange prop is a function that is called when the selection changes.
   * The function is called with an object that has a values property that is an array of the selected rows.
   **/
  onSelectionChange?: ({
    values,
    selectedIds,
  }: {
    /**
     * Note: on server side paginated data, this prop will only contain the selected rows on the current page.
     *
     * Thus, it's recommended to use `selectedIds` for more consistent state management across server/client paginated data.
     *
     * *Deprecated:* Use `selectedIds` instead.
     *
     * @deprecated
     */
    values: TableNode<Item>[];
    /**
     * An array of selected row ids.
     */
    selectedIds: Identifier[];
  }) => void;
  /**
   * The isHeaderSticky prop determines whether the table header is sticky or not.
   * The default value is `false`.
   **/
  isHeaderSticky?: boolean;
  /**
   * The isFooterSticky prop determines whether the table footer is sticky or not.
   * The default value is `false`.
   **/
  isFooterSticky?: boolean;
  /**
   * The isFirstColumnSticky prop determines whether the first column is sticky or not.
   * The default value is `false`. Equivalent to `stickyColumnCount={1}`.
   **/
  isFirstColumnSticky?: boolean;
  /**
   * Number of leading columns (left to right, after any multi-select checkbox column) to freeze
   * while the rest of the table scrolls horizontally. `isFirstColumnSticky` is shorthand for
   * `stickyColumnCount={1}` and needs no `stickyColumnWidths`. Freezing more than one column
   * requires `stickyColumnWidths`, since the sticky offsets are computed from known widths rather
   * than measured at render time.
   * @default isFirstColumnSticky ? 1 : 0
   **/
  stickyColumnCount?: number;
  /**
   * Explicit pixel width (e.g. `'160px'`) for each of the leading `stickyColumnCount` columns, in
   * order. Required when `stickyColumnCount` is greater than `1`. Pair these with matching
   * `width`s on the same columns (via the `columns` config's `width` or `gridTemplateColumns`) so
   * the sticky offsets line up with what's actually rendered.
   **/
  stickyColumnWidths?: string[];
  /**
   * The isLastColumnSticky prop determines whether the last column is sticky or not.
   * The default value is `false`. Equivalent to `trailingStickyColumnCount={1}`.
   **/
  isLastColumnSticky?: boolean;
  /**
   * Number of trailing columns (right to left, before any hover-actions column) to freeze while
   * the rest of the table scrolls horizontally. `isLastColumnSticky` is shorthand for
   * `trailingStickyColumnCount={1}` and needs no `trailingStickyColumnWidths`. Freezing more than
   * one column requires `trailingStickyColumnWidths`, since the sticky offsets are computed from
   * known widths rather than measured at render time.
   * @default isLastColumnSticky ? 1 : 0
   **/
  trailingStickyColumnCount?: number;
  /**
   * Explicit pixel width (e.g. `'160px'`) for each of the trailing `trailingStickyColumnCount`
   * columns, in left-to-right order. Required when `trailingStickyColumnCount` is greater than
   * `1`. Pair these with matching `width`s on the same columns (via the `columns` config's
   * `width` or `gridTemplateColumns`) so the sticky offsets line up with what's actually rendered.
   **/
  trailingStickyColumnWidths?: string[];
  /**
   * The rowDensity prop determines the density of the table.
   * The rowDensity prop can be 'compact', 'normal', or'comfortable'.
   * The default value is `normal`.
   **/
  rowDensity?: 'compact' | 'normal' | 'comfortable';
  /**
   * The onSortChange prop is a function that is called when the sort changes.
   * The function is called with an object that has a sortKey property that is the key of the column that is sorted and a isSortReversed property that is a boolean that determines whether the sort is reversed or not.
   **/
  onSortChange?: ({
    sortKey,
    isSortReversed,
  }: {
    sortKey: TableHeaderCellProps['headerKey'];
    isSortReversed: boolean;
  }) => void;
  /**
   * The sortFunctions prop is an object that has a key for each column that is sortable.
   * The value of each key is a function that is called when the column is sorted.
   * The function is called with an array of the rows in the table.
   * The function should return an array of the rows in the table.
   *
   * Clicking a sortable header cycles that column through ascending → descending → unsorted.
   * Shift-clicking a header adds it as a secondary/tertiary sort key instead of replacing the
   * current sort — see `TableHeaderCellProps['headerKey']` and the Table docs for the full
   * interaction model.
   **/
  sortFunctions?: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]>;
  /**
   * Sets the table's sort state on mount, so it renders already sorted by this column instead
   * of requiring a click. `sortKey` must match a key in `sortFunctions`.
   **/
  initialSort?: TableSortOrderEntry;
  /**
   * The toolbar prop is a React element that is rendered above the table.
   * The toolbar prop should be a `TableToolbar` component.
   **/
  toolbar?: React.ReactElement;
  /**
   * The pagination prop is a React element that is rendered below the table.
   * The pagination prop should be a `TablePagination` component.
   **/
  pagination?: React.ReactElement;
  /**
   * The height prop is a responsive styled prop that determines the height of the table.
   **/
  height?: BoxProps['height'];

  /**
   * The showStripedRows prop determines whether the table should have striped rows or not.
   * The default value is `false`.
   **/
  showStripedRows?: boolean;
  /**
   * The gridTemplateColumns prop determines the grid-template-columns CSS property of the table.
   * The default value is `repeat(${columnCount},minmax(100px, 1fr))`.
   **/
  gridTemplateColumns?: string;
  /**
   * The isLoading prop determines whether the table is loading or not.
   * The default value is `false`.
   **/
  isLoading?: boolean;
  /**
   * The isRefreshing prop determines whether the table is refreshing or not.
   * The default value is `false`.
   **/
  isRefreshing?: boolean;
  /**
   * The showBorderedCells prop determines whether the table should have bordered cells or not.
   * The default value is `true`.
   **/
  showBorderedCells?: boolean;
  /**
   * An array of default selected row ids. This will be used to set the initial selected rows.
   */
  defaultSelectedIds?: Identifier[];
  /**
   * The backgroundColor prop determines the background color of the table.
   **/
  backgroundColor?: TableBackgroundColors | 'transparent';
  /**
   * The isGrouped prop determines whether the table has grouped data with parent-child relationships or not.
   * When true, enables tree-aware selection where selecting a parent automatically selects all children.
   * The default value is `false`.
   **/
  isGrouped?: boolean;
  /**
   * Ids of the group-header rows (parent rows with children, see `isGrouped`) that are currently
   * expanded. Passing this prop makes row expansion controlled - Table will not manage this state
   * on its own.
   **/
  expandedRowIds?: Identifier[];
  /**
   * Seeds the expanded row ids on mount (uncontrolled). Ignored if `expandedRowIds` is also
   * passed.
   * @default every group-header row id (all groups start expanded)
   **/
  defaultExpandedRowIds?: Identifier[];
  /**
   * Called whenever a group-header row is expanded or collapsed, with the full updated list of
   * expanded row ids.
   **/
  onExpandedRowIdsChange?: (ids: Identifier[]) => void;
  /**
   * Controls when the row-level selection checkbox is visible.
   *
   * - `'always'` (default): checkbox is always visible. Fully backward-compatible.
   * - `'on-hover'`: checkbox is hidden by default and appears when the row is hovered.
   *   Once a row is selected the checkbox stays visible so the user can deselect it.
   *
   * The header "select-all" checkbox is **not** affected by this prop — it is always visible.
   * Only applies when `selectionType="multiple"`.
   *
   * @default 'always'
   */
  checkboxDisplay?: 'always' | 'on-hover';
  /**
   * Per-row predicate for a filterable column, keyed by `headerKey`. Return `true` to keep the
   * row. A column becomes filterable purely by having its `headerKey` present here — mirrors how
   * `sortFunctions` makes a column sortable. Table renders a compact search input in that
   * column's header (below the sortable header row) automatically, with no extra JSX needed - or,
   * for a column also present in `filterConfig`, a dropdown/multiselect picker instead.
   *
   * The filter value passed to the predicate is a plain `string` for an ordinary (text) column or
   * a `filterConfig` `type: 'dropdown'` column (a single selected value), or `string[]` for a
   * `filterConfig` `type: 'multiselect'` column (the selected values). A predicate whose column
   * may be `type: 'multiselect'` should check `Array.isArray(filterValue)`, since the same
   * predicate also receives a plain `string` from `globalFilterValue` (global search is always
   * plain text, regardless of the column's own filter type) - see the "Dropdown & multiselect
   * filters" section of the Table decisions doc for the recommended fallback.
   *
   * The same predicate is reused for `globalFilterValue`: a row matches the global filter if
   * *any* filterable column's predicate matches it. Column filters combine with AND (a row must
   * satisfy every active column filter); the global filter then narrows further with OR across
   * all filterable columns.
   **/
  filterFunctions?: Record<
    string,
    (item: TableNode<Item>, filterValue: string | string[]) => boolean
  >;
  /**
   * Renders a dropdown (single-select) or multiselect picker in a filterable column's header,
   * instead of the default text input - keyed by `headerKey`, same convention as
   * `filterFunctions`. The column must also have a matching entry in `filterFunctions` to
   * actually filter rows; this only controls which input renders.
   **/
  filterConfig?: Record<string, TableColumnFilterConfig>;
  /**
   * Values for each active column filter, keyed by `headerKey`. A plain `string` for an ordinary
   * (text) column or a `filterConfig` `type: 'dropdown'` column, or `string[]` for a
   * `type: 'multiselect'` column. Passing this prop makes column filtering controlled - Table
   * will not manage this state on its own.
   **/
  columnFilterValues?: Record<string, string | string[]>;
  /**
   * Seeds the column filter values on mount (uncontrolled). Ignored if `columnFilterValues` is
   * also passed.
   **/
  defaultColumnFilterValues?: Record<string, string | string[]>;
  /**
   * Called whenever a column filter's value changes, with the full updated map.
   **/
  onColumnFilterValuesChange?: (values: Record<string, string | string[]>) => void;
  /**
   * Value of the global search - checked against every filterable column via its
   * `filterFunctions` predicate. Passing this prop makes it controlled.
   **/
  globalFilterValue?: string;
  /**
   * Seeds the global search value on mount (uncontrolled). Ignored if `globalFilterValue` is
   * also passed.
   **/
  defaultGlobalFilterValue?: string;
  /**
   * Called whenever the global search value changes.
   **/
  onGlobalFilterValueChange?: (value: string) => void;
} & DataAnalyticsAttribute &
  StyledPropsKlear360;

type Identifier = string | number;

type TableBodyProps<Item> = {
  /**
   * The children of the TableBody component should be TableRow components.
   * @example
   * <TableBody>
   *   <TableRow>
   *     <TableCell>...</TableCell>
   *   </TableRow>
   * </TableBody>
   * if you are using TableBody inside TableVirtualizedWrapper then you can pass the children as a function
   * @example
   * <TableBody>
   *  {(tableItem, index) => (
   *   <TableRow key={index} item={tableItem}>
   *    <TableCell>...</TableCell>
   *   </TableRow>
   *   )}
   * </TableBody>
   **/
  children: React.ReactNode | ((tableItem: Item, index: number) => React.ReactElement);
} & DataAnalyticsAttribute;

type TableRowProps<Item> = {
  /**
   * The children of the TableRow component should be TableCell components.
   * @example
   * <TableRow>
   *   <TableCell>...</TableCell>
   * </TableRow>
   **/
  children: React.ReactNode;
  /**
   * The item prop is used to pass the individual table item to the TableRow component.
   * @example
   * tableData.map((tableItem) => (
   *   <TableRow item={item}>
   *     <TableCell>...</TableCell>
   *   </TableRow>
   * ));
   **/
  item: TableNode<Item>;
  /**
   * The isDisabled prop is used to disable the TableRow component.
   * @example
   * <TableRow isDisabled>
   *   <TableCell>...</TableCell>
   * </TableRow>
   **/
  isDisabled?: boolean;
  /**
   * Callback triggered when the row is hovered. It is called with the current row item prop.
   */
  onHover?: ({ item }: { item: TableNode<Item> }) => void;
  /**
   * Callback triggered when the row is clicked. It is called with the current row item prop.
   */
  onClick?: ({ item }: { item: TableNode<Item> }) => void;

  hoverActions?: React.ReactElement;
} & TestID &
  DataAnalyticsAttribute;

type TableCellProps = {
  /**
   * The children of the TableCell component should be a string or a ReactNode.
   * @example
   * <TableCell>{'Hello'}</TableCell>
   * <TableCell>
   *  <Text>...</Text>
   * </TableCell>
   * <TableCell>
   * <Button>...</Button>
   * </TableCell>
   **/
  children: React.ReactNode;
  /**
   * The textAlign prop determines the content alignment of the table.
   * The textAlign prop can be 'left', 'center', or 'right'.
   * The default value is `left`.
   **/
  textAlign?: 'left' | 'center' | 'right';
  /**
   * Removes padding from CellWrapper
   *
   * @private
   */
  _hasPadding?: boolean;
  /**
   * Renders the row-expansion chevron before this cell's content. Set internally by `TableRow` on
   * its first cell child when the row is a group header (see `TableProps['isGrouped']` /
   * `expandedRowIds`) - not meant to be passed directly by consumers.
   *
   * @private
   */
  _isGroupExpandCell?: boolean;
  /**
   * The id of the group-header row this cell belongs to, passed alongside `_isGroupExpandCell`.
   *
   * @private
   */
  _groupRowId?: Identifier;
  /**
   * The backgroundColor prop determines the background color of the table cell.
   * The default value is `transparent`.
   **/
  backgroundColor?: TableBackgroundColors | 'transparent';
} & TableCellGridSpanningProps &
  DataAnalyticsAttribute;

type TableEditableCellProps = Pick<
  BaseInputProps,
  | 'validationState'
  | 'placeholder'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'prefix'
  | 'suffix'
  | 'maxCharacters'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
  | 'onSubmit'
  | 'autoCapitalize'
  | 'testID'
  | 'onClick'
  | 'leadingIcon'
  | 'trailingButton'
  | 'errorText'
  | 'successText'
> & {
  accessibilityLabel: NonNullable<BaseInputProps['accessibilityLabel']>;
  inputType?: Extract<BaseInputProps['type'], 'text' | 'number' | 'email' | 'tel' | 'url'>;
};

/**
 * TableEditableSearchCell is TableEditableCell with a search affordance: a leading
 * magnifying-glass icon (matching `TableToolbarSearch`/the column-filter input) and a clear
 * button that appears once there's a value, mirroring `SearchInput`'s clear behaviour. It's a
 * plain typed input - value changes are still delivered through `onChange` - there's no
 * dropdown or suggestion list.
 */
type TableEditableSearchCellProps = Omit<
  TableEditableCellProps,
  'leadingIcon' | 'trailingButton'
> & {
  /**
   * Toggle the visibility of the leading search icon.
   *
   * @default true
   */
  showSearchIcon?: boolean;
  /**
   * Called when the clear button is clicked, in addition to the input being cleared.
   */
  onClearButtonClick?: () => void;
};

type TableEditableDropdownCellProps = Pick<
  DropdownProps,
  'children' | 'isOpen' | 'onOpenChange' | 'selectionType' | 'zIndex'
>;

type TableFooterProps = {
  /**
   * The children of TableFooter should be TableFooterRow
   * @example
   * <TableFooter>
   *   <TableFooterRow>
   *     <TableFooterCell>Footer Cell 1</TableFooterCell>
   *   </TableFooterRow>
   * </TableFooter>
   **/
  children: React.ReactNode;
} & DataAnalyticsAttribute;

type TableFooterRowProps = {
  /**
   * The children of TableFooterRow should be TableFooterCell
   * @example
   * <TableFooter>
   *   <TableFooterRow>
   *     <TableFooterCell>Footer Cell 1</TableFooterCell>
   *   </TableFooterRow>
   * </TableFooter>
   **/
  children: React.ReactNode;
} & DataAnalyticsAttribute;

type TableFooterCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The textAlign prop determines the content alignment of the table.
   * The textAlign prop can be 'left', 'center', or 'right'.
   * The default value is `left`.
   **/
  textAlign?: 'left' | 'center' | 'right';
} & TableCellGridSpanningProps &
  DataAnalyticsAttribute;

type TablePaginationCommonProps = {
  /**
   * The default page size.
   * Page size controls how rows are shown per page.
   * @default 10
   * consider using virtualization for large page sizes
   **/
  defaultPageSize?: number;
  /**
   * The current page. Passing this prop will make the component controlled and will not update the page on its own.
   **/
  currentPage?: number;

  /**
   * Callback function that is called when the page size is changed
   */
  onPageSizeChange?: ({ pageSize }: { pageSize: number }) => void;
  /**
   * The page size choices shown in the page size picker.
   * @default [10, 25, 50]
   */
  pageSizeOptions?: number[];
  /**
   * Whether to show the page size picker. It will be always be hidden on mobile.
   * Page size picker controls how rows are shown per page.
   * @default true
   */
  showPageSizePicker?: boolean;
  /**
   * Whether to show the page number selector. It will be always be hidden on mobile.
   * Page number selectors is a group of buttons that allows the user to jump to a specific page.
   * @default false
   */
  showPageNumberSelector?: boolean;
  /**
   * Content of the label to be shown in the pagination component
   * @default `Showing 1 to ${totalItems} Items`
   */
  label?: string;
  /**
   * Whether to show the label. It will be always be hidden on mobile.
   * @default false
   */
  showLabel?: boolean;
} & DataAnalyticsAttribute;
type TablePaginationType = 'client' | 'server';

type TablePaginationServerProps = TablePaginationCommonProps & {
  /**
   * Whether the pagination is happening on client or server.
   * If the pagination is happening on `client`, the Table component will **divide the data into pages** and show the pages based on the page size.
   * If the pagination is happening on `server`, the Table component will **not divide the data into pages and will show all the data**. You will have to fetch data for each page as the page changes and pass it to the Table component.
   * When paginationType is `server`, the `onPageChange` & `totalItemCount` props are required.
   * @default 'client'
   * */
  paginationType?: Extract<TablePaginationType, 'server'>;
  /**
   * The total number of possible items in the table. This is used to calculate the total number of pages when pagination is happening on server and not all the data is fetched at once.
   */
  totalItemCount: number;
  /**
   * Callback function that is called when the page is changed
   */
  onPageChange: ({ page }: { page: number }) => void;
};

type TablePaginationClientProps = TablePaginationCommonProps & {
  /**
   * Whether the pagination is happening on client or server.
   * If the pagination is happening on `client`, the Table component will **divide the data into pages** and show the pages based on the page size.
   * If the pagination is happening on `server`, the Table component will **not divide the data into pages and will show all the data**. You will have to fetch data for each page as the page changes and pass it to the Table component.
   * When paginationType is `server`, the `onPageChange` & `totalItemCount` props are required.
   * @default 'client'
   * */
  paginationType?: Extract<TablePaginationType, 'client'>;
  /**
   * The total number of possible items in the table. This is used to calculate the total number of pages when pagination is happening on server and not all the data is fetched at once.
   */
  totalItemCount?: number;
  /**
   * Callback function that is called when the page is changed
   */
  onPageChange?: ({ page }: { page: number }) => void;
};

type TablePaginationProps = TablePaginationCommonProps &
  (TablePaginationServerProps | TablePaginationClientProps);

type TableToolbarPlacement = 'inline' | 'overlay';

type TableToolbarProps = {
  /**
   * The children of TableToolbar should be TableToolbarActions
   */
  children?: React.ReactNode;
  /**
   * The title of the TableToolbar. If not provided, it will show the default title.
   * @default `Showing 1 to ${totalItems} Items`
   */
  title?: string;
  /**
   * The title to show when items are selected. If not provided, it will show the default title.
   * @default `${selectedRows.length} 'Items'} Selected`
   */
  selectedTitle?: string;
  /**
   * Controls how the TableToolbar is positioned relative to the TableHeader.
   * - `inline`: Renders the toolbar above the TableHeader as part of the normal layout (default).
   * - `overlay`: Renders the toolbar over the TableHeader.
   *
   * Defaults to `inline`.
   */
  placement?: TableToolbarPlacement;
} & DataAnalyticsAttribute;

type TableToolbarSearchProps = {
  /**
   * Placeholder text for the search input.
   * @default 'Search'
   */
  placeholder?: string;
  /**
   * Accessible label for the search input, for assistive technology.
   * @default 'Search table'
   */
  accessibilityLabel?: string;
} & DataAnalyticsAttribute;

type TableToolbarActionsProps = {
  children?: React.ReactNode;
} & StyledPropsKlear360 &
  DataAnalyticsAttribute;

type VirtualizedWrapperProps = {
  /**
   *
   * @example
   *      <TableComponent
   *     data={data}
   *     height={'500px'}
   *     rowDensity="comfortable"
   *     selectionType="multiple"
   *     toolbar={
   *       <TableToolbar>
   *         <TableToolbarActions>
   *           <Button variant="secondary" marginRight="spacing.2">
   *             Export
   *           </Button>
   *           <Button>Payout</Button>
   *         </TableToolbarActions>
   *       </TableToolbar>
   *     }
   *   >
   *     {() => (
   *       <TableVirtualizedWrapper >
   *         <TableHeader>
   *           <TableHeaderRow>
   *             <TableHeaderCell>ID</TableHeaderCell>
   *             <TableHeaderCell>Amount</TableHeaderCell>
   *             <TableHeaderCell>Account</TableHeaderCell>
   *             <TableHeaderCell>Date</TableHeaderCell>
   *             <TableHeaderCell>Method</TableHeaderCell>
   *             <TableHeaderCell>Status</TableHeaderCell>
   *           </TableHeaderRow>
   *         </TableHeader>
   *         <TableBody>
   *           {(tableItem: Item, index) => (
   *             <TableRow key={index} item={tableItem}>
   *               <TableCell>
   *                 <Code size="medium">{tableItem.paymentId}</Code>
   *               </TableCell>
   *               <TableCell>
   *                 <Amount value={tableItem.amount} />
   *               </TableCell>
   *               <TableCell>{tableItem.account}</TableCell>
   *               <TableCell>
   *                 {tableItem.date?.toLocaleDateString('en-IN', {
   *                   year: 'numeric',
   *                   month: '2-digit',
   *                   day: '2-digit',
   *                 })}
   *               </TableCell>
   *               <TableCell>{tableItem.method}</TableCell>
   *               <TableCell>
   *                 <Badge
   *                   size="medium"
   *                   color={
   *                     tableItem.status === 'Completed'
   *                       ? 'positive'
   *                       : tableItem.status === 'Pending'
   *                       ? 'notice'
   *                       : tableItem.status === 'Failed'
   *                       ? 'negative'
   *                       : 'default'
   *                   }
   *                 >
   *                   {tableItem.status}
   *                 </Badge>
   *               </TableCell>
   *             </TableRow>
   *           )}
   *         </TableBody>
   *       </TableVirtualizedWrapper>
   *     )}
   *   </TableComponent>
   *
   **/
  children: React.ReactNode;
  /**
   * headerHeight is the height of the header
   **/
  headerHeight?: number;
  /**
   * rowHeight is the height of each row, it can be a fixed number or a function that returns a number
   * @default rowHeight values
   * compact: '36'
   * normal: '48'
   * comfortable: '60'
   *
   **/
  rowHeight?: (item: TableLibraryTableNode, index: number) => number;
};

export type {
  TableProps,
  TableColumnConfig,
  TableColumnFilterConfig,
  Identifier,
  TableNode,
  TableData,
  TableHeaderProps,
  TableHeaderRowProps,
  TableHeaderCellProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableEditableCellProps,
  TableEditableSearchCellProps,
  TableEditableDropdownCellProps,
  TableFooterProps,
  TableFooterRowProps,
  TableFooterCellProps,
  TablePaginationProps,
  TableToolbarProps,
  TableToolbarActionsProps,
  TableToolbarSearchProps,
  TableToolbarPlacement,
  TableBackgroundColors,
  TablePaginationType,
  TablePaginationCommonProps,
  VirtualizedWrapperProps,
  RowHeightType,
  TableCellGridSpanningProps,
  TableSortDirection,
  TableSortOrderEntry,
};
