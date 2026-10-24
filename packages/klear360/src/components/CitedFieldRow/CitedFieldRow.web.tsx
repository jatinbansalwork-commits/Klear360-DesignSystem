import React from 'react';
import styles from './CitedFieldRow.module.scss';
import type { CitedFieldRowProps, CitedFieldRowSource } from './types';
import {
  citeDotSize,
  citedFieldRowGridTemplateColumns,
  citedFieldRowSubtleBackground,
  errorValueCellTokens,
  successValueCellTokens,
  citeMutedChipOpacity,
} from './citedFieldRowTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { CheckIcon } from '~components/Icons';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeSize } from '~utils';
import { opacity, size } from '~tokens/global';

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
  const isActive = Boolean(source.isActive);

  return (
    <button
      type="button"
      className={styles.sourceRef}
      data-variant={variant}
      data-active={isActive ? true : undefined}
      disabled={isDisabled}
      onClick={onClick}
      title={tip}
      style={isDisabled ? { opacity: opacity[citeMutedChipOpacity] } : undefined}
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
    </button>
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
    <BaseBox
      ref={ref as never}
      className={styles.row}
      data-cite-muted={isCiteMuted ? true : undefined}
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
        className={styles.valueCell}
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
            <span className={styles.tabularNums}>
              <Text
                variant="body"
                size="small"
                weight={isEmpty ? 'regular' : 'medium'}
                color={valueTextColor}
                truncateAfterLines={1}
              >
                {displayValue}
              </Text>
            </span>
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
    </BaseBox>
  );
};

/**
 * CitedFieldRow
 *
 * A label/value row for read-only (or editable) extracted data, with an optional citation chip
 * linking the value back to its source document or event. Designed to sit inside a `Card`'s
 * body, stacked with other `CitedFieldRow`s to form a field table.
 *
 * Pass `overflow="hidden"` on the wrapping `Card` so the last row's bottom corners are clipped
 * to the card's rounded corners, instead of overhanging them with square corners of their own.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <Card overflow="hidden">
 *   <CardBody padding="spacing.0" role="table">
 *     <CitedFieldRow.Header />
 *     <CitedFieldRow
 *       label="MBOL"
 *       value="MEDUXYZ123"
 *       source={{ label: 'BOL p1' }}
 *       onCiteClick={(source) => scrollToSource(source)}
 *     />
 *   </CardBody>
 * </Card>
 * ```
 */
const CitedFieldRow = assignWithoutSideEffects(React.forwardRef(_CitedFieldRow), {
  displayName: 'CitedFieldRow',
  componentId: 'CitedFieldRow',
});

export { CitedFieldRow };
export type { CitedFieldRowProps, CitedFieldRowSource };
