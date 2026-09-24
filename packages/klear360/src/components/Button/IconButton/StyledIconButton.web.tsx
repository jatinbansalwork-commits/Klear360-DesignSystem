/* eslint-disable react/display-name */
import styled from 'styled-components';
import type { ReactElement } from 'react';
import React from 'react';
import type { StyledIconButtonProps } from './types';
import {
  highlightedButtonSizeMap,
  highlightedHoverColorMap,
  focusBackgroundColorMap,
  moderateBackgroundColorMap,
} from './tokens';
import { castWebType, makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { IconButtonEmphasis } from './IconButton';
import { makeAccessible } from '~utils/makeAccessible';
import { makeMotionTime } from '~utils/makeMotionTime';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { throwKlear360Error, logger } from '~utils/logger';
import getIn from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useStyledProps } from '~components/Box/styledProps';

type StyledButtonProps = {
  emphasis: IconButtonEmphasis;
  $isHighlighted: StyledIconButtonProps['isHighlighted'];
  $size: StyledIconButtonProps['size'];
};

const StyledButton = styled.button<StyledButtonProps>((props) => {
  const { theme, emphasis } = props;
  const motionToken = theme.motion;
  const styledPropsCSSObject = useStyledProps(props);
  const isModerate = emphasis === 'moderate';
  const hasContainer = props.$isHighlighted || isModerate;
  const emphasisColor = emphasis === 'intense' ? 'gray' : 'staticWhite';
  const highlightedEmphasis = emphasis === 'intense' ? 'intense' : 'subtle';
  const restIconColor = emphasisColor === 'staticWhite' ? 'normal' : 'muted';

  if (__DEV__) {
    if (props.$size === 'large' && (props.$isHighlighted || isModerate)) {
      throwKlear360Error({
        moduleName: 'IconButton',
        message: 'size large is not allowed with isHighlighted true or emphasis moderate',
      });
      return null;
    }

    // A warning, not `throwKlear360Error` - unlike the check above, this combination is valid
    // (many bare icon buttons are used exactly like this on purpose), just easy to get wrong: with
    // neither `isHighlighted` nor `emphasis="moderate"`, `hasContainer` below is `false`, so no
    // `width`/`height` is applied at all and the clickable area collapses to the icon glyph's own
    // rendered size - 12x12px at `size="small"`, 16x16px at `size="medium"` - well under WCAG
    // 2.5.8's 24x24px minimum target size. A hard error would break every existing bare
    // `IconButton` usage that's genuinely fine (e.g. one already sitting inside another control's
    // own adequately-sized clickable area, such as an input's trailing slot), so this only warns.
    if ((props.$size === 'small' || props.$size === 'medium') && !hasContainer && !props.disabled) {
      // `type: 'log'`, not `'warn'` - `renderWithSSR` (this package's shared SSR test helper)
      // treats *any* `console.warn`/`console.error` raised while hydrating as a fatal hydration
      // mismatch, and `IconButton` is used internally by enough other components (close buttons,
      // clear buttons, etc.) that a `warn` here would trip an unpredictable, hard-to-fully-audit
      // set of unrelated SSR tests across the design system - not just this component's own.
      logger({
        type: 'log',
        moduleName: 'IconButton',
        message:
          `size="${props.$size}" with neither isHighlighted nor emphasis="moderate" set renders ` +
          "a clickable area no bigger than the icon glyph itself, under WCAG 2.5.8's 24x24px " +
          'minimum target size. Pass isHighlighted or emphasis="moderate" for a properly-sized ' +
          'hit box, or ignore this if this IconButton is already nested inside another control ' +
          "that provides adequate padding of its own (e.g. an input's trailing slot).",
      });
    }
  }

  return {
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    padding: 0,
    height: hasContainer
      ? makeSize(highlightedButtonSizeMap[props.$size as 'small' | 'medium'])
      : undefined,
    width: hasContainer
      ? makeSize(highlightedButtonSizeMap[props.$size as 'small' | 'medium'])
      : undefined,
    borderRadius: hasContainer ? theme.border.radius.small : theme.border.radius['2xsmall'],
    background: isModerate ? getIn(theme.colors, moderateBackgroundColorMap.rest) : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.disabled
      ? theme.colors.interactive.icon[emphasisColor].disabled
      : theme.colors.interactive.icon[emphasisColor][restIconColor],
    transitionProperty: isModerate ? 'color, background-color' : 'color, box-shadow',
    transitionDuration: castWebType(makeMotionTime(motionToken.duration.xquick)),
    transitionTimingFunction: motionToken.easing.standard as string,

    '&:hover:not([disabled])': {
      color: theme.colors.interactive.icon[emphasisColor].subtle,
      backgroundColor: isModerate
        ? getIn(theme.colors, moderateBackgroundColorMap.hover)
        : props.$isHighlighted
        ? getIn(theme.colors, highlightedHoverColorMap[highlightedEmphasis])
        : 'transparent',
    },

    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      color: theme.colors.interactive.icon[emphasisColor].subtle,
      backgroundColor: isModerate
        ? getIn(theme.colors, moderateBackgroundColorMap.hover)
        : props.$isHighlighted
        ? getIn(theme.colors, focusBackgroundColorMap[highlightedEmphasis])
        : 'transparent',
    },

    '&:active': {
      color: theme.colors.interactive.icon[emphasisColor].subtle,
    },
    ...styledPropsCSSObject,
  };
});

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
      ...rest
    },
    ref,
  ): ReactElement => (
    <StyledButton
      ref={ref}
      onClick={castWebType(onClick)}
      emphasis={emphasis}
      type="button"
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
      $isHighlighted={isHighlighted}
      $size={size}
      tabIndex={tabIndex}
      {...makeAccessible({
        ...accessibilityProps,
        label: accessibilityLabel ?? accessibilityProps?.label,
      })}
      {...metaAttribute({ name: MetaConstants.IconButton, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...rest}
    >
      <Icon size={size} color="currentColor" />
    </StyledButton>
  ),
);

export default StyledIconButton;
