/* eslint-disable react/display-name */
import type { ReactElement } from 'react';
import React from 'react';
import type { StyledIconButtonProps } from './types';
import { castWebType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { IconButtonEmphasis } from './IconButton';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/Klear360Provider';
import { throwKlear360Error, logger } from '~utils/logger';
import { getIconButtonModuleClasses } from './getIconButtonModuleClasses';

const StyledIconButton = React.forwardRef<HTMLButtonElement, StyledIconButtonProps>(
  (
    {
      icon: Icon,
      onClick,
      size,
      emphasis,
      accessibilityLabel,
      accessibilityProps,
      isDisabled,
      isHighlighted,
      testID,
      onBlur,
      onFocus,
      onMouseLeave,
      onMouseMove,
      onPointerDown,
      onPointerEnter,
      onTouchEnd,
      onTouchStart,
      onKeyDown,
      tabIndex,
      className,
      ...rest
    },
    ref,
  ): ReactElement => {
    const { theme } = useTheme();
    const styledPropsCSSObject = useStyledProps({ ...rest, theme });
    const isModerate = emphasis === 'moderate';
    const hasContainer = isHighlighted || isModerate;

    if (__DEV__) {
      if (size === 'large' && (isHighlighted || isModerate)) {
        throwKlear360Error({
          moduleName: 'IconButton',
          message: 'size large is not allowed with isHighlighted true or emphasis moderate',
        });
      }

      if ((size === 'small' || size === 'medium') && !hasContainer && !isDisabled) {
        logger({
          type: 'log',
          moduleName: 'IconButton',
          message:
            `size="${size}" with neither isHighlighted nor emphasis="moderate" set renders ` +
            "a clickable area no bigger than the icon glyph itself, under WCAG 2.5.8's 24x24px " +
            'minimum target size. Pass isHighlighted or emphasis="moderate" for a properly-sized ' +
            'hit box, or ignore this if this IconButton is already nested inside another control ' +
            "that provides adequate padding of its own (e.g. an input's trailing slot).",
        });
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={castWebType(onClick)}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
        onKeyDown={onKeyDown}
        disabled={isDisabled}
        tabIndex={tabIndex}
        className={getIconButtonModuleClasses({
          emphasis: emphasis as IconButtonEmphasis,
          size,
          isHighlighted: Boolean(isHighlighted),
          className,
        })}
        style={styledPropsCSSObject as React.CSSProperties}
        {...makeAccessible({
          ...accessibilityProps,
          label: accessibilityLabel ?? accessibilityProps?.label,
        })}
        {...metaAttribute({ name: MetaConstants.IconButton, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        <Icon size={size} color="currentColor" />
      </button>
    );
  },
);

export default StyledIconButton;
