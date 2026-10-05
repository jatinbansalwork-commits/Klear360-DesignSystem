import React from 'react';
import type { CitedFieldRowHeaderProps } from './types';
import {
  citedFieldRowGridTemplateColumns,
  citedFieldRowSubtleBackground,
} from './citedFieldRowTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeSize } from '~utils';
import { size } from '~tokens/global';

const headerLabelProps = {
  variant: 'caption',
  size: 'small',
  weight: 'medium',
  color: 'surface.text.gray.muted',
} as const;

const _CitedFieldRowHeader = (
  {
    fieldColumnLabel = 'Field',
    valueColumnLabel = 'Value',
    sourceColumnLabel = 'Source',
    isSourceColumnVisible = true,
    testID,
    ...rest
  }: CitedFieldRowHeaderProps,
  ref: React.Ref<HTMLDivElement>,
): React.ReactElement => {
  return (
    <BaseBox
      ref={ref as never}
      role="row"
      display="grid"
      gridTemplateColumns={citedFieldRowGridTemplateColumns}
      alignItems="stretch"
      minWidth={0 as never}
      borderBottomWidth="thin"
      borderBottomStyle="solid"
      borderBottomColor="surface.border.gray.muted"
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.CitedFieldRowHeader, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        role="columnheader"
        display="flex"
        alignItems="center"
        padding="spacing.3"
        borderRightWidth="thin"
        borderRightStyle="solid"
        borderRightColor="surface.border.gray.muted"
        backgroundColor={citedFieldRowSubtleBackground}
      >
        <Text {...headerLabelProps}>{fieldColumnLabel}</Text>
      </BaseBox>

      <BaseBox
        role="columnheader"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="spacing.3"
        minWidth={0 as never}
        minHeight={makeSize(size[40])}
        paddingY="spacing.2"
        paddingX="spacing.3"
        backgroundColor="interactive.background.staticWhite.default"
      >
        <Text {...headerLabelProps}>{valueColumnLabel}</Text>
        {isSourceColumnVisible ? <Text {...headerLabelProps}>{sourceColumnLabel}</Text> : null}
      </BaseBox>
    </BaseBox>
  );
};

/**
 * Column header for a stack of `CitedFieldRow`s. Uses the same grid as each row so "Field",
 * "Value", and "Source" align with the label column, value text, and citation chips.
 */
const CitedFieldRowHeader = assignWithoutSideEffects(React.forwardRef(_CitedFieldRowHeader), {
  displayName: 'CitedFieldRow.Header',
  componentId: 'CitedFieldRowHeader',
});

export { CitedFieldRowHeader };
