import React from 'react';
import type { StyledBaseInputProps } from './types';
import { getBaseInputNativeModuleClasses } from './getBaseInputNativeModuleClasses';
import { getWebInputElementStyle } from './getWebInputElementStyle';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';

const autoCompleteSuggestionTypeMap = {
  none: 'off',
  on: 'on',
  name: 'name',
  email: 'email',
  username: 'username',
  password: 'current-password',
  newPassword: 'new-password',
  oneTimeCode: 'one-time-code',
  telephone: 'tel',
  postalCode: 'postal-code',
  countryName: 'country',
  creditCardNumber: 'cc-number',
  creditCardCSC: 'cc-csc',
  creditCardExpiry: 'cc-exp',
  creditCardExpiryMonth: 'cc-exp-month',
  creditCardExpiryYear: 'cc-exp-year',
};

const _StyledBaseInput: React.ForwardRefRenderFunction<
  HTMLInputElement | HTMLButtonElement,
  StyledBaseInputProps & {
    valueSuffix?: React.ReactNode;
  }
> = (
  {
    name,
    isDisabled,
    isRequired,
    maxCharacters,
    handleOnFocus,
    handleOnChange,
    handleOnBlur,
    handleOnInput,
    handleOnKeyDown,
    handleOnClick,
    keyboardType,
    keyboardReturnKeyType,
    autoCompleteSuggestionType,
    accessibilityProps,
    setCurrentInteraction,
    numberOfLines,
    type,
    hasPopup,
    shouldIgnoreBlurAnimation,
    autoCapitalize,
    $size,
    valueComponentType,
    tabIndex,
    valueSuffix,
    children,
    color,
    disabledColor,
    isInsideCounterInput,
    ...props
  },
  ref,
) => {
  const { theme } = useTheme();

  const {
    as,
    validationState,
    leadingIcon,
    prefix,
    trailingInteractionElement,
    onTrailingInteractionElementClick: _onTrailingInteractionElementClick,
    leadingInteractionElement,
    suffix,
    trailingIcon,
    textAlign,
    autoFocus,
    hasLeadingIcon: _hasLeadingIcon,
    hasTrailingIcon: _hasTrailingIcon,
    currentInteraction: _currentInteraction,
    handleOnSubmit: _handleOnSubmit,
    isTextArea,
    hasTags,
    isDropdownTrigger,
    isTableInputCell,
    hasLeadingDropdown,
    $padding,
    $caretColor,
    autoGrowMaxHeight: _autoGrowMaxHeight,
    id,
    placeholder,
    defaultValue,
    value,
    onPaste,
    popupId: _popupId,
    isPopupExpanded: _isPopupExpanded,
    ...restDom
  } = props;

  const nativeClassName = getBaseInputNativeModuleClasses({
    $size,
    valueComponentType,
    textAlign,
    hasLeadingDropdown,
    leadingIcon,
    prefix,
    trailingInteractionElement,
    leadingInteractionElement,
    suffix,
    trailingIcon,
  });

  const nativeStyle = getWebInputElementStyle({
    theme,
    isDisabled,
    validationState,
    leadingIcon,
    prefix,
    trailingInteractionElement,
    leadingInteractionElement,
    suffix,
    trailingIcon,
    textAlign,
    isTextArea,
    hasTags,
    isDropdownTrigger,
    $size,
    $padding,
    valueComponentType,
    isTableInputCell,
    hasLeadingDropdown,
    color,
    disabledColor,
    isInsideCounterInput,
    $caretColor,
  });

  const sharedValueProps = {
    id,
    placeholder,
    defaultValue,
    value,
    autoFocus,
  };

  const commonProps = {
    onBlur: (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (!shouldIgnoreBlurAnimation) {
        setCurrentInteraction('default');
      }
      handleOnBlur?.({ name, value: event });
    },
    onFocus: (event: React.ChangeEvent<HTMLInputElement>): void => {
      setCurrentInteraction('focus');
      handleOnFocus?.({ name, value: event });
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      handleOnKeyDown?.({ name, key: event.key, code: event.code, event });
    },
    disabled: isDisabled,
    enterKeyHint: (keyboardReturnKeyType === 'default'
      ? 'enter'
      : keyboardReturnKeyType) as React.InputHTMLAttributes<HTMLInputElement>['enterKeyHint'],
    autoComplete: autoCompleteSuggestionType
      ? autoCompleteSuggestionTypeMap[autoCompleteSuggestionType]
      : undefined,
    className: nativeClassName,
    style: nativeStyle,
  };

  return as === 'div' ? (
    <div
      onBlur={(event: React.FocusEvent<HTMLDivElement>): void => {
        if (!shouldIgnoreBlurAnimation) {
          setCurrentInteraction('default');
        }
        handleOnBlur?.({ name, value: (event as unknown) as React.ChangeEvent<HTMLInputElement> });
      }}
      onFocus={(event: React.FocusEvent<HTMLDivElement>): void => {
        setCurrentInteraction('focus');
        handleOnFocus?.({ name, value: (event as unknown) as React.ChangeEvent<HTMLInputElement> });
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement>): void => {
        if (isDropdownTrigger) {
          event.stopPropagation();
        }
        handleOnClick?.({ name, value: (event as unknown) as React.MouseEvent<HTMLInputElement> });
      }}
      tabIndex={tabIndex}
      className={nativeClassName}
      style={nativeStyle}
      {...accessibilityProps}
    >
      {children}
    </div>
  ) : as === 'button' ? (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      id={id}
      {...accessibilityProps}
      name={name}
      type="button"
      tabIndex={tabIndex}
      disabled={isDisabled}
      className={nativeClassName}
      style={nativeStyle}
      onClick={(event: React.MouseEvent<HTMLButtonElement>): void => {
        if (isDropdownTrigger) {
          event.stopPropagation();
        }

        handleOnClick?.({
          name,
          value: event as unknown as React.MouseEvent<HTMLInputElement>,
        });
      }}
      onBlur={(event) => commonProps.onBlur(event as unknown as React.ChangeEvent<HTMLInputElement>)}
      onFocus={(event) =>
        commonProps.onFocus(event as unknown as React.ChangeEvent<HTMLInputElement>)
      }
      onKeyDown={(event) =>
        commonProps.onKeyDown(event as unknown as React.KeyboardEvent<HTMLInputElement>)
      }
    >
      <BaseBox display="flex" alignItems="center" gap="spacing.3">
        <Text
          color={
            value && !isDisabled
              ? 'interactive.text.gray.normal'
              : 'surface.text.gray.disabled'
          }
          truncateAfterLines={1}
          textAlign={textAlign}
          size={$size}
        >
          {value ? value : placeholder}
        </Text>
        {valueSuffix}
      </BaseBox>
    </button>
  ) : as === 'textarea' ? (
    <textarea
      ref={ref as React.Ref<HTMLTextAreaElement>}
      name={name}
      required={isRequired}
      maxLength={maxCharacters}
      rows={isDropdownTrigger ? 1 : numberOfLines}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
        handleOnChange?.({ name, value: event as unknown as React.ChangeEvent<HTMLInputElement> })
      }
      onInput={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleOnInput?.({ name, value: event as unknown as React.ChangeEvent<HTMLInputElement> });
      }}
      onClick={(event) => {
        if (isDropdownTrigger) {
          event.stopPropagation();
        }

        handleOnClick?.({ name, value: event as unknown as React.MouseEvent<HTMLInputElement> });
      }}
      autoCapitalize={autoCapitalize}
      tabIndex={tabIndex}
      {...sharedValueProps}
      onPaste={onPaste as unknown as React.ClipboardEventHandler<HTMLTextAreaElement>}
      {...restDom}
      {...accessibilityProps}
      onBlur={(event) => commonProps.onBlur(event as unknown as React.ChangeEvent<HTMLInputElement>)}
      onFocus={(event) =>
        commonProps.onFocus(event as unknown as React.ChangeEvent<HTMLInputElement>)
      }
      onKeyDown={(event) =>
        commonProps.onKeyDown(event as unknown as React.KeyboardEvent<HTMLInputElement>)
      }
      disabled={isDisabled}
      className={nativeClassName}
      style={nativeStyle}
    />
  ) : (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      name={name}
      type={type === 'telephone' ? 'tel' : type}
      required={isRequired}
      maxLength={maxCharacters}
      inputMode={keyboardType === 'telephone' ? 'tel' : keyboardType}
      onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
        handleOnChange?.({ name, value: event })
      }
      onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
        handleOnInput?.({ name, value: event });
      }}
      onClick={(event) => {
        if (isDropdownTrigger) {
          event.stopPropagation();
        }

        handleOnClick?.({ name, value: event });
      }}
      autoCapitalize={autoCapitalize}
      tabIndex={tabIndex}
      {...sharedValueProps}
      onPaste={onPaste}
      {...restDom}
      {...accessibilityProps}
      onBlur={commonProps.onBlur}
      onFocus={commonProps.onFocus}
      onKeyDown={commonProps.onKeyDown}
      disabled={isDisabled}
      enterKeyHint={commonProps.enterKeyHint}
      autoComplete={commonProps.autoComplete}
      className={nativeClassName}
      style={nativeStyle}
    />
  );
};

const StyledBaseInput = assignWithoutSideEffects(React.forwardRef(_StyledBaseInput), {
  displayName: 'StyledBaseInput',
});

export { StyledBaseInput };
