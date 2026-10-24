import React from 'react';
import { StepLine } from './StepLine';
import type { StepLineProps } from './StepLine';
import { StepInteractiveItemHeader } from './StepInteractiveItemHeader.web';
import { useStepGroup } from './StepGroupContext';
import type { StepGroupContextType, StepGroupProps, StepItemProps } from './types';
import { componentIds } from './componentIds';
import { itemLineGap, stepItemHeaderTokens } from './tokens';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';
import { size as sizeTokens } from '~tokens/global';
import { throwKlear360Error } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type GetStepTypeFromIndexProps = {
  _index: StepItemProps['_index'];
  _nestingLevel: StepGroupProps['_nestingLevel'];
  itemsCount: StepGroupContextType['itemsInGroupCount'];
};

const getStepTypeFromIndex = ({
  _index,
  _nestingLevel,
  itemsCount,
}: GetStepTypeFromIndexProps): StepLineProps['stepType'] => {
  if (_nestingLevel === 0) {
    return 'default';
  }

  if (itemsCount === 1) {
    return 'single-item';
  }

  if (_index === 0) {
    return 'start';
  }

  if (_index === itemsCount - 1) {
    return 'end';
  }

  return 'middle';
};

const _StepItem = ({
  title,
  titleColor,
  timestamp,
  description,
  stepProgress = 'none',
  marker,
  trailing,
  isSelected,
  isDisabled,
  href,
  target,
  onClick,
  children,
  _index = 0,
  _totalIndex = 0,
  _nestingLevel = 0,
  minWidth,
  ...rest
}: StepItemProps): React.ReactElement => {
  const {
    itemsInGroupCount: itemsCount,
    totalItemsInParentGroupCount,
    orientation,
    size,
  } = useStepGroup();
  const stepType = React.useMemo(
    () => getStepTypeFromIndex({ _index, _nestingLevel, itemsCount }),
    [_index, _nestingLevel, itemsCount],
  );

  const itemRef = React.useRef<HTMLDivElement>(null);

  const isFirstItem = _totalIndex === 0;
  const isLastItem = _totalIndex === totalItemsInParentGroupCount - 1;
  const isInteractive = Boolean(href) || Boolean(onClick);
  const isVertical = orientation === 'vertical';
  const isNested = _nestingLevel > 0;

  if (__DEV__) {
    if (trailing && orientation === 'horizontal') {
      throwKlear360Error({
        message: 'trailing is not allowed in horizontal StepGroup',
        moduleName: 'StepItem',
      });
    }

    if (_nestingLevel >= 1 && orientation === 'horizontal') {
      throwKlear360Error({
        message: 'Nested StepGroup components are not allowed in horizontal orientation',
        moduleName: 'StepItem',
      });
    }
  }

  const stepItemHeaderJSX = (
    <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.4">
      <Box>
        <Text
          size={stepItemHeaderTokens[size].title}
          color={
            isDisabled
              ? 'surface.text.gray.disabled'
              : isSelected
              ? 'surface.text.primary.normal'
              : titleColor ?? 'surface.text.gray.subtle'
          }
          weight={isNested ? 'regular' : 'medium'}
        >
          {title}
        </Text>
        <Text
          size={stepItemHeaderTokens[size].timestamp}
          marginY="spacing.2"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
          variant="caption"
        >
          {timestamp}
        </Text>
        <Text
          size={stepItemHeaderTokens[size].description}
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
        >
          {description}
        </Text>
      </Box>
      {trailing ? <Box>{trailing}</Box> : null}
    </Box>
  );

  const enhancedMarker = marker
    ? React.cloneElement(marker, {
        isDisabled: isDisabled ?? marker?.props?.isDisabled,
      })
    : undefined;

  return (
    <BaseBox
      display="flex"
      flexDirection={isVertical ? 'row' : 'column'}
      gap={itemLineGap[size]}
      className={`step-item step-index-${_index} step-nesting-level-${_nestingLevel}`}
      textAlign={isVertical ? 'left' : 'center'}
      alignItems={isVertical ? undefined : 'center'}
      minWidth={isVertical ? undefined : minWidth ?? `min(${makeSize(sizeTokens['120'])}, 100%)`}
      width={isVertical ? '100%' : undefined}
      flex={isVertical ? undefined : '1'}
      marginX={isVertical ? 'spacing.4' : 'spacing.0'}
      {...metaAttribute({ name: MetaConstants.StepItem })}
      {...makeAnalyticsAttribute(rest)}
      ref={itemRef}
    >
      <StepLine
        shouldShowStartBranch={!isFirstItem}
        shouldShowEndBranch={!isLastItem}
        stepType={stepType}
        marker={enhancedMarker}
        stepProgress={stepProgress}
      />
      <Box flex="1" marginRight={isVertical ? undefined : undefined}>
        {isInteractive ? (
          <StepInteractiveItemHeader
            href={href}
            target={target}
            isSelected={isSelected}
            onClick={onClick}
            isDisabled={isDisabled}
            {...metaAttribute({ name: MetaConstants.StepItemButton })}
          >
            {stepItemHeaderJSX}
          </StepInteractiveItemHeader>
        ) : (
          <Box paddingY="spacing.3" paddingX="spacing.4">
            {stepItemHeaderJSX}
          </Box>
        )}
        {children ? (
          <Box paddingX="spacing.4" paddingBottom="spacing.3">
            {children}
          </Box>
        ) : null}
      </Box>
    </BaseBox>
  );
};

/**
 * ## StepItem
 *
 * Component meant to be used inside the StepGroup parent component
 *
 * ### Usage
 *
 * ```jsx
 * <StepGroup orientation="vertical" size="medium">
 *   <StepItem
 *      title="Personal Details"
 *      timestamp="Thu 15th Oct'23 | 12:00pm"
 *      description="Fill your personal details here"
 *      marker={<StepItemIndicator color="negative" />}
 *    />
 * </StepGroup>
 * ```
 *
 * ---
 *
 * Checkout {@link https://klear360.klear.com/?path=/docs/components-stepgroup--docs StepGroup Documentation}
 */
const StepItem = assignWithoutSideEffects(_StepItem, {
  componentId: componentIds.StepItem,
  displayName: componentIds.StepItem,
});

export { StepLine, StepItem };
