import type { CSSProperties } from 'react';
import { classes, COLLAPSED_L1_WIDTH } from './tokens';
import type { Theme } from '~components/Klear360Provider';
import { castWebType, makeMotionTime, makeSize, makeSpace } from '~utils';
import { size as sizeTokens } from '~tokens/global';

const { SHOW_WHEN_COLLAPSED, HIDE_WHEN_COLLAPSED, TRANSITIONING, L1_ITEM_WRAPPER } = classes;

const getSideNavMotionTokens = (theme: Theme): { quick: string; xmoderate: string; easing: Theme['motion']['easing'] } => ({
  quick: castWebType(makeMotionTime(theme.motion.duration.quick)),
  xmoderate: castWebType(makeMotionTime(theme.motion.duration.xmoderate)),
  easing: theme.motion.easing,
});

/** Inline styles for expandable SideNav shell (opacity transitions on collapsed labels). */
const getSideNavContainerInlineStyle = ({
  theme,
  isSideNavExpandable,
}: {
  theme: Theme;
  isSideNavExpandable: boolean;
}): CSSProperties | undefined => {
  if (!isSideNavExpandable) {
    return undefined;
  }
  const { quick, xmoderate, easing } = getSideNavMotionTokens(theme);
  return {
    ['--sidenav-width-transition-enter' as string]: `width ${xmoderate} ${easing.entrance}`,
    ['--sidenav-collapse-width' as string]: makeSize(COLLAPSED_L1_WIDTH),
    ['--sidenav-width-transition-collapse' as string]: `width ${quick} ${easing.exit}`,
    ['--sidenav-opacity-transition-exit' as string]: `opacity ${quick} ${easing.exit}`,
    ['--sidenav-opacity-transition-enter' as string]: `opacity ${quick} ${easing.entrance}`,
  };
};

/** Inline styles for L1 menu width / item padding transitions. */
const getL1MenuInlineStyle = ({
  theme,
  isSideNavExpandable,
}: {
  theme: Theme;
  isSideNavExpandable: boolean;
}): CSSProperties => {
  const { quick, xmoderate, easing } = getSideNavMotionTokens(theme);
  return {
    width: '100%',
    transition: isSideNavExpandable ? 'none' : `width ${xmoderate} ${easing.entrance}`,
    ['--sidenav-collapse-width' as string]: makeSize(COLLAPSED_L1_WIDTH),
    ['--sidenav-l1-item-padding-expanded' as string]: makeSpace(theme.spacing[3]),
    ['--sidenav-l1-item-padding-collapsed' as string]: `${makeSpace(theme.spacing[3])} ${makeSpace(theme.spacing[3])}`,
    ['--sidenav-width-transition-collapse' as string]: `width ${quick} ${easing.exit}`,
  };
};

const getBannerContainerInlineStyle = (theme: Theme): CSSProperties => ({
  ['--sidenav-banner-border' as string]: theme.colors.surface.border.gray.muted,
  ['--sidenav-banner-padding' as string]: makeSpace(theme.spacing[3]),
  ['--sidenav-banner-max-height' as string]: makeSize(sizeTokens['100']),
});

export {
  getSideNavContainerInlineStyle,
  getL1MenuInlineStyle,
  getBannerContainerInlineStyle,
  SHOW_WHEN_COLLAPSED,
  HIDE_WHEN_COLLAPSED,
  TRANSITIONING,
  L1_ITEM_WRAPPER,
};
