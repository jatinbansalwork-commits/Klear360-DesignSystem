import styled from 'styled-components';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useStyledProps } from '~components/Box/styledProps';
import { makeMotionTime } from '~utils/makeMotionTime';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';
import { castWebType } from '~utils';

const StyledBaseButton = styled.button
  .withConfig({
    shouldForwardProp: omitPropsFromHTML,
    displayName: 'StyledBaseButton',
  })
  .attrs((props: StyledBaseButtonProps) => ({
    ...props.accessibilityProps,
  }))<Omit<StyledBaseButtonProps, 'onClick'>>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  const gradientSizeMap = {
    large: 72,
    medium: 64,
    small: 56,
    xsmall: 48,
  } as const;
  const gradientSize = gradientSizeMap[props.size ?? 'medium'];
  const mouseGradient =
    props.variant === 'primary' && !props.disabled
      ? `radial-gradient(${gradientSize}px ${gradientSize}px at var(--mouse-x, 0%) var(--mouse-y, 0%), ${props.theme.colors.interactive.background.staticWhite.faded} 0%, transparent 100%)`
      : 'none';

  return {
    ...getStyledBaseButtonStyles(props),
    display: 'inline-flex',
    // Buttons grow to fit their label rather than wrapping it onto a second line - matches
    // how every other button in the design system behaves, and how buttons behave generally.
    whiteSpace: 'nowrap',
    backgroundImage: mouseGradient,
    transitionProperty: 'background-color, background-image, box-shadow',
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    transitionDuration: castWebType(
      makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
    ),
    position: 'relative',
    '&:hover': {
      backgroundColor: props.hoverBackgroundColor,
      boxShadow: props.hoverBoxShadow,
      backgroundImage: 'none',
      ...(props.variant === 'tertiary' &&
        props.color === 'transparent' && {
          '&& [data-klear360-component="svg-path"]': {
            fill: props.hoverIconColor,
          },
        }),
    },
    '&:active': {
      backgroundColor: props.focusBackgroundColor,
      boxShadow: props.focusBoxShadow,
      backgroundImage: 'none',
      ...(props.variant === 'tertiary' &&
        props.color === 'transparent' && {
          '&& [data-klear360-component="svg-path"]': {
            fill: props.hoverIconColor,
          },
        }),
    },
    // `boxShadow` carries `!important` here (and in the `:focus:not(:focus-visible)` rule below) -
    // confirmed by real-browser testing, not just the originally-reported case, to be necessary:
    // a host page's own `*:focus { box-shadow: none }` reset (see Button's decisions doc / API
    // docs: "do not use a global `*:focus { box-shadow: none }` reset on pages with Klear360
    // buttons") otherwise wins regardless of this rule's own selector specificity, since
    // `!important` always beats a non-important declaration. A plain declaration here could not
    // survive that reset even though this rule exists; our own `!important` can, because our
    // class-scoped selector has higher specificity than the host's bare `*` once both sides are
    // `!important` (specificity still breaks ties within the `!important` tier).
    '&:focus-visible': {
      backgroundColor: props.focusBackgroundColor,
      outline: `1px solid ${props.theme.colors.surface.background.primary.subtle}`,
      backgroundImage: 'none',
      boxShadow: `${
        props.focusBoxShadow
          ? `0px 0px 0px 4px ${props.focusRingColor}, ${props.focusBoxShadow}`
          : `0px 0px 0px 4px ${props.focusRingColor}`
      } !important`,
      ...(props.variant === 'tertiary' &&
        props.color === 'transparent' && {
          '&& [data-klear360-component="svg-path"]': {
            fill: props.hoverIconColor,
          },
        }),
    },
    // A button retains `:focus` after a mouse click even when it never becomes `:focus-visible`
    // (most browsers suppress the visible ring for pointer-originated focus, though this isn't
    // universal - some browsers/versions do still set `:focus-visible` on a button click, which is
    // exactly why the rule above needs the same `!important` treatment, not just this one). Without
    // this rule, tertiary/secondary buttons - whose "border" is this inset `box-shadow`, not an
    // actual `border` - would rely solely on the default-state rule above for their stroke while
    // focused-but-not-visible. `:not(:focus-visible)` keeps this from ever fighting the
    // `:focus-visible` rule above, so the keyboard focus ring's own appearance is unaffected.
    '&:focus:not(:focus-visible)': {
      backgroundColor: props.defaultBackgroundColor,
      boxShadow: props.defaultBoxShadow ? `${props.defaultBoxShadow} !important` : undefined,
    },
    '*': {
      transitionProperty: 'color, fill, opacity',
      transitionDuration: castWebType(
        makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
      ),
      transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    },
    ...styledPropsCSSObject,
  };
});

export default StyledBaseButton;
