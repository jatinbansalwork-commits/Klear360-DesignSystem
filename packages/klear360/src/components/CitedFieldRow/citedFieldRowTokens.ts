import type { CitedFieldRowSourceVariant } from './types';
import { size } from '~tokens/global';

// Diameter of the leading dot on the citation chip.
const citeDotSize = size[6];

/** Shared with `CitedFieldRow.Header` so column labels line up with data rows. */
const citedFieldRowGridTemplateColumns = 'minmax(7.5rem, 42%) minmax(0, 1fr)';

/**
 * Gray "subtle" surface — resolves to `hsla(210, 40%, 96%, 1)` in the default theme.
 * Used for the label column and value-cell hover tint.
 */
const citedFieldRowSubtleBackground = 'surface.background.gray.subtle';

type SourceVariantTokens = {
  background: string;
  border: string;
  text: string;
};

/**
 * Color tokens per `source.variant`, for the chip's default (non-active) state. `trace` has no
 * border - matching the "doc" (document-grounded) chip reading as more clearly contained/bordered
 * than the "trace" (Track & Trace-grounded) one.
 */
const sourceVariantTokens: Record<CitedFieldRowSourceVariant, SourceVariantTokens> = {
  doc: {
    background: 'surface.background.primary.subtle',
    border: 'surface.border.primary.muted',
    text: 'surface.text.primary.normal',
  },
  trace: {
    background: 'feedback.background.information.subtle',
    border: 'transparent',
    text: 'feedback.text.information.intense',
  },
};

// Active/selected chip state - same solid accent treatment regardless of `variant`, so the
// currently-viewed citation reads as one consistent "selected" state across the row group.
const activeSourceTokens: SourceVariantTokens = {
  background: 'surface.background.primary.intense',
  border: 'surface.background.primary.intense',
  text: 'surface.text.staticWhite.normal',
};

// Disabled (citeMuted) opacity - nearest token to the ~0.55 this is modeled on.
const citeMutedChipOpacity = 700;

const errorValueCellTokens = {
  background: 'feedback.background.negative.subtle',
  borderLeft: 'interactive.border.negative.default',
  text: 'feedback.text.negative.intense',
} as const;

const successValueCellTokens = {
  background: 'feedback.background.positive.subtle',
  borderLeft: 'interactive.border.positive.default',
  text: 'feedback.text.positive.intense',
} as const;

export {
  citeDotSize,
  citedFieldRowGridTemplateColumns,
  citedFieldRowSubtleBackground,
  sourceVariantTokens,
  activeSourceTokens,
  citeMutedChipOpacity,
  errorValueCellTokens,
  successValueCellTokens,
};
export type { SourceVariantTokens };
