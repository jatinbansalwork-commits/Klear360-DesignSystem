import React, { useCallback, useState, useEffect, useRef } from 'react';
import type { CounterInputProps } from './types';
import { StyledCounterInput, StyledNumberWrapper } from './StyledCounterInput';
import { getCounterButtonClasses } from './getCounterInputModuleClasses';
import styles from './CounterInput.module.scss';
import {
  COUNTER_INPUT_TOKEN,
  COUNTER_INPUT_ICON_SIZE_MAP,
  COUNTER_INPUT_SIZE_TO_TEXT_SIZE,
} from './token';
import { CounterInputProvider } from './CounterInputContext';
import { BaseInput } from '~components/Input/BaseInput';
import { baseInputCounterInputPaddingTokens } from '~components/Input/BaseInput/baseInputTokens';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { Klear360ElementRef } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import { getOuterMotionRef } from '~utils/getMotionRefs';
import BaseBox from '~components/Box/BaseBox';
import { FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { useId } from '~utils/useId';
import { useTheme } from '~components/Klear360Provider';
import { useBreakpoint, makeTypographySize } from '~utils';
import { MinusIcon, PlusIcon } from '~components/Icons';
import { ProgressBar } from '~components/ProgressBar';
import { mergeRefs } from '~utils/useMergeRefs';
import { getTextProps } from '~components/Typography/Text/Text';

const _CounterInput = React.forwardRef<Klear360ElementRef, CounterInputProps>(
  (
    {
      label,
      accessibilityLabel,
      labelPosition = 'top',
      name,
      value,
      defaultValue,
      min = 0,
      max,
      emphasis = 'subtle',
      size = 'medium',
      isLoading = false,
      isDisabled = false,
      onChange,
      onFocus,
      onBlur,
      testID,
      _motionMeta,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useControllableState({
      value,
      defaultValue,
      onChange: (newValue) => onChange?.({ value: newValue }),
    });

    const { inputId } = useFormId('counter-input');
    const idBase = useId('counter-input');
    const labelId = `${idBase}-label`;
    const { theme } = useTheme();
    const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
    const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
    const emphasisTokens = COUNTER_INPUT_TOKEN.emphasis[emphasis];
    const _isDisabled = isDisabled || isLoading;
    const [animationClass, setAnimationClass] = useState('');
    const lastActionRef = useRef<'increment' | 'decrement' | null>(null);
    const previousValueRef = useRef<number | undefined>(internalValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rawCounterValue = internalValue ?? min;
    const counterValueDigitCount =
      Math.max(2, String(Math.abs(rawCounterValue)).length) + (rawCounterValue < 0 ? 1 : 0);
    const { fontSize: counterInputFontSizeToken = 100 } = getTextProps({
      variant: 'body',
      size: COUNTER_INPUT_SIZE_TO_TEXT_SIZE[size],
      weight: 'semibold',
    });
    const counterInputHorizontalPadding =
      theme.spacing[baseInputCounterInputPaddingTokens.left[size]] +
      theme.spacing[baseInputCounterInputPaddingTokens.right[size]];
    const counterInputFieldWidth = `calc(${counterValueDigitCount}ch + ${counterInputHorizontalPadding}px)` as `calc(${string})`;
    const counterInputTextStyle = {
      fontFamily: theme.typography.fonts.family.text,
      fontSize: makeTypographySize(theme.typography.fonts.size[counterInputFontSizeToken]),
      fontWeight: theme.typography.fonts.weight.semibold,
    };

    // Track Tab navigation to show focus ring only on keyboard navigation (not mouse clicks)
    // Note: :focus-visible doesn't work for text inputs - shows ring on both Tab and click
    // TODO: Re-evaluate and remove later once focus style is unified from design
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return undefined;

      const handleTabKey = (event: KeyboardEvent): void => {
        if (event.key === 'Tab') {
          container.classList.add('counter-input-keyboard-focus');
        }
      };

      const handleMouseDown = (): void => {
        container.classList.remove('counter-input-keyboard-focus');
      };

      document.addEventListener('keydown', handleTabKey, true);
      document.addEventListener('mousedown', handleMouseDown, true);

      return (): void => {
        document.removeEventListener('keydown', handleTabKey, true);
        document.removeEventListener('mousedown', handleMouseDown, true);
      };
    }, []);

    // Animation effect - triggers only when value actually changes
    useEffect(() => {
      // Only animate if:
      // 1. We have a stored action (button was clicked)
      // 2. Value actually changed from previous value
      // 3. Not currently loading
      if (lastActionRef.current && !isLoading && internalValue !== previousValueRef.current) {
        const animationClass =
          lastActionRef.current === 'increment'
            ? `${styles['animate-slide-up']} __klear360-counter-input-animate-slide-up`
            : `${styles['animate-slide-down']} __klear360-counter-input-animate-slide-down`;
        if (animationTimeoutRef.current !== null) {
          clearTimeout(animationTimeoutRef.current);
        }
        setAnimationClass(animationClass);
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationClass('');
          animationTimeoutRef.current = null;
        }, 300);
        lastActionRef.current = null;
      }

      previousValueRef.current = internalValue;
    }, [internalValue, isLoading]);

    useEffect(() => {
      return (): void => {
        if (animationTimeoutRef.current !== null) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }, []);

    const handleInputChange = useCallback(
      ({ value: inputValue }: { value?: string }) => {
        const numericValue = inputValue ? parseInt(inputValue, 10) : min;
        const validValue = isNaN(numericValue) ? min : numericValue;

        let constrainedValue = validValue;
        if (constrainedValue < min) constrainedValue = min;
        if (max !== undefined && constrainedValue > max) constrainedValue = max;
        setInternalValue(() => constrainedValue);
      },
      [min, max, onChange, name],
    );

    const handleIncrement = useCallback(() => {
      if (_isDisabled) return;

      const newValue = (internalValue ?? min) + 1;
      const constrainedValue = max !== undefined ? Math.min(newValue, max) : newValue;

      lastActionRef.current = 'increment';
      setInternalValue(() => constrainedValue);
    }, [internalValue, min, max, _isDisabled, setInternalValue]);

    const handleDecrement = useCallback(() => {
      if (_isDisabled) return;

      const newValue = (internalValue ?? min) - 1;
      const constrainedValue = Math.max(newValue, min);

      lastActionRef.current = 'decrement';
      setInternalValue(() => constrainedValue);
    }, [internalValue, min, _isDisabled, setInternalValue]);

    const isDecrementDisabled = _isDisabled || (internalValue ?? min) <= min;
    const isIncrementDisabled = _isDisabled || (max !== undefined && (internalValue ?? min) >= max);

    const contextValue = {
      size,
      emphasis,
      isDisabled,
      isLoading,
      color: emphasisTokens.color,
      disabledTextColor: emphasisTokens.disabledColor,
      isInsideCounterInput: true,
    };

    return (
      <CounterInputProvider value={contextValue}>
        {/* __klear360-counter-input: CSS selector for animations and component-specific styles */}
        <StyledCounterInput
          data-emphasis={emphasis}
          ref={mergeRefs(getOuterMotionRef({ _motionMeta, ref }), containerRef)}
          {...metaAttribute({ name: MetaConstants.CounterInput, testID })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
        >
          <BaseBox
            display="flex"
            flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
            alignItems={isLabelLeftPositioned ? 'center' : undefined}
          >
            {label && (
              <FormLabel
                as="label"
                position={labelPosition}
                id={labelId}
                htmlFor={inputId}
                size={size}
              >
                {label}
              </FormLabel>
            )}

            <BaseBox
              display="flex"
              position="relative"
              alignItems="center"
              flexDirection="column"
              backgroundColor={
                isLoading || isDisabled
                  ? emphasisTokens.loadingOrDisabledBgColor
                  : emphasisTokens.backgroundColor
              }
              width="fit-content"
              minWidth={`${COUNTER_INPUT_TOKEN.width[size]}px`}
              height={`${COUNTER_INPUT_TOKEN.height[size]}px`}
              borderRadius={COUNTER_INPUT_TOKEN.containerBorderRadius[size]}
              borderWidth="thin"
              borderColor={
                _isDisabled ? emphasisTokens.disabledBorderColor : emphasisTokens.borderColor
              }
            >
              <BaseBox display="flex" alignItems="center" flexDirection="row">
                <button
                  type="button"
                  className={[
                    getCounterButtonClasses({ size, emphasis, type: 'decrement' }),
                    '__klear360-counter-input-decrement-button',
                  ].join(' ')}
                  onClick={handleDecrement}
                  aria-label="Decrement value"
                  disabled={isDecrementDisabled}
                >
                  <MinusIcon size={COUNTER_INPUT_ICON_SIZE_MAP[size]} color="currentColor" />
                </button>

                <StyledNumberWrapper
                  className={`__klear360-counter-input-number-wrapper ${animationClass}`.trim()}
                  $width={counterInputFieldWidth}
                  $fontFamily={counterInputTextStyle.fontFamily}
                  $fontSize={counterInputTextStyle.fontSize}
                  $fontWeight={counterInputTextStyle.fontWeight}
                >
                  <BaseInput
                    ref={ref}
                    id={inputId}
                    as="input"
                    name={name}
                    type="number"
                    componentName={MetaConstants.CounterInput}
                    label=""
                    accessibilityLabel={accessibilityLabel}
                    value={internalValue?.toString() ?? ''}
                    onChange={handleInputChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    isDisabled={isDisabled}
                    size={size}
                    textAlign="center"
                    // Accessibility attributes for spinbutton
                    role="spinbutton"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={internalValue ?? min}
                  />
                </StyledNumberWrapper>

                <button
                  type="button"
                  className={[
                    getCounterButtonClasses({ size, emphasis, type: 'increment' }),
                    '__klear360-counter-input-increment-button',
                  ].join(' ')}
                  onClick={handleIncrement}
                  aria-label="Increment value"
                  disabled={isIncrementDisabled}
                >
                  <PlusIcon size={COUNTER_INPUT_ICON_SIZE_MAP[size]} color="currentColor" />
                </button>
              </BaseBox>
              {isLoading && (
                <BaseBox width="100%" position="absolute" bottom="spacing.0">
                  <ProgressBar
                    color={emphasisTokens.progressBarColor}
                    showPercentage={false}
                    value={1}
                    isIndeterminate={true}
                    _oscillation={true}
                  />
                </BaseBox>
              )}
            </BaseBox>
          </BaseBox>
        </StyledCounterInput>
      </CounterInputProvider>
    );
  },
);

const CounterInput = assignWithoutSideEffects(_CounterInput, {
  componentId: MetaConstants.CounterInput,
});

export { CounterInput };
