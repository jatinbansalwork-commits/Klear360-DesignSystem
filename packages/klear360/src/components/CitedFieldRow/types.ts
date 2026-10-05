import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

/**
 * Visual treatment of a citation source.
 *
 * - `doc`: the value was extracted from a source document (e.g. a bill of lading) - subtle
 *   accent (primary) background and border.
 * - `trace`: the value is grounded in a Track & Trace event instead of a document - subtle
 *   information background, no border.
 *
 * @default 'doc'
 */
type CitedFieldRowSourceVariant = 'doc' | 'trace';

type CitedFieldRowSource = {
  /**
   * Visible label on the citation chip, e.g. `"BOL p1"` or `"Track & Trace"`.
   */
  label: string;
  /**
   * @default 'doc'
   */
  variant?: CitedFieldRowSourceVariant;
  /**
   * Marks this row's citation as the one currently being viewed (e.g. the document page it
   * points to is on screen). Draws the chip filled-in instead of its default subtle style.
   *
   * @default false
   */
  isActive?: boolean;
  /**
   * Accessible name and tooltip text for the chip, e.g. `"View MBOL on BOL, page 1"`. Falls
   * back to `label` when omitted.
   */
  accessibilityLabel?: string;
};

type CitedFieldRowProps = {
  /**
   * The field's name, shown in the left column.
   */
  label: string;
  /**
   * The field's value, shown in the right column in display mode. Renders as an em dash in
   * `surface.text.gray.muted` when `null`, `undefined`, or an empty string.
   */
  value?: React.ReactNode;
  /**
   * Renders `control` instead of `value` - for editing the field in place.
   *
   * @default false
   */
  isEditable?: boolean;
  /**
   * The editable form control shown instead of `value` when `isEditable` is `true` (e.g. a
   * `TextInput`). Ignored when `isEditable` is `false`.
   */
  control?: React.ReactNode;
  /**
   * The source this value was extracted from. Renders a citation chip after the value and
   * clicking it fires `onCiteClick`. A row with no `source` is "ungrounded" - its label renders
   * muted, and it never shows a chip. Hidden entirely while `isEditable` is `true`.
   */
  source?: CitedFieldRowSource;
  /**
   * Dims the row and disables its citation chip - driven by a consumer-owned "show only
   * ungrounded fields" filter elsewhere on the page, not by this component.
   *
   * @default false
   */
  isCiteMuted?: boolean;
  /**
   * Marks this row as the current citation target (e.g. its cited document page/bbox is the one
   * being shown), drawing an accent background and an inset ring around the value cell.
   *
   * @default false
   */
  isCiteTarget?: boolean;
  /**
   * Validation state for the field value. When `'error'` or `'success'`, the value cell uses
   * feedback colors and `errorText` / `successText` is shown below the value (or `control` when
   * `isEditable` is true).
   *
   * @default 'none'
   */
  validationState?: 'none' | 'error' | 'success';
  /**
   * Error message shown when `validationState` is `'error'`.
   */
  errorText?: string;
  /**
   * Success message shown when `validationState` is `'success'`.
   */
  successText?: string;
  /**
   * Fired when the citation chip is clicked (never on hover). The component only renders the
   * chip and reports the click - scrolling to a document, highlighting a bounding box, and
   * tracking which chip is active across a group of rows are all the consumer's responsibility.
   */
  onCiteClick?: (source: CitedFieldRowSource) => void;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsKlear360;

type CitedFieldRowHeaderProps = {
  /**
   * Column label for the field name column.
   *
   * @default 'Field'
   */
  fieldColumnLabel?: string;
  /**
   * Column label for the extracted value (left side of the value column).
   *
   * @default 'Value'
   */
  valueColumnLabel?: string;
  /**
   * Column label aligned with citation chips. Hidden when `isSourceColumnVisible` is `false`.
   *
   * @default 'Source'
   */
  sourceColumnLabel?: string;
  /**
   * When `false`, only the value column label is shown (for tables without citations).
   *
   * @default true
   */
  isSourceColumnVisible?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsKlear360;

export type {
  CitedFieldRowProps,
  CitedFieldRowSource,
  CitedFieldRowSourceVariant,
  CitedFieldRowHeaderProps,
};
