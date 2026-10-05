import React from 'react';
import styled from 'styled-components';
import type { CitedFieldRowProps, CitedFieldRowSource } from './types';
import {
  citeDotSize,
  sourceVariantTokens,
  activeSourceTokens,
  citeMutedChipOpacity,
  citedFieldRowGridTemplateColumns,
  citedFieldRowSubtleBackground,
  errorValueCellTokens,
  successValueCellTokens,
} from './citedFieldRowTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { CheckIcon } from '~components/Icons';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import getIn from '~utils/lodashButBetter/get';
import { makeBorderSize, makeSize, makeSpace, castWebType } from '~utils';
import { opacity, size } from '~tokens/global';

// The value cell's own `data-klear360-component` attribute doubles as the hover target below -
// scoped to this row instance via `&`, so it never bleeds into other rows.
const VALUE_CELL_ATTR_SELECTOR = `[data-klear360-component="${MetaConstants.CitedFieldRowValue}"]`;

const StyledRow = styled(BaseBox)<{ $isCiteMuted: boolean }>(({ theme, $isCiteMuted }) => ({
  ...(!$isCiteMuted && {
    [`&:hover ${VALUE_CELL_ATTR_SELECTOR}`]: {
      backgroundColor: getIn(theme.colors, citedFieldRowSubtleBackground as never),
      transitionProperty: 'background-color',
      transitionDuration: castWebType(theme.motion.duration.quick),
      transitionTimingFunction: castWebType(theme.motion.easing.standard),
    },
  }),
}));

const StyledSourceRefButton = styled.button<{
  $variant: 'doc' | 'trace';
  $isActive: boolean;
  $isDisabled: boolean;
}>(({ theme, $variant, $isActive, $isDisabled }) => {
  const tokens = $isActive ? activeSourceTokens : sourceVariantTokens[$variant];
  const transitionProperties = ['background-color', 'border-color', 'color', 'box-shadow'];

  return {
    appearance: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: makeSpace(theme.spacing[1]),
    margin: 0,
    padding: `${makeSpace(theme.spacing[1])} ${makeSpace(theme.spacing[2])}`,
    border: `${makeBorderSize(theme.border.width.thin)} solid ${getIn(
      theme.colors,
      tokens.border as never,
    )}`,
    borderRadius: makeSize(theme.border.radius.max),
    backgroundColor: getIn(theme.colors, tokens.background as never),
    color: getIn(theme.colors, tokens.text as never),
    font: 'inherit',
    textAlign: 'start',
    whiteSpace: 'nowrap',
    cursor: $isDisabled ? 'not-allowed' : 'pointer',
    opacity: $isDisabled ? opacity[citeMutedChipOpacity] : undefined,
    boxShadow: 'none',
    transitionProperty: transitionProperties.join(', '),
    transitionDuration: castWebType(theme.motion.duration.quick),
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
    '&:hover:not(:disabled)': {
      boxShadow: castWebType(theme.elevation.lowRaised),
    },
    '&:hover:not(:disabled) span': {
      textDecoration: 'none',
    },
    '&:focus-visible': getFocusRingStyles({ theme }),
  };
});

const StyledTabularNumsSpan = styled.span({
  minWidth: 0,
  fontVariantNumeric: 'tabular-nums',
});

const SourceRefChip = ({
  source,
  isDisabled,
  onClick,
}: {
  source: CitedFieldRowSource;
  isDisabled: boolean;
  onClick: () => void;
}): React.ReactElement => {
  const variant = source.variant ?? 'doc';
  const tip = source.accessibilityLabel ?? source.label;

  return (
    <StyledSourceRefButton
      type="button"
      $variant={variant}
      $isActive={Boolean(source.isActive)}
      $isDisabled={isDisabled}
      disabled={isDisabled}
      onClick={onClick}
      title={tip}
      {...makeAccessible({ label: tip })}
      {...metaAttribute({ name: MetaConstants.CitedFieldRowSource })}
    >
      <BaseBox
        as="span"
        flexShrink={0}
        width={makeSize(citeDotSize)}
        height={makeSize(citeDotSize)}
        borderRadius="round"
        backgroundColor="currentColor"
        aria-hidden="true"
      />
      <Text as="span" variant="body" size="small" weight="medium" color="currentColor">
        {source.label}
      </Text>
    </StyledSourceRefButton>
  );
};

