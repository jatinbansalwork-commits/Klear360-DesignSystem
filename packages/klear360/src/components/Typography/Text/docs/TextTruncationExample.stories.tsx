import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Text } from '../Text';
import { Box } from '~components/Box';
import { Heading, Text as BodyText } from '~components/Typography';
import { useTruncationTitle } from '~utils/useTruncationTitle';

const TextMeta: Meta = {
  title: 'Components/Typography/Text/Examples/Truncation',
  tags: ['autodocs'],
  component: Text,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    chromatic: { disableSnapshot: true },
  },
};

const longSingleLineText =
  'Northstar Logistics International Freight Forwarding & Customs Brokerage LLC';
const longMultilineText =
  'This shipment was flagged for manual review because the declared HS code did not match the commercial invoice description, and requires broker sign-off before it can proceed to customs clearance.';

/**
 * `truncateAfterLines={1}` alone gets you the visual ellipsis - it does not get you a tooltip.
 * Hovering this `Text` for more than a moment shows nothing, because nothing ever set a `title`
 * attribute; the full string is only visible by inspecting the DOM. This is the gap a consumer
 * hits reaching for `truncateAfterLines` without also knowing about `useTruncationTitle`.
 */
export const TruncatedWithoutTooltip = (): React.ReactElement => (
  <Box padding="spacing.5" maxWidth="400px">
    <Box paddingBottom="spacing.4">
      <Heading>Truncated, No Tooltip</Heading>
      <BodyText>
        `truncateAfterLines` set to 1, no `title` wired up - hover the text below and nothing shows.
      </BodyText>
    </Box>
    <Box maxWidth="220px" overflow="hidden">
      <Text truncateAfterLines={1}>{longSingleLineText}</Text>
    </Box>
  </Box>
);

/**
 * The recommended pattern - the same one `Badge` already uses internally for its own truncated
 * label - reusing `useTruncationTitle` rather than reimplementing overflow detection: a
 * `containerRef` on the width/height-constrained wrapper, a `textRef` on the `Text` itself, and
 * `content` set to the same string being rendered. It only sets the native `title` attribute
 * (a real browser tooltip on hover, no extra JS) when the text is *actually* truncated - measured
 * by comparing the constrained container's `clientWidth`/`clientHeight` against the text node's
 * own `scrollWidth`/`scrollHeight` - so a string that happens to fit gets no `title` at all, and
 * widening the browser window (try it) removes the tooltip the moment truncation stops applying.
 *
 * Checking only `scrollWidth` - the instinctive approach for "is this text cut off" - would work
 * here but silently never fire for `MultilineTruncationWithTooltip` below: `truncateAfterLines`
 * beyond `1` clips via `-webkit-line-clamp`, which overflows *vertically*, not horizontally.
 * `useTruncationTitle` already checks both, which is the whole reason to reuse it instead of
 * hand-rolling a single-axis check that only covers the single-line case.
 */
export const TruncatedWithTooltip = (): React.ReactElement => {
  const { containerRef, textRef } = useTruncationTitle({ content: longSingleLineText });

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <Box paddingBottom="spacing.4">
        <Heading>Truncated, With Tooltip</Heading>
        <BodyText>
          Same text, same `truncateAfterLines` of 1 - `useTruncationTitle` adds the native `title`
          so hovering shows the full company name.
        </BodyText>
      </Box>
      <Box ref={containerRef as never} maxWidth="220px" overflow="hidden">
        <Text ref={textRef as never} truncateAfterLines={1}>
          {longSingleLineText}
        </Text>
      </Box>
    </Box>
  );
};

/**
 * `useTruncationTitle` catches vertical (line-clamp) overflow too, not just single-line
 * horizontal overflow - `truncateAfterLines={2}` here clips via `-webkit-line-clamp: 2`, which
 * `scrollHeight > clientHeight` (not `scrollWidth`) is what actually detects.
 */
export const MultilineTruncationWithTooltip = (): React.ReactElement => {
  const { containerRef, textRef } = useTruncationTitle({ content: longMultilineText });

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <Box paddingBottom="spacing.4">
        <Heading>Multiline Truncation, With Tooltip</Heading>
        <BodyText>
          `truncateAfterLines` set to 2 clips vertically - `useTruncationTitle` still detects it
          (via `scrollHeight`) and shows the full note on hover.
        </BodyText>
      </Box>
      <Box ref={containerRef as never} maxWidth="280px" overflow="hidden">
        <Text ref={textRef as never} truncateAfterLines={2}>
          {longMultilineText}
        </Text>
      </Box>
    </Box>
  );
};

export default TextMeta;
