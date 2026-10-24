import React from 'react';
import type { BaseInputWrapperProps } from './types';
import {
  getAnimatedBaseInputWrapperModuleClasses,
  getBaseInputCollapseAnimationClass,
  getBaseInputExpandAnimationClass,
  getBaseInputWrapperDataAttributes,
} from './getBaseInputWrapperModuleClasses';
import { getAnimatedBaseInputWrapperMaxHeight } from './baseInputStyles';
import { baseInputHeight } from './baseInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeSize, makeSpace } from '~utils';
import type { Klear360ElementRef } from '~utils/types';

const BASE_INPUT_WRAPPER_CLASS = '__klear360-base-input-wrapper';

type AnimatedBaseInputWrapperProps = BaseInputWrapperProps & {
  showAllTags?: boolean;
};

const _AnimatedBaseInputWrapper: React.ForwardRefRenderFunction<
  Klear360ElementRef,
  AnimatedBaseInputWrapperProps
> = (props, ref): React.ReactElement => {
  const {
    showAllTags,
    setShowAllTagsWithAnimation,
    maxTagRows,
    isDropdownTrigger,
    isDisabled,
    validationState,
    borderRadius,
    isTableInputCell,
    isTextArea,
    size,
    numberOfLines,
    currentInteraction: _currentInteraction,
    isFocused: _isFocused,
    isLabelLeftPositioned: _isLabelLeftPositioned,
    onClick: _onClick,
    topContent: _topContent,
    bottomContent: _bottomContent,
    inputRowOverlay: _inputRowOverlay,
    children,
  } = props;

  const collapseAnimationClass = getBaseInputCollapseAnimationClass();
  const expandAnimationClass = getBaseInputExpandAnimationClass();

  const animationClassName =
    maxTagRows !== 'expandable'
      ? undefined
      : showAllTags
      ? expandAnimationClass
      : collapseAnimationClass;

  const dropdownMaxHeightStyle =
    isDropdownTrigger && !isTableInputCell
      ? {
          maxHeight: makeSize(
            getAnimatedBaseInputWrapperMaxHeight({
              maxTagRows,
              showAllTags,
              size,
            }),
          ),
        }
      : undefined;

  return (
    <BaseBox
      ref={ref as never}
      {...getBaseInputWrapperDataAttributes(Boolean(isDisabled))}
      className={[
        getAnimatedBaseInputWrapperModuleClasses({
          validationState,
          borderRadius,
          isTableInputCell,
          isTextArea,
          isDropdownTrigger,
        }),
        BASE_INPUT_WRAPPER_CLASS,
        animationClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      style={dropdownMaxHeightStyle}
      height={
        isTextArea && isDropdownTrigger
          ? makeSpace((numberOfLines ?? 0) * baseInputHeight[size])
          : undefined
      }
      cursor={isTextArea && isDropdownTrigger ? 'text' : undefined}
      onAnimationEnd={(e) => {
        if (!showAllTags && e.animationName === 'baseInputCollapse') {
          setShowAllTagsWithAnimation?.(false);
        }
      }}
    >
      {children}
    </BaseBox>
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
