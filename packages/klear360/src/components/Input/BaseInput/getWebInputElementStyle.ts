import type { CSSObject } from 'styled-components';
import type { StyledBaseInputProps } from './types';
import { getBaseInputStyles } from './baseInputStyles';
import getIn from '~utils/lodashButBetter/get';
import type { Theme } from '~components/Klear360Provider';

type WebInputStyleProps = Pick<
  StyledBaseInputProps,
  | 'isDisabled'
  | 'validationState'
  | 'leadingIcon'
  | 'prefix'
  | 'trailingInteractionElement'
  | 'leadingInteractionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'textAlign'
  | 'isTextArea'
  | 'hasTags'
  | 'isDropdownTrigger'
  | 'valueComponentType'
  | 'isTableInputCell'
  | 'hasLeadingDropdown'
  | 'color'
  | 'disabledColor'
  | 'isInsideCounterInput'
  | '$padding'
  | '$caretColor'
> & {
  theme: Theme;
  $size: NonNullable<StyledBaseInputProps['$size']>;
};

const stripPseudoSelectors = (styles: CSSObject): React.CSSProperties => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(styles)) {
    if (key.startsWith(':') || key.startsWith('&') || key.includes('::')) {
      continue;
    }
    result[key] = value;
  }
  return result as React.CSSProperties;
};

export const getWebInputElementStyle = (props: WebInputStyleProps): React.CSSProperties => {
  const {
    theme,
    isDisabled: isDisabledProp,
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
  } = props;

  const baseStyles = getBaseInputStyles({
    isDisabled: isDisabledProp,
    theme,
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
    size: $size,
    padding: $padding,
    valueComponentType,
    isTableInputCell,
    hasLeadingDropdown,
    color,
    disabledColor,
    isInsideCounterInput,
  });

  return {
    ...stripPseudoSelectors(baseStyles),
    outline: 'none',
    border: 'none',
    caretColor: $caretColor ? getIn(theme.colors, $caretColor) : undefined,
    cursor: isDisabledProp ? 'not-allowed' : 'auto',
  };
};
