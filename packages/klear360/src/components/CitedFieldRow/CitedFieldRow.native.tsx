import React from 'react';
import { Pressable } from 'react-native';
import type { CitedFieldRowProps, CitedFieldRowSource } from './types';
import {
  citeDotSize,
  sourceVariantTokens,
  activeSourceTokens,
  citedFieldRowSubtleBackground,
  errorValueCellTokens,
  successValueCellTokens,
} from './citedFieldRowTokens';
import { CheckIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeSize } from '~utils';
import { opacity } from '~tokens/global';

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
  const tokens = source.isActive ? activeSourceTokens : sourceVariantTokens[variant];
  const tip = source.accessibilityLabel ?? source.label;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      {...makeAccessible({ label: tip, role: 'button', disabled: isDisabled })}
    >
      <BaseBox
        flexDirection="row"
        alignItems="center"
        gap="spacing.1"
        paddingY="spacing.1"
        paddingX="spacing.2"
        borderWidth="thin"
        borderColor={(tokens.border === 'transparent' ? 'transparent' : tokens.border) as never}
        borderRadius="max"
        backgroundColor={tokens.background as never}
        opacity={isDisabled ? opacity[700] : undefined}
      >
        <BaseBox
          width={makeSize(citeDotSize)}
          height={makeSize(citeDotSize)}
          borderRadius="round"
          backgroundColor={tokens.text as never}
        />
        <Text variant="body" size="small" weight="medium" color={tokens.text as never}>
          {source.label}
        </Text>
      </BaseBox>
    </Pressable>
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
  ref: React.Ref<unknown>,
): React.ReactElement => {
  const isGrounded = Boolean(source);
  const isEmpty = value == null || value === '';
  const displayValue = isEmpty ? '—' : value;
  const isError = validationState === 'error';
  const isSuccess = validationState === 'success';
  const showErrorText = isError && Boolean(errorText);
  const showSuccessText = isSuccess && Boolean(successText);
  const validationHintId = React.useId();
  const showValidationHint = showErrorText || showSuccessText;
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

  const handleCiteClick = (): void => {
    if (!source || isCiteMuted) return;
    onCiteClick?.(source);
  };

  return (
    <BaseBox
      ref={ref as never}
      flexDirection="row"
      alignItems="stretch"
      borderBottomWidth="thin"
      borderBottomColor="surface.border.gray.muted"
      opacity={isCiteMuted ? opacity[700] : undefined}
      pointerEvents={isCiteMuted ? 'none' : 'auto'}
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.CitedFieldRow, testID })}
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
      >
        <Text
          variant="body"
          size="small"
          weight="medium"
          color={isGrounded ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}
        >
          {label}
        </Text>
      </BaseBox>

      <BaseBox
        flex={1}
        flexDirection="column"
        justifyContent="center"
        gap={showValidationHint ? 'spacing.1' : undefined}
        paddingY="spacing.2"
        paddingX="spacing.3"
        borderLeftWidth={valueAccentBorder ? 'thick' : undefined}
        borderLeftColor={valueAccentBorder as never}
        backgroundColor={valueBackground as never}
        {...makeAccessible({
          ...(isError ? { invalid: true } : {}),
          ...(showValidationHint ? { describedBy: validationHintId } : {}),
        })}
        {...metaAttribute({ name: MetaConstants.CitedFieldRowValue })}
      >
        {isEditable ? (
          control
        ) : (
          <BaseBox
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            gap="spacing.3"
          >
            <Text
              variant="body"
              size="medium"
              weight={isEmpty ? 'regular' : 'medium'}
              color={valueTextColor as never}
              truncateAfterLines={1}
            >
              {displayValue}
            </Text>
            {source ? (
              <SourceRefChip source={source} isDisabled={isCiteMuted} onClick={handleCiteClick} />
            ) : null}
          </BaseBox>
        )}
        {showErrorText ? (
          <BaseBox {...({ nativeID: validationHintId } as Record<string, string>)}>
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
            {...({ nativeID: validationHintId } as Record<string, string>)}
            flexDirection="row"
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
 * linking the value back to its source document or event.
 */
const CitedFieldRow = assignWithoutSideEffects(React.forwardRef(_CitedFieldRow), {
  displayName: 'CitedFieldRow',
  componentId: 'CitedFieldRow',
});

export { CitedFieldRow };
export type { CitedFieldRowProps, CitedFieldRowSource };
