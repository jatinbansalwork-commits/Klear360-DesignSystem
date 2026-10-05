import React from 'react';
import type { CitedFieldRowHeaderProps } from './types';
import { citedFieldRowSubtleBackground } from './citedFieldRowTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeAccessible } from '~utils/makeAccessible';

const headerLabelColor = 'surface.text.gray.muted' as const;

const _CitedFieldRowHeader = (
  {
    fieldColumnLabel = 'Field',
    valueColumnLabel = 'Value',
    sourceColumnLabel = 'Source',
    isSourceColumnVisible = true,
    testID,
    ...rest
  }: CitedFieldRowHeaderProps,
  ref: React.Ref<unknown>,
): React.ReactElement => {
  return (
    <BaseBox
      ref={ref as never}
      flexDirection="row"
      alignItems="stretch"
      borderBottomWidth="thin"
      borderBottomColor="surface.border.gray.muted"
      {...makeAccessible({ role: 'row' })}
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.CitedFieldRowHeader, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        width="42%"
        flexDirection="row"
        alignItems="center"
        padding="spacing.3"
        borderRightWidth="thin"
        borderRightColor="surface.border.gray.muted"
        backgroundColor={citedFieldRowSubtleBackground as never}
        {...makeAccessible({ role: 'columnheader' })}
      >
        <Text variant="caption" size="small" weight="medium" color={headerLabelColor}>
          {fieldColumnLabel}
        </Text>
      </BaseBox>

      <BaseBox
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="spacing.3"
        paddingY="spacing.2"
        paddingX="spacing.3"
        backgroundColor="interactive.background.staticWhite.default"
        {...makeAccessible({ role: 'columnheader' })}
      >
        <Text variant="caption" size="small" weight="medium" color={headerLabelColor}>
          {valueColumnLabel}
        </Text>
        {isSourceColumnVisible ? (
          <Text variant="caption" size="small" weight="medium" color={headerLabelColor}>
            {sourceColumnLabel}
          </Text>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

const CitedFieldRowHeader = assignWithoutSideEffects(React.forwardRef(_CitedFieldRowHeader), {
  displayName: 'CitedFieldRow.Header',
  componentId: 'CitedFieldRowHeader',
});

export { CitedFieldRowHeader };
