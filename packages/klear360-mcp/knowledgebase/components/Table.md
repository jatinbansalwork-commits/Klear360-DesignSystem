## Component Name

Table

## Description

A table component that displays data in a grid format through rows and columns of cells. Table facilitates data organization and allows users to scan, sort, compare, and take action on large amounts of data. It supports features like row selection, pagination, sorting, sticky headers/footers, and customizable cell content.

## Important Constraints

- `Table` `toolbar` prop only accepts `TableToolbar` component
- `expandedRowIds`/row-expansion chevrons only apply to `isGrouped` tables (group-header rows)
- A `filterConfig` entry needs a matching `filterFunctions` entry for that column to actually filter rows - `filterConfig` alone only controls which input renders
- A `filterFunctions` predicate for a `type: 'multiselect'` column receives a plain `string` from global search (never default that branch to `true` - see `filterFunctions` below)
- In a grouped multi-row header (multiple `TableHeaderRow`s), `isHeaderSticky` combined with column filtering isn't fully supported yet - the filter row's own sticky offset doesn't account for a preceding group row
- `isGrouped` + a virtualized table (`TableVirtualizedWrapper`) is not a supported combination today - the virtualized row list is built from the sorted/filtered data directly and does not consult the tree's expand/collapse state, so collapsed children would still be included
- `TableCell` has no vertical padding at any `rowDensity` - only `alignItems: center` - so multi-line/stacked cell content can touch the row border once it's taller than the row's `minHeight`; use `TableTitleDescriptionCell` or your own `paddingY`
- The `columns` config's auto-built `TableHeaderCell` only gets a `headerKey` when `sortable: true` - a column meant to be filterable-but-not-sortable via `columns` needs `sortable: true` too (even with no real sort function) or `headerKey` never gets set and the filter row never renders an input for it
- `onSortChange` reports only the primary sort key - shift-click secondary/tertiary sort has no equivalent callback, so it can't be wired into a server-side sort
- With `selectionType="multiple"` and server-side pagination, read `selectedIds` (not the deprecated `values`, which is derived from `data.nodes` and silently drops any selected row not on the current page) from `onSelectionChange` to track selection across pages
- `Badge` `size="xsmall"`/`"small"` render at 10px text, smaller than the 12px `Text size="small"` typically used for table cell content - use `size="medium"` (Badge's own default) or larger inside a table cell
- An `IconButton` with neither `isHighlighted` nor `emphasis="moderate"` has no `width`/`height` applied, so its clickable area is only as big as the icon glyph - under WCAG 2.2's 24x24px minimum target size (SC 2.5.8); easiest to miss in a narrow action column

## TypeScript Types

These types define the props that the Table component and its subcomponents accept, helping you understand how to use them properly in your application.

```typescript
// The base identifier type used in tables
type Identifier = string | number;

// Defines the shape of a table node (row)
type TableNode<Item> = Item & {
  id: Identifier;
};

// The main data structure passed to Table
type TableData<Item> = {
  nodes: TableNode<Item>[];
};

// Main Table component props
type TableProps<Item> = {
  /**
   * The children of the Table component should be a function that returns TableHeader, TableBody and TableFooter components.
   * The function will be called with the tableData prop.
   */
  children: (tableData: TableNode<Item>[]) => React.ReactElement;

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
   * @default 'none'
   **/
  selectionType?: 'none' | 'single' | 'multiple';

  /**
   * The onSelectionChange prop is a function that is called when the selection changes.
   **/
  onSelectionChange?: ({
    values,
    selectedIds,
  }: {
    values: TableNode<Item>[];
    selectedIds: Identifier[];
  }) => void;

  /**
   * The isHeaderSticky prop determines whether the table header is sticky or not.
   * @default false
   **/
  isHeaderSticky?: boolean;

  /**
   * The isFooterSticky prop determines whether the table footer is sticky or not.
   * @default false
   **/
  isFooterSticky?: boolean;

  /**
   * The isFirstColumnSticky prop determines whether the first column is sticky or not.
   * Equivalent to `stickyColumnCount={1}`.
   * @default false
   **/
  isFirstColumnSticky?: boolean;

  /**
   * Number of leading columns (after any multi-select checkbox column) to freeze while the rest
   * of the table scrolls horizontally. `isFirstColumnSticky` is shorthand for
   * `stickyColumnCount={1}` and needs no `stickyColumnWidths`. Freezing more than one column
   * requires `stickyColumnWidths`, since offsets are computed from known widths rather than
   * measured at render time. Automatically disabled on mobile (the frozen width can easily
   * exceed a phone's entire viewport, leaving no room to scroll to the rest of the table).
   * @default isFirstColumnSticky ? 1 : 0
   **/
  stickyColumnCount?: number;

  /**
   * Explicit pixel width (e.g. `'160px'`) for each of the leading `stickyColumnCount` columns, in
   * order. Required when `stickyColumnCount` is greater than `1`. Pair these with matching
   * `width`s on the same columns (via the `columns` config's `width` or `gridTemplateColumns`).
   **/
  stickyColumnWidths?: string[];

  /**
   * The isLastColumnSticky prop determines whether the last column is sticky or not.
   * Equivalent to `trailingStickyColumnCount={1}`.
   * @default false
   **/
  isLastColumnSticky?: boolean;

  /**
   * Number of trailing columns (right to left, before any hover-actions column) to freeze while
   * the rest of the table scrolls horizontally. Composable with `stickyColumnCount` - a table can
   * freeze leading columns, trailing columns, or both. Automatically disabled on mobile, same as
   * `stickyColumnCount`.
   * @default isLastColumnSticky ? 1 : 0
   **/
  trailingStickyColumnCount?: number;

  /**
   * Explicit pixel width for each of the trailing `trailingStickyColumnCount` columns, in
   * left-to-right order. Required when `trailingStickyColumnCount` is greater than `1`.
   **/
  trailingStickyColumnWidths?: string[];

  /**
   * The rowDensity prop determines the density of the table.
   * @default 'normal'
   **/
  rowDensity?: 'compact' | 'normal' | 'comfortable';

  /**
   * The onSortChange prop is a function that is called when the sort changes.
   **/
  onSortChange?: ({
    sortKey,
    isSortReversed,
  }: {
    sortKey: string | undefined;
    isSortReversed: boolean;
  }) => void;

  /**
   * The sortFunctions prop is an object that has a key for each column that is sortable.
   * Clicking a sortable header cycles ascending -> descending -> unsorted. Shift-clicking a
   * different sortable header adds it as a secondary/tertiary sort key instead of replacing
   * the current sort.
   **/
  sortFunctions?: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]>;

  /**
   * Sets the table's sort state on mount, so it renders already sorted by this column instead
   * of requiring a click. `sortKey` must match a key in `sortFunctions`.
   **/
  initialSort?: { sortKey: string; direction: 'asc' | 'desc' };

  /**
   * Per-row predicate for a filterable column. Return `true` to keep the row. A column becomes
   * filterable purely by having its `headerKey` present here — mirrors `sortFunctions`. A
   * filter row auto-renders in the header with one text input per filterable column (AND across
   * columns), or a dropdown/multiselect picker for a column also present in `filterConfig`. The
   * same predicates are reused for global search via `globalFilterValue`/`TableToolbarSearch` (OR
   * across columns) — global search always passes a plain `string`, regardless of the column's
   * own filter type. `filterValue` is a plain `string` for an ordinary column or a `filterConfig`
   * `type: 'dropdown'` column, or `string[]` for a `type: 'multiselect'` column. A predicate for a
   * possibly-multiselect column must handle both, e.g.
   * `Array.isArray(v) ? v.includes(item.field) : item.field.toLowerCase().includes(v.toLowerCase())`
   * — do NOT default the string branch to `true`, since global search is `.some(...)` (OR) across
   * every filterable column's predicate: a predicate that unconditionally returns `true` for a
   * plain string makes every row match any global search term.
   **/
  filterFunctions?: Record<
    string,
    (item: TableNode<Item>, filterValue: string | string[]) => boolean
  >;

  /**
   * Renders a dropdown (`type: 'dropdown'`, single value) or multiselect (`type: 'multiselect'`,
   * multiple values) picker in a filterable column's header instead of the default text input —
   * keyed by `headerKey`, same convention as `filterFunctions`. The column must also have a
   * matching entry in `filterFunctions` to actually filter rows.
   **/
  filterConfig?: Record<
    string,
    { type: 'dropdown' | 'multiselect'; options: { label: string; value: string }[] }
  >;

  /**
   * Column filter values keyed by headerKey. A plain `string` for an ordinary column or a
   * `filterConfig` `type: 'dropdown'` column, or `string[]` for a `type: 'multiselect'` column.
   * Passing this makes it controlled.
   */
  columnFilterValues?: Record<string, string | string[]>;

  /** Initial column filter values for uncontrolled usage. */
  defaultColumnFilterValues?: Record<string, string | string[]>;

  /** Callback fired when any column filter value changes. */
  onColumnFilterValuesChange?: (values: Record<string, string | string[]>) => void;

  /**
   * Global search value, checked against every filterable column's `filterFunctions` predicate.
   * Passing this makes it controlled. Typically driven by a `TableToolbarSearch` in the toolbar.
   */
  globalFilterValue?: string;

  /** Initial global filter value for uncontrolled usage. */
  defaultGlobalFilterValue?: string;

  /** Callback fired when the global filter value changes. */
  onGlobalFilterValueChange?: (value: string) => void;

  /**
   * The toolbar prop is a React element that is rendered above the table.
   **/
  toolbar?: React.ReactElement;

  /**
   * The pagination prop is a React element that is rendered below the table.
   **/
  pagination?: React.ReactElement;

  /**
   * The height prop is a responsive styled prop that determines the height of the table.
   **/
  height?: BoxProps['height'];

  /**
   * The showStripedRows prop determines whether the table should have striped rows or not.
   * @default false
   **/
  showStripedRows?: boolean;

  /**
   * The gridTemplateColumns prop determines the grid-template-columns CSS property of the table.
   * @default `repeat(${columnCount},minmax(100px, 1fr))`
   **/
  gridTemplateColumns?: string;

  /**
   * The isLoading prop determines whether the table is loading or not.
   * @default false
   **/
  isLoading?: boolean;

  /**
   * The isRefreshing prop determines whether the table is refreshing or not.
   * @default false
   **/
  isRefreshing?: boolean;

  /**
   * The showBorderedCells prop determines whether the table should have bordered cells or not.
   **/
  showBorderedCells?: boolean;

  /**
   * An array of default selected row ids. This will be used to set the initial selected rows.
   */
  defaultSelectedIds?: Identifier[];

  /**
   * The backgroundColor prop determines the background color of the table.
   **/
  backgroundColor?: string | 'transparent';

  /**
   * Whether the table has grouped data with parent-child relationships. Enables tree-aware
   * selection (selecting a parent selects all children) and, per group-header row, an automatic
   * expand/collapse chevron (see `expandedRowIds`).
   * @default false
   **/
  isGrouped?: boolean;

  /**
   * Ids of the group-header rows (parent rows with children, see `isGrouped`) that are currently
   * expanded. Passing this makes row expansion controlled.
   **/
  expandedRowIds?: Identifier[];

  /**
   * Seeds the expanded row ids on mount (uncontrolled).
   * @default every group-header row id (all groups start expanded)
   **/
  defaultExpandedRowIds?: Identifier[];

  /** Callback fired when a group-header row is expanded or collapsed. */
  onExpandedRowIdsChange?: (ids: Identifier[]) => void;
};

// TableHeader component props
type TableHeaderProps = {
  /**
   * The children of TableHeader should be TableHeaderRow. Usually a single row, but more than
   * one is supported for a grouped multi-row header (e.g. a "Shipment" label row spanning
   * `ID`/`Status` above the real column row) — the LAST TableHeaderRow is always the leaf/column
   * row that lines up with body columns; earlier rows use TableHeaderCell's `gridColumnStart`/
   * `gridColumnEnd` to span the leaf columns they group.
   **/
  children: React.ReactNode;
};

// TableHeaderRow component props
type TableHeaderRowProps = {
  /**
   * The children of TableHeaderRow should be TableHeaderCell
   **/
  children: React.ReactNode;
  /**
   * The rowDensity prop determines the density of the table.
   **/
  rowDensity?: TableProps<unknown>['rowDensity'];
};

// TableHeaderCell component props
type TableHeaderCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The unique key of the column.
   * This is used to identify the column for sorting in sortFunctions prop of Table.
   **/
  headerKey?: string;
  /**
   * The textAlign prop determines the content alignment of the table.
   * @default 'left'
   **/
  textAlign?: 'left' | 'center' | 'right';
};

// TableBody component props
type TableBodyProps<Item> = {
  /**
   * The children of the TableBody component should be TableRow components.
   **/
  children: React.ReactNode | ((tableItem: Item, index: number) => React.ReactElement);
};

// TableRow component props
type TableRowProps<Item> = {
  /**
   * The children of the TableRow component should be TableCell components.
   **/
  children: React.ReactNode;
  /**
   * The item prop is used to pass the individual table item to the TableRow component.
   **/
  item: TableNode<Item>;
  /**
   * The isDisabled prop is used to disable the TableRow component.
   **/
  isDisabled?: boolean;
  /**
   * Callback triggered when the row is hovered.
   */
  onHover?: ({ item }: { item: TableNode<Item> }) => void;
  /**
   * Callback triggered when the row is clicked.
   */
  onClick?: ({ item }: { item: TableNode<Item> }) => void;
  /**
   * Actions to display when hovering over the row
   */
  hoverActions?: React.ReactElement;
};

// TableCell component props
type TableCellProps = {
  /**
   * The children of the TableCell component should be a string or a ReactNode.
   **/
  children: React.ReactNode;
  /**
   * The textAlign prop determines the content alignment of the table.
   * @default 'left'
   **/
  textAlign?: 'left' | 'center' | 'right';
};

// TableEditableCell component props
type TableEditableCellProps = {
  // Input related props
  validationState?: 'none' | 'error' | 'success';
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  maxCharacters?: number;
  autoFocus?: boolean;
  errorText?: string;
  successText?: string;
  // Required prop
  accessibilityLabel: string;
};

// TableFooter component props
type TableFooterProps = {
  /**
   * The children of TableFooter should be TableFooterRow
   **/
  children: React.ReactNode;
};

// TableFooterRow component props
type TableFooterRowProps = {
  /**
   * The children of TableFooterRow should be TableFooterCell
   **/
  children: React.ReactNode;
};

// TableFooterCell component props
type TableFooterCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The textAlign prop determines the content alignment of the table.
   * @default 'left'
   **/
  textAlign?: 'left' | 'center' | 'right';
};

// TableToolbar component props
type TableToolbarProps = {
  /**
   * The children of TableToolbar should be TableToolbarActions
   */
  children?: React.ReactNode;
  /**
   * The title of the TableToolbar.
   * @default `Showing 1 to ${totalItems} Items`
   */
  title?: string;
  /**
   * The title to show when items are selected.
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
  placement?: 'inline' | 'overlay';
};

// TableToolbarSearch component props
type TableToolbarSearchProps = {
  /**
   * @default 'Search'
   */
  placeholder?: string;
  /**
   * @default 'Search table'
   */
  accessibilityLabel?: string;
};

// TablePagination component props
type TablePaginationProps = {
  /**
   * The default page size.
   * @default 10
   **/
  defaultPageSize?: number;

  /**
   * The page size choices shown in the page size picker. Not limited to 10/25/50.
   * @default [10, 25, 50]
   **/
  pageSizeOptions?: number[];

  /**
   * The current page. Passing this prop will make the component controlled.
   **/
  currentPage?: number;

  /**
   * Callback function that is called when the page size is changed
   */
  onPageSizeChange?: ({ pageSize }: { pageSize: number }) => void;

  /**
   * Whether to show the page size picker.
   * @default true
   */
  showPageSizePicker?: boolean;

  /**
   * Whether to show the page number selector.
   * @default false
   */
  showPageNumberSelector?: boolean;

  /**
   * Content of the label to be shown in the pagination component
   */
  label?: string;

  /**
   * Whether to show the label.
   * @default false
   */
  showLabel?: boolean;

  /**
   * Whether the pagination is happening on client or server.
   * @default 'client'
   */
  paginationType?: 'client' | 'server';

  /**
   * The total number of possible items in the table.
   * Required when paginationType is 'server'.
   */
  totalItemCount?: number;

  /**
   * Callback function that is called when the page is changed.
   * Required when paginationType is 'server'.
   */
  onPageChange?: ({ page }: { page: number }) => void;
};

// Declarative alternative to the function-as-children pattern above - pass `columns` instead of
// `children` on `Table` and it builds the TableHeader/TableBody JSX for you. Simpler for the common
// case; drop to function-as-children only when you need something `columns` doesn't cover (a
// multi-row grouped header, `gridColumnStart`/`gridColumnEnd` spanning, editable cells, etc.).
// `Table` accepts exactly one of `children` or `columns`, never both.
type TableColumnConfig<Item> = {
  /**
   * Unique key for the column. Also used as the column's `headerKey` when `sortable` is true, so
   * it lines up with the key used in `sortFunctions`/`filterFunctions`.
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
   * Column width as a `grid-template-columns` track, e.g. `'120px'`, `'1fr'`,
   * `'minmax(100px, 1fr)'`. Omitting it on every column produces an equal-share `minmax(100px,
   * 1fr)` fallback for each - fine for a handful of columns, but a genuinely wide table (15+
   * columns) needs explicit widths sized to what each column actually holds, or every column ends
   * up the same width regardless of content (a 6-character code column as wide as a 30-character
   * name column).
   * @default 'minmax(100px, 1fr)'
   */
  width?: string;

  /**
   * Makes this column sortable - requires a matching entry in `Table`'s `sortFunctions` keyed by
   * the same `key`.
   * @default false
   */
  sortable?: boolean;

  /**
   * Content alignment for both this column's header cell and its body cells.
   * @default 'left'
   */
  textAlign?: 'left' | 'center' | 'right';
};

// Content for a `TableColumnConfig`'s `render` (or a hand-written `TableCell`'s children) - not a
// `TableCell` replacement, it renders *inside* one, same as `<Badge>`/`<Code>`/any other cell
// content. Covers the common "title + secondary line" cell (a name plus a note, a company plus a
// compliance flag) with real vertical padding baked in (see the "no vertical padding at any
// rowDensity" constraint above) and a built-in choice between clamping the description with a
// hover tooltip for the full text, or letting the row grow to fit the full paragraph.
type TableTitleDescriptionCellProps = {
  /**
   * The cell's primary, always-visible line.
   */
  title: React.ReactNode;

  /**
   * Secondary text rendered below `title`. Nothing renders for this line when omitted.
   */
  description?: string;

  /**
   * `'truncate'` clamps `description` to `descriptionLines` and shows the full text as a native
   * tooltip on hover, but only when it's actually cut off - a description short enough to already
   * fit gets no tooltip. `'wrap'` never clamps; the row grows to fit the full paragraph instead,
   * with no tooltip (nothing is hidden, so there's nothing for one to reveal).
   * @default 'truncate'
   */
  descriptionBehavior?: 'truncate' | 'wrap';

  /**
   * Number of lines `description` clamps to when `descriptionBehavior` is `'truncate'`.
   * @default 2
   */
  descriptionLines?: number;
};
```

## Usage Guidelines

**Do**

- Use `Table` for displaying structured, multi-column data that users need to scan, sort, compare, or act on.
- Prefer `columns` (a `TableColumnConfig<Item>[]`) over the function-as-children pattern for the
  common case - it's less JSX to write and covers sorting, filtering, `textAlign`, and per-column
  widths already. Drop to function-as-children (`<Table>{(tableData) => (<>...</>)}</Table>`) only
  for what `columns` doesn't cover: a multi-row grouped header, `gridColumnStart`/`gridColumnEnd`
  spanning, or editable cells. `Table` takes exactly one of `children`/`columns`, never both.
- Ensure every row object in `data.nodes` has a unique `id` field.
- Use `sortFunctions` with matching `headerKey` props on `TableHeaderCell` (or `sortable: true` on
  a `columns` entry) for sortable columns. Clicking cycles ascending -> descending -> unsorted
  (removable sort); shift-clicking a different sortable column adds it as a secondary/tertiary key
  instead of replacing the sort.
- Use `initialSort` to render the table already sorted on mount instead of requiring a click.
- Use `isHeaderSticky` and `isFirstColumnSticky` for large datasets that need scroll anchoring.
- Use `stickyColumnCount` (with `stickyColumnWidths`) instead of `isFirstColumnSticky` when more
  than one leading column - e.g. an actions column plus an identifier column - needs to stay
  frozen while a wide table scrolls horizontally. Give every column (frozen or not) an explicit
  `width` sized to what it actually holds once a table gets wide (15+ columns) - the equal-share
  fallback for an unset `width` gives a short code column and a long name column the same space.
- Use `filterFunctions` with matching `headerKey` props on `TableHeaderCell` for filterable columns
  — a compact filter input auto-renders inline in the header, no extra JSX required. A key present
  in `filterFunctions` without a matching `headerKey` on any `TableHeaderCell` still participates
  in global search, it just doesn't get its own column filter input - useful for a column that
  should be searchable but doesn't need a dedicated filter box.
- Add a `TableToolbarSearch` inside `TableToolbar` for global search across every filterable
  column (reuses the same `filterFunctions` predicates as column filters).
- For a narrow icon/action column, center it with `textAlign: 'center'` on that `columns` entry
  rather than hand-wrapping the content in a centering `Box` - reach for the `Box` wrapper only
  when centering alone isn't enough (multiple icons needing a specific `gap`).
- Give every `IconButton` in an action column `isHighlighted` or `emphasis="moderate"` - without
  one, its clickable area shrinks to the icon glyph's own size, under WCAG 2.2's 24x24px minimum
  target size (see `IconButton`'s knowledgebase entry).
- Use `Badge` `size="medium"` (or larger) for any badge inside a table cell, even at
  `rowDensity="compact"` - `size="xsmall"`/`"small"` render at 10px, smaller than the 12px body
  text typically next to them (see `Badge`'s knowledgebase entry).
- For a "title + secondary line" cell (a name plus a note, a company plus a compliance flag), use
  `TableTitleDescriptionCell` instead of hand-rolling it - it already has the vertical padding a
  plain stacked `Box` doesn't get by default, plus a built-in truncate-with-tooltip vs. wrap choice.
- When `data.nodes` can legitimately be empty (no data yet, or a search/filter that matched
  nothing), check its length and render an `EmptyState` in place of `Table` - an empty `Table`
  still renders its header with nothing underneath, which reads as broken rather than intentional.
  If a toolbar search needs to stay visible even when results are empty, swap only `TableBody`'s
  content instead (function-as-children, with a single spanning `TableCell` via
  `gridColumnStart`/`gridColumnEnd`) rather than replacing the whole `Table`.

**Don't**

- Don't expect column reordering or resizing — these are out of scope. Row expansion *is*
  supported for grouped (`isGrouped`) tables — see `expandedRowIds` above and the Grouping pattern
  below.
- Don't expect full keyboard grid navigation (roving tabindex, arrow-key cell movement) — filter
  inputs are plain native inputs reachable via Tab, but grid-style arrow-key navigation isn't
  built yet.
- Don't put arbitrary elements in the `toolbar` prop — only `TableToolbar` is accepted.
- Don't use `Table` for key-value pair display — use `InfoGroup` instead.
- Don't build a custom "clear sort" control — a third click on the same column already clears it.
- Don't use `Table` on mobile for complex data — consider a list-based layout instead.
- Don't rely on `stickyColumnCount`/`isFirstColumnSticky` being visible on mobile — Table
  disables sticky columns below the `s` breakpoint automatically, since the frozen width can
  exceed the entire viewport there.
- Don't assume `TableCell` reserves vertical breathing room for multi-line content - it has no
  vertical padding at any `rowDensity` (only centering), so stacked/multi-line cell content can end
  up touching the row border the moment it's taller than the row's own `minHeight`. Use
  `TableTitleDescriptionCell` for a title+description cell, or add your own `paddingY` for anything
  else multi-line.
- Don't assume `selectionType="multiple"` + server-side pagination "just works" for the header
  "select all" checkbox without checking your Table version - it needs to scope select-all/
  deselect-all to the *current page's* rows (not every selected id across all pages) for
  cross-page selection to behave correctly; read `selectedIds` from `onSelectionChange`, not the
  deprecated `values`, which silently drops any selected row not on the current page.

## Example

### Comprehensive Table with Advanced Features

This example demonstrates a fully-featured payment transactions table with multiple interactive elements including selection, sorting, sticky headers, row actions, editable cells, custom toolbar, pagination, and footer summaries.

```tsx
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableEditableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TableToolbar,
  TableToolbarActions,
  TablePagination,
  TableData,
  TableNode,
  Box,
  Text,
  Code,
  Button,
  IconButton,
  Badge,
  Amount,
  CheckIcon,
  CloseIcon,
  PlusIcon,
} from '@klear/klear360/components';

// Define your data types
type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: Date;
  type: 'Payout' | 'Refund';
  method: string;
  bank: string;
  account: string;
  name: string;
};

const PaymentTable = () => {
  // Sample data
  const payments: PaymentItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `klear${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)] as
      | 'Completed'
      | 'Pending'
      | 'Failed',
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)] as 'Payout' | 'Refund',
    method: ['Bank Transfer', 'Credit Card', 'PayPal'][Math.floor(Math.random() * 3)],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
  }));

  const tableData: TableData<PaymentItem> = {
    nodes: payments,
  };

  // State for selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Handle selection change
  const handleSelectionChange = ({ selectedIds }: { selectedIds: (string | number)[] }) => {
    setSelectedIds(selectedIds as string[]);
    console.log('Selected IDs:', selectedIds);
  };

  // Define sort functions
  const sortFunctions = {
    PAYMENT_ID: (array: TableNode<PaymentItem>[]) =>
      [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
    AMOUNT: (array: TableNode<PaymentItem>[]) => [...array].sort((a, b) => a.amount - b.amount),
    DATE: (array: TableNode<PaymentItem>[]) =>
      [...array].sort((a, b) => a.date.getTime() - b.date.getTime()),
    STATUS: (array: TableNode<PaymentItem>[]) =>
      [...array].sort((a, b) => a.status.localeCompare(b.status)),
  };

  return (
    <Box padding="spacing.5" overflow="auto" minHeight="400px">
      <Table
        data={tableData}
        defaultSelectedIds={['1', '3']}
        onSelectionChange={handleSelectionChange}
        isFirstColumnSticky
        isHeaderSticky
        selectionType="multiple"
        rowDensity="normal"
        showStripedRows
        showBorderedCells
        sortFunctions={sortFunctions}
        toolbar={
          <TableToolbar
            title="Payment Transactions"
            selectedTitle={`${selectedIds.length} Payments Selected`}
          >
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.2" icon={PlusIcon}>
                Export
              </Button>
              <Button>Process Selected</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            defaultPageSize={10}
            showPageSizePicker
            showPageNumberSelector
            onPageChange={({ page }) => console.log('Page changed:', page)}
            onPageSizeChange={({ pageSize }) => console.log('Page size changed:', pageSize)}
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT" textAlign="right">
                  Amount
                </TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                <TableHeaderCell textAlign="center">Actions</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>

            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow
                  key={index}
                  item={tableItem}
                  onClick={({ item }) => console.log('Row clicked:', item.id)}
                  onHover={({ item }) => console.log('Row hovered:', item.id)}
                  hoverActions={
                    <>
                      <Button variant="tertiary" size="xsmall">
                        View Details
                      </Button>
                      <IconButton
                        icon={CheckIcon}
                        isHighlighted
                        accessibilityLabel="Approve"
                        onClick={() => console.log('Approved', tableItem.paymentId)}
                      />
                      <IconButton
                        icon={CloseIcon}
                        isHighlighted
                        accessibilityLabel="Reject"
                        onClick={() => console.log('Rejected', tableItem.paymentId)}
                      />
                    </>
                  }
                >
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell textAlign="right">
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableEditableCell
                    accessibilityLabel="Account"
                    placeholder="Enter account number"
                    defaultValue={tableItem.account}
                    successText="Account is valid"
                    onChange={(value) => console.log('Account changed:', value)}
                  />
                  <TableCell>
                    {tableItem.date.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={
                        tableItem.status === 'Completed'
                          ? 'positive'
                          : tableItem.status === 'Pending'
                          ? 'notice'
                          : 'negative'
                      }
                    >
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell textAlign="center">
                    <Box display="flex" justifyContent="center" gap="spacing.2">
                      <IconButton
                        icon={CheckIcon}
                        accessibilityLabel="Approve"
                        onClick={() => console.log('Approved', tableItem.id)}
                      />
                      <IconButton
                        icon={CloseIcon}
                        accessibilityLabel="Reject"
                        onClick={() => console.log('Rejected', tableItem.id)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell textAlign="right">
                  <Amount
                    value={tableData.reduce((sum, item) => sum + item.amount, 0)}
                    weight="semibold"
                  />
                </TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>
    </Box>
  );
};

export default PaymentTable;
```

### Server-Side Pagination Example

This example shows how to implement a table with server-side pagination, where data is fetched from an API based on the current page, with loading states and proper handling of page changes.

```tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableData,
  Box,
  Spinner,
} from '@klear/klear360/components';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const ServerPaginatedTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Simulated API fetch
  const fetchUsers = async (page: number) => {
    setLoading(true);

    // Replace with actual API call
    setTimeout(() => {
      // Mock data generation for demonstration
      const newUsers = Array.from({ length: pageSize }, (_, i) => ({
        id: `user-${page * pageSize + i + 1}`,
        name: `User ${page * pageSize + i + 1}`,
        email: `user${page * pageSize + i + 1}@example.com`,
        role: ['Admin', 'User', 'Editor'][Math.floor(Math.random() * 3)],
      }));

      setUsers(newUsers);
      setTotalCount(100); // Total count from API
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = ({ page }: { page: number }) => {
    setCurrentPage(page);
  };

  const tableData: TableData<User> = {
    nodes: users,
  };

  return (
    <Box padding="spacing.5">
      <Table
        data={tableData}
        isLoading={loading}
        pagination={
          <TablePagination
            paginationType="server"
            totalItemCount={totalCount}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            defaultPageSize={pageSize}
            showPageSizePicker={false}
            showPageNumberSelector
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>

            <TableBody>
              {tableData.map((user, index) => (
                <TableRow key={index} item={user}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

export default ServerPaginatedTable;
```

### Table Nesting Pattern

Hierarchical data display with expandable rows and animations. Use for parent-child relationships or detailed information.

```tsx
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Badge,
  Box,
  Text,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@klear/klear360/components';

type Data = {
  id: string;
  name: string;
  totalAmount: number;
  status: string;
  nestedData: Data[];
};

type TableData = Data[];

const tableData: TableData = [
  {
    id: '1',
    name: 'John Doe',
    totalAmount: 100,
    status: 'Completed',
    nestedData: [],
  },
  {
    id: '2',
    name: 'Jane Smith',
    totalAmount: 200,
    status: 'Pending',
    nestedData: [],
  },
];
const TableNestingExample = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <Table data={{ nodes: tableData }}>
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {tableData.map((item) => (
              <>
                <TableRow key={item.id} item={item}>
                  <TableCell>
                    <Button
                      variant="tertiary"
                      size="xsmall"
                      icon={expandedRows.has(item.id) ? ChevronDownIcon : ChevronRightIcon}
                      onClick={() => toggleRow(item.id)}
                    />
                    {item.name}
                  </TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                  <TableCell>
                    <Badge color="positive">{item.status}</Badge>
                  </TableCell>
                </TableRow>

                {expandedRows.has(String(item.id)) && (
                  <TableRow key={`${item.id}-expanded`} item={item}>
                    <TableCell gridColumnStart={1} gridColumnEnd={4}>
                      <Box
                        backgroundColor="surface.background.gray.subtle"
                        padding="spacing.4"
                        borderRadius="medium"
                        margin="spacing.2"
                      >
                        {/* Nested content here */}
                        {item.nestedData?.map((child) => (
                          <Box key={child.id} display="flex" justifyContent="space-between">
                            <Text>{child.name}</Text>
                            <Text>{child.totalAmount}</Text>
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};

export default TableNestingExample;
```

### Table Spanning Pattern

Row and column spanning for complex layouts with merged cells. Use for grouping related data or creating summary sections. Use grid props on TableCell to span across multiple rows or columns for merged cells.

```jsx
{/* Header spanning */}
<TableHeaderCell gridColumnStart={2} gridColumnEnd={4}>
  Combined Header
</TableHeaderCell>

<TableRow item={item}>
  {/* Span across multiple columns */}
  <TableCell gridColumnStart={1} gridColumnEnd={4}>
    Summary spanning 3 columns
  </TableCell>
</TableRow>

<TableRow item={item}>
  {/* Span across multiple rows */}
  <TableCell gridRowStart={2} gridRowEnd={4}>
    Group spanning 2 rows
  </TableCell>
</TableRow>

{/* Footer spanning */}
<TableFooterCell gridColumnStart={1} gridColumnEnd={3}>
  Total
</TableFooterCell>
```

### Table Filtering & Search Pattern

Per-column filters and global search share the same `filterFunctions` predicates. A column becomes
filterable purely by having its `headerKey` present in `filterFunctions` — a compact filter input
auto-renders in the header, no extra JSX needed. `TableToolbarSearch` inside `TableToolbar` adds
global search across every filterable column.

```tsx
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarSearch,
  TableNode,
} from '@klear/klear360/components';

type Item = { id: string; name: string; status: string };

const filterFunctions = {
  NAME: (item: TableNode<Item>, value: string) =>
    item.name.toLowerCase().includes(value.toLowerCase()),
  STATUS: (item: TableNode<Item>, value: string) =>
    item.status.toLowerCase().includes(value.toLowerCase()),
};

const FilterableTable = ({ nodes }: { nodes: Item[] }) => (
  <Table
    data={{ nodes }}
    filterFunctions={filterFunctions}
    toolbar={
      <TableToolbar>
        <TableToolbarSearch placeholder="Search all columns" />
      </TableToolbar>
    }
  >
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
            <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index} item={item}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);
```

A column can also opt into a dropdown/multiselect picker instead of the default text input, via
`filterConfig` (keyed by `headerKey`, same convention as `filterFunctions`):

```tsx
const filterFunctionsWithDropdown = {
  ...filterFunctions,
  // Falls back to a substring match for the plain-string case (global search, or this column's
  // own `type: 'dropdown'` value) - never default that branch to `true`, or global search will
  // match every row the moment this column is present (see "Important Constraints" above).
  STATUS: (item: TableNode<Item>, value: string | string[]) =>
    Array.isArray(value)
      ? value.includes(item.status)
      : item.status.toLowerCase().includes(value.toLowerCase()),
};

<Table
  data={{ nodes }}
  filterFunctions={filterFunctionsWithDropdown}
  filterConfig={{
    STATUS: {
      type: 'multiselect', // or 'dropdown' for a single value
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  }}
>
  {/* ...same TableHeader/TableBody as above */}
</Table>;
```

### Table Multi-Column Sticky Pattern

Freeze more than one leading column (e.g. an actions column plus an identifier column) while the
remaining columns scroll horizontally underneath - use `columns` with explicit `width`s for the
frozen columns so `stickyColumnWidths` lines up with what's actually rendered. Trailing columns
(e.g. a pinned `Actions` column on the right) freeze the same way via `trailingStickyColumnCount`/
`trailingStickyColumnWidths` - the two sides are independent and composable.

```tsx
import { Table, TableColumnConfig } from '@klear/klear360/components';

type Item = { id: string; transactionId: string; companyName: string; vesselName: string; actions: never };

const columns: TableColumnConfig<Item>[] = [
  { key: 'transactionId', header: 'Transaction ID', render: (item) => item.transactionId, width: '150px' },
  { key: 'companyName', header: 'Company Name', render: (item) => item.companyName, width: '220px' },
  { key: 'vesselName', header: 'Vessel Name', render: (item) => item.vesselName, width: '220px' },
  // ...more scrolling columns
  { key: 'actions', header: 'Actions', render: renderRowActions, width: '140px' },
];

<Table
  data={data}
  columns={columns}
  stickyColumnCount={2}
  stickyColumnWidths={['150px', '220px']}
  trailingStickyColumnCount={1}
  trailingStickyColumnWidths={['140px']}
/>;
```

### Table Grouping Pattern

Hierarchical grouped data with automatic tree structure. Use for categorized data with parent-child relationships.
Every group-header row (a `treeXLevel === 0` row with children) automatically gets an
expand/collapse chevron - no extra JSX needed. By default every group starts expanded, matching
the always-expanded look of a plain grouped table; pass `expandedRowIds`/`onExpandedRowIdsChange`
to control which groups are expanded, or `defaultExpandedRowIds` to seed a different initial state.

```jsx
const TableGroupingExample = () => {
  const [expandedRowIds, setExpandedRowIds] = useState(['group-1']); // only this group starts open

  return (
    <Table
      data={groupedData}
      isGrouped
      showBorderedCells
      expandedRowIds={expandedRowIds}
      onExpandedRowIdsChange={setExpandedRowIds}
    >
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={index} item={item}>
                <TableCell
                  gridColumnStart={item.treeXLevel === 0 ? 1 : undefined}
                  gridColumnEnd={item.treeXLevel === 0 ? 4 : undefined}
                >
                  {item.name}
                </TableCell>
                {item.treeXLevel !== 0 && (
                  <>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};
```

### Table Grouped Multi-Row Header Pattern

`TableHeader` can contain more than one `TableHeaderRow` - a group-label row (spanning leaf
columns via `gridColumnStart`/`gridColumnEnd`) above the real leaf/column row. The LAST
`TableHeaderRow` is always the leaf row - that's the one `sortFunctions`/`filterFunctions` keys
and body columns line up with.

```tsx
<TableHeader>
  <TableHeaderRow>
    <TableHeaderCell gridColumnStart={1} gridColumnEnd={3}>
      Shipment
    </TableHeaderCell>
    <TableHeaderCell gridColumnStart={3} gridColumnEnd={5}>
      Financials
    </TableHeaderCell>
  </TableHeaderRow>
  <TableHeaderRow>
    <TableHeaderCell>ID</TableHeaderCell>
    <TableHeaderCell>Status</TableHeaderCell>
    <TableHeaderCell>Amount</TableHeaderCell>
    <TableHeaderCell>Currency</TableHeaderCell>
  </TableHeaderRow>
</TableHeader>
```

### Declarative Columns Config Pattern

The preferred way to build a table for the common case - pass `columns` (a `TableColumnConfig<Item>[]`) instead of function-as-children. `Table` builds the `TableHeader`/`TableBody` JSX for you.

```tsx
import { Table, TableColumnConfig } from '@klear/klear360/components';

type Item = { id: string; transactionId: string; companyName: string; status: string };

const columns: TableColumnConfig<Item>[] = [
  { key: 'transactionId', header: 'Transaction ID', render: (item) => item.transactionId, sortable: true },
  { key: 'companyName', header: 'Company Name', render: (item) => item.companyName, width: '220px' },
  { key: 'status', header: 'Status', render: (item) => <Badge>{item.status}</Badge>, textAlign: 'center' },
];

<Table data={data} columns={columns} sortFunctions={{ transactionId: (arr) => arr.sort((a, b) => a.transactionId.localeCompare(b.transactionId)) }} />;
```

### Action Column Pattern

A narrow icon/action column - center it with `textAlign` on the column config, and give every `IconButton` `isHighlighted` (or `emphasis="moderate"`) so its clickable area meets the 24x24px minimum target size instead of collapsing to the bare icon glyph.

```tsx
const columns: TableColumnConfig<Item>[] = [
  {
    key: 'actions',
    header: 'Actions',
    width: '72px',
    textAlign: 'center',
    render: (item) => (
      <IconButton
        isHighlighted
        icon={EyeIcon}
        size="small"
        accessibilityLabel={`View ${item.transactionId}`}
        onClick={() => viewItem(item)}
      />
    ),
  },
  // ...other columns
];
```

Multiple icons in one action cell need more than `textAlign` (a specific `gap` between them) - wrap them in a centering `Box` instead: `<Box display="flex" justifyContent="center" gap="spacing.3">...</Box>`.

### Title + Description Cell Pattern

A "title + secondary line" cell (a name plus a note) via `TableTitleDescriptionCell` - real vertical padding included, plus a truncate-with-tooltip vs. wrap choice, instead of hand-rolling a stacked `Box` that ends up touching the row border.

```tsx
import { Table, TableColumnConfig, TableTitleDescriptionCell } from '@klear/klear360/components';

const columns: TableColumnConfig<Item>[] = [
  {
    key: 'companyName',
    header: 'Company / Note',
    width: '320px',
    render: (item) => (
      <TableTitleDescriptionCell
        title={item.companyName}
        description={item.complianceNote}
        // 'wrap' shows the full note always, growing the row instead of clamping + tooltip
        descriptionBehavior="truncate"
        descriptionLines={2}
      />
    ),
  },
];
```

### Wide Dataset Pattern

A genuinely wide table (15+ columns) needs explicit per-column `width`s sized to what each column holds - the equal-share `minmax(100px, 1fr)` fallback gives a 6-character code column the same width as a 30-character name column. Pair with `stickyColumnCount`/`stickyColumnWidths` to freeze the columns that matter while the rest scrolls; `selectionType="multiple"` adds a checkbox column that's frozen automatically alongside them (not counted in `stickyColumnCount`).

```tsx
const columns: TableColumnConfig<Item>[] = [
  { key: 'transactionId', header: 'Transaction ID', render: (item) => item.transactionId, width: '150px' },
  { key: 'companyName', header: 'Company Name', render: (item) => item.companyName, width: '220px' },
  { key: 'hsCode', header: 'HS Code', render: (item) => item.hsCode, width: '110px' }, // short, fixed-format
  // ...15+ columns total, each with its own meaningful width
];

<Table
  data={data}
  columns={columns}
  selectionType="multiple"
  stickyColumnCount={2}
  stickyColumnWidths={['150px', '220px']}
  isHeaderSticky
/>;
```

### Empty State Pattern

`data.nodes` can legitimately be empty (no data yet, or a search/filter matched nothing) - an empty `Table` still renders its header row with nothing underneath, which reads as broken. Check the length before rendering `Table` and swap in an `EmptyState` instead.

```tsx
const isEmpty = data.nodes.length === 0;

{isEmpty ? (
  <EmptyState
    title="No transactions yet"
    description="Import your first transactions to see them here."
  >
    <Button onClick={onImport}>Import Transactions</Button>
  </EmptyState>
) : (
  <Table data={data} columns={columns} />
)}
```

If a toolbar search needs to stay visible even with zero results (so the user has a way to clear it), swap only `TableBody`'s content instead of the whole `Table` - use function-as-children and a single `TableCell` spanning every column via `gridColumnStart={1}`/`gridColumnEnd={columns.length + 1}` holding the `EmptyState`, while `TableHeader` and `toolbar` stay mounted as normal.