const _CitedFieldRow = (
  {
    label,
    value,
    isEditable = false,
    control,
    source,
    isCiteMuted = false,
    isCiteTarget = false,
    validationState = 'none',
    errorText,
    successText,
    onCiteClick,
    testID,
    ...rest
  }: CitedFieldRowProps,
  ref: React.Ref<HTMLDivElement>,
): React.ReactElement => {
  const isGrounded = Boolean(source);
  const isEmpty = value == null || value === '';
  const displayValue = isEmpty ? '—' : value;
  const isError = validationState === 'error';
  const isSuccess = validationState === 'success';
  const showErrorText = isError && Boolean(errorText);
  const showSuccessText = isSuccess && Boolean(successText);
  const validationHintId = React.useId();
  const valueAccentBorder = isError
    ? errorValueCellTokens.borderLeft
    : isSuccess
    ? successValueCellTokens.borderLeft
    : isCiteTarget
    ? 'surface.border.primary.normal'
    : undefined;
  const valueBackground = isError
    ? errorValueCellTokens.background
    : isSuccess
    ? successValueCellTokens.background
    : isCiteTarget
    ? 'surface.background.primary.subtle'
    : 'interactive.background.staticWhite.default';
  const valueTextColor = isError
    ? errorValueCellTokens.text
    : isSuccess
    ? successValueCellTokens.text
    : isEmpty
    ? 'surface.text.gray.muted'
    : 'surface.text.gray.normal';
  const showValidationHint = showErrorText || showSuccessText;

  const handleCiteClick = (): void => {
    if (!source || isCiteMuted) return;
    onCiteClick?.(source);
  };

  return (
    <StyledRow
      ref={ref as never}
      $isCiteMuted={isCiteMuted}
      display="grid"
      gridTemplateColumns={citedFieldRowGridTemplateColumns}
      alignItems="stretch"
      minWidth={0 as never}
      borderBottomWidth="thin"
      borderBottomStyle="solid"
      borderBottomColor="surface.border.gray.subtle"
      opacity={isCiteMuted ? opacity[citeMutedChipOpacity] : undefined}
      pointerEvents={isCiteMuted ? 'none' : undefined}
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.CitedFieldRow, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...(isCiteMuted ? { 'aria-disabled': true } : {})}
    >
      <BaseBox
        display="flex"
        alignItems="center"
        padding="spacing.3"
        borderRightWidth="thin"
        borderRightStyle="solid"
        borderRightColor="surface.border.gray.subtle"
        backgroundColor={citedFieldRowSubtleBackground}
      >
        <Text
          variant="body"
          size="medium"
          weight="regular"
          color={isGrounded ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}
        >
          {label}
        </Text>
      </BaseBox>

      <BaseBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap={showValidationHint ? 'spacing.1' : undefined}
        minWidth={0 as never}
        minHeight={makeSize(size[40])}
        paddingY="spacing.2"
        paddingX="spacing.3"
        borderLeftWidth={valueAccentBorder ? 'thick' : undefined}
        borderLeftStyle={valueAccentBorder ? 'solid' : undefined}
        borderLeftColor={valueAccentBorder as never}
        backgroundColor={valueBackground}
        aria-invalid={isError ? true : undefined}
        {...(showValidationHint ? { 'aria-describedby': validationHintId } : {})}
        {...metaAttribute({ name: MetaConstants.CitedFieldRowValue })}
      >
        {isEditable ? (
          control
        ) : (
          <BaseBox
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="spacing.3"
            minWidth={0 as never}
          >
            <StyledTabularNumsSpan>
              <Text
                variant="body"
                size="small"
                weight={isEmpty ? 'regular' : 'medium'}
                color={valueTextColor}
                truncateAfterLines={1}
              >
                {displayValue}
              </Text>
            </StyledTabularNumsSpan>
            {source ? (
              <SourceRefChip source={source} isDisabled={isCiteMuted} onClick={handleCiteClick} />
            ) : null}
          </BaseBox>
        )}
        {showErrorText ? (
          <BaseBox as="span" id={validationHintId}>
            <Text
              variant="caption"
              size="small"
              color="feedback.text.negative.intense"
              {...metaAttribute({ name: MetaConstants.CitedFieldRowError })}
            >
              {errorText}
            </Text>
          </BaseBox>
        ) : null}
        {showSuccessText ? (
          <BaseBox
            as="span"
            id={validationHintId}
            display="flex"
            alignItems="center"
            gap="spacing.1"
          >
            <CheckIcon size="small" color="feedback.icon.positive.intense" />
            <Text
              variant="caption"
              size="small"
              color="feedback.text.positive.intense"
              {...metaAttribute({ name: MetaConstants.CitedFieldRowSuccess })}
            >
              {successText}
            </Text>
          </BaseBox>
        ) : null}
      </BaseBox>
    </StyledRow>
  );
};

/**
 * CitedFieldRow
 *
 * A label/value row for read-only (or editable) extracted data, with an optional citation chip
 * linking the value back to its source document or event. Designed to sit inside a `Card`'s
 * body, stacked with other `CitedFieldRow`s to form a field table.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <CitedFieldRow
 *   label="MBOL"
 *   value="MEDUXYZ123"
 *   source={{ label: 'BOL p1' }}
 *   onCiteClick={(source) => scrollToSource(source)}
 * />
 * ```
 */
const CitedFieldRow = assignWithoutSideEffects(React.forwardRef(_CitedFieldRow), {
  displayName: 'CitedFieldRow',
  componentId: 'CitedFieldRow',
});

export { CitedFieldRow };
export type { CitedFieldRowProps, CitedFieldRowSource };
