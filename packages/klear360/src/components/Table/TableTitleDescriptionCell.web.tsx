import React from 'react';
import type { TableTitleDescriptionCellProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { useTruncationTitle } from '~utils/useTruncationTitle';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * Content for a `TableColumnConfig`'s `render` (or a hand-written `TableCell`'s children) - a
 * title plus optional secondary description, stacked. Not a `TableCell` replacement itself; it
 * renders *inside* one, the same way `<Badge>`/`<Code>`/any other cell content does.
 *
 * Wraps two things this design system already has, rather than introducing new ones:
 * `Text`'s own `truncateAfterLines` for the clamp, and `useTruncationTitle` (the same mechanism
 * `Badge` uses internally for its own truncated label) for the hover tooltip that appears exactly
 * when the description is actually cut off - never for text that already fits.
 *
 * Always applies real vertical padding (not just centering) around its content - see the Compact
 * Density Multiline example for what happens without it: stacked/multi-line content ends up
 * touching the row border, at any `rowDensity`, the moment it's taller than the row's own
 * `minHeight`. That's a manual recipe there; this component bakes it in.
 */
const _TableTitleDescriptionCell = ({
  title,
  description,
  descriptionBehavior = 'truncate',
  descriptionLines = 2,
  testID,
  ...rest
}: TableTitleDescriptionCellProps): React.ReactElement => {
  const isTruncated = descriptionBehavior === 'truncate';
  // Only meaningful in truncate mode - in wrap mode nothing is ever clamped, so there's nothing
  // for a tooltip to reveal that isn't already fully visible.
  const { containerRef, textRef } = useTruncationTitle({
    content: isTruncated ? description : undefined,
  });

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      gap="spacing.1"
      paddingY="spacing.2"
      {...metaAttribute({ name: MetaConstants.TableCell, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <Text size="small" weight="medium">
        {title}
      </Text>
      {description ? (
        isTruncated ? (
          <BaseBox ref={containerRef as never} overflow="hidden">
            <Text
              ref={textRef as never}
              size="small"
              color="surface.text.gray.muted"
              truncateAfterLines={descriptionLines}
            >
              {description}
            </Text>
          </BaseBox>
        ) : (
          <Text size="small" color="surface.text.gray.muted">
            {description}
          </Text>
        )
      ) : null}
    </BaseBox>
  );
};

const TableTitleDescriptionCell = assignWithoutSideEffects(_TableTitleDescriptionCell, {
  displayName: 'TableTitleDescriptionCell',
  componentId: 'TableTitleDescriptionCell',
});

export { TableTitleDescriptionCell };
