import React from 'react';
import styled from 'styled-components';
import { CellWrapper, StyledCell } from './TableBody';
import { useTableContext } from './TableContext';
import type { TableEditableSearchCellProps, TableProps } from './types';
import {
  rowDensityToIsTableInputCellMapping,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
} from './tokens';
import { ComponentIds } from './componentIds';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import type { MarginProps } from '~components/Box/BaseBox/types/spacingTypes';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { BaseInput } from '~components/Input/BaseInput';
import { castWebType } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getKeyboardAndAutocompleteProps } from '~components/Input/BaseInput/utils';
import { CloseIcon, SearchIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import type { Klear360ElementRefWithValue } from '~utils/types';

const StyledEditableCell = styled(StyledCell)<{
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
}>(({ theme, $rowDensity }) => ({
  '&&&': {
    '&:focus-visible': { outline: '1px solid' },
    '&:focus-within': {
      ...($rowDensity !== 'comfortable' ? getFocusRingStyles({ theme, negativeOffset: true }) : {}),
    },
  },
}));

// Same rules as TableEditableCell's - kept in sync deliberately (see TableEditableCell.web.tsx).
const getEditableInputMargin = ({
  rowDensity,
  validationState,
}: {
  rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  validationState: TableEditableSearchCellProps['validationState'];
}): MarginProps['margin'] => {
  if (validationState === 'error') {
    return 'spacing.0';
  }

  if (rowDensity === 'comfortable') {
    return ['spacing.4', 'spacing.4'];
  }

  return 'spacing.2';
};

const _TableEditableSearchCell = ({
  validationState = 'none',
  accessibilityLabel,
  autoCapitalize,
  autoCompleteSuggestionType,
  autoFocus,
  defaultValue,
  isDisabled,
  isRequired,
  keyboardReturnKeyType,
  maxCharacters,
  name,
  onBlur,
  onChange,
  onClearButtonClick,
  onClick,
  onFocus,
  onSubmit,
  placeholder = 'Search',
  prefix,
  suffix,
  value,
  testID,
  errorText,
  successText,
  inputType,
  showSearchIcon = true,
}: TableEditableSearchCellProps): React.ReactElement => {
  const { rowDensity, showStripedRows, backgroundColor } = useTableContext();
  const inputRef = React.useRef<Klear360ElementRefWithValue>(null);
  const [shouldShowClearButton, setShouldShowClearButton] = React.useState(
    Boolean(defaultValue ?? value),
  );

  return (
    <StyledEditableCell
      role="cell"
      $backgroundColor={backgroundColor}
      $rowDensity={rowDensity}
      {...metaAttribute({ name: MetaConstants.TableCell })}
    >
      <BaseBox className="cell-wrapper-base" display="flex" alignItems="center" height="100%">
        <CellWrapper
          className="cell-wrapper"
          $rowDensity={rowDensity}
          showStripedRows={showStripedRows}
          display="flex"
          alignItems="center"
          flex={1}
          hasPadding={false}
        >
          <Box margin={getEditableInputMargin({ rowDensity, validationState })} width="100%">
            <BaseInput
              ref={inputRef}
              isTableInputCell={rowDensityToIsTableInputCellMapping[rowDensity]}
              validationState={validationState}
              id="table-editable-search-cell-input"
              size={tableEditableCellRowDensityToInputSizeMap[rowDensity]}
              trailingIcon={validationStateToInputTrailingIconMap[validationState]}
              trailingInteractionElement={
                shouldShowClearButton ? (
                  <IconButton
                    size="medium"
                    icon={CloseIcon}
                    isDisabled={isDisabled}
                    accessibilityLabel="Clear Input Content"
                    onClick={() => {
                      // Uncontrolled: the input owns its own value, so clear the DOM node directly.
                      if (isEmpty(value) && inputRef.current instanceof HTMLInputElement) {
                        inputRef.current.value = '';
                      }
                      onChange?.({ name, value: '' });
                      onClearButtonClick?.();
                      inputRef.current?.focus();
                      setShouldShowClearButton(false);
                    }}
                  />
                ) : undefined
              }
              accessibilityLabel={accessibilityLabel}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocus}
              defaultValue={defaultValue}
              isDisabled={isDisabled}
              isRequired={isRequired}
              leadingIcon={showSearchIcon ? SearchIcon : undefined}
              maxCharacters={maxCharacters}
              name={name}
              onBlur={onBlur}
              onChange={(args) => {
                setShouldShowClearButton(Boolean(args.value?.length));
                onChange?.(args);
              }}
              onClick={onClick}
              onFocus={onFocus}
              onSubmit={castWebType(onSubmit)}
              placeholder={placeholder}
              prefix={prefix}
              suffix={suffix}
              value={value}
              testID={testID}
              errorText={errorText}
              successText={successText}
              showHintsAsTooltip={true}
              {...getKeyboardAndAutocompleteProps({
                type: inputType ?? 'search',
                keyboardReturnKeyType,
                autoCompleteSuggestionType,
                autoCapitalize,
              })}
            />
          </Box>
        </CellWrapper>
      </BaseBox>
    </StyledEditableCell>
  );
};

const TableEditableSearchCell = assignWithoutSideEffects(_TableEditableSearchCell, {
  displayName: 'TableEditableSearchCell',
  componentId: ComponentIds.TableEditableSearchCell,
});

export { TableEditableSearchCell };
