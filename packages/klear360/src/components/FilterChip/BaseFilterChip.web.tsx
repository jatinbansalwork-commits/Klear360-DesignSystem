import React from 'react';
import styles from './FilterChip.module.scss';
import type { BaseFilterChipProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { Klear360ElementRef } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { Box } from '~components/Box';
import { Counter } from '~components/Counter';
import { Divider } from '~components/Divider';
import { ChevronDownIcon, CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const renderValue = (
  selectionType: BaseFilterChipProps['selectionType'],
  value: BaseFilterChipProps['value'],
  isDisabled?: boolean,
): React.ReactElement => {
  const valueColor = isDisabled ? 'interactive.text.gray.disabled' : 'interactive.text.gray.normal';

  // For multiple selection: when a single option is selected we show its name (no redundant
  // "1" counter); once more than one is selected we collapse to a compact counter.
  // Use an explicit type guard so a non-array value (e.g. a plain string returned by
  // getFilterChipDisplayValue) never enters the array branch where .length would be
  // misinterpreted as character count.
  if (selectionType === 'multiple') {
    const valueArray = Array.isArray(value) ? value : value != null ? [value] : [];
    if (valueArray.length === 1) {
      return (
        <Text as="span" size="small" weight="medium" color={valueColor} truncateAfterLines={1}>
          {String(valueArray[0] ?? '')}
        </Text>
      );
    }
    return (
      <Box display="flex" alignItems="center">
        <Counter value={valueArray.length} color="neutral" size="small" />
      </Box>
    );
  }

  return (
    <Text as="span" size="small" weight="medium" color={valueColor}>
      {value != null ? String(value) : ''}
    </Text>
  );
};

const _BaseFilterChip: React.ForwardRefRenderFunction<Klear360ElementRef, BaseFilterChipProps> = (
  {
    value,
    onClearButtonClick,
    label,
    isDisabled,
    selectionType = 'single',
    showClearButton = true,
    onClick,
    onKeyDown,
    accessibilityProps,
    id,
    ...rest
  }: BaseFilterChipProps,
  ref: React.Ref<Klear360ElementRef>,
): React.ReactElement => {
  const isSelected =
    selectionType === 'multiple' ? Array.isArray(value) && value.length > 0 : !!value;
  const shouldShowClearButton = isSelected && showClearButton;

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={styles.chip}
      data-selected={isSelected ? true : undefined}
      data-disabled={isDisabled ? true : undefined}
    >
      <button
        type="button"
        className={styles.trigger}
        data-has-clear-button={shouldShowClearButton ? true : undefined}
        disabled={isDisabled}
        id={id}
        onClick={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick?.(e as any);
        }}
        onKeyDown={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onKeyDown?.(e as any);
        }}
        {...makeAccessible({
          ...accessibilityProps,
          role: accessibilityProps?.role ?? 'button',
        })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
        {...metaAttribute({ name: 'filter-chip-trigger', testID: rest.testID })}
      >
        <Box display="flex" gap="spacing.2" whiteSpace="nowrap" alignItems="center">
          <Text
            size="small"
            weight="medium"
            color="interactive.text.gray.subtle"
            truncateAfterLines={1}
          >
            {label}
            {isSelected ? ':' : null}
          </Text>
          {isSelected ? renderValue(selectionType, value, isDisabled) : null}
        </Box>
        <Box display="flex" alignItems="center" paddingRight="spacing.1">
          <ChevronDownIcon size="small" color="interactive.icon.gray.muted" />
        </Box>
      </button>
      {shouldShowClearButton ? (
        <>
          <Divider orientation="vertical" variant={isDisabled ? 'muted' : 'subtle'} />
          <button
            type="button"
            className={styles.closeButton}
            aria-label={`Clear ${label} value`}
            // value can never be undefined because when it's undefined the button itself doesn't render/
            onClick={() => onClearButtonClick?.({ value: value ?? '' })}
            disabled={isDisabled}
            {...metaAttribute({ name: 'filter-chip-close-button' })}
          >
            <CloseIcon size="small" color="interactive.icon.gray.muted" />
          </button>
        </>
      ) : null}
    </div>
  );
};

const BaseFilterChip = assignWithoutSideEffects(React.forwardRef(_BaseFilterChip), {
  componentId: MetaConstants.BaseFilterChip,
});

export { BaseFilterChip };
