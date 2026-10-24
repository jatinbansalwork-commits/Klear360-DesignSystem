import type { CSSProperties } from 'react';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import type { Theme } from '~components/Klear360Provider';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { opacity } from '~tokens/global';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const getTabNavItemStyles = ({
  theme,
  isActive,
  foregroundColors,
}: {
  theme: Theme;
  isActive?: boolean;
  foregroundColors: { normal: string; subtle: string; hover: string };
}): CSSProperties => {
  return {
    ...getTextStyles({
      theme,
      size: 'medium',
      weight: isActive ? 'semibold' : 'medium',
    }),
    color: isActive ? foregroundColors.normal : foregroundColors.subtle,
    flex: 1,
    display: 'flex',
    gap: makeSpace(theme.spacing[2]),
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    paddingTop: makeSpace(theme.spacing[3]),
    paddingBottom: makeSpace(theme.spacing[3]),
    paddingLeft: makeSpace(theme.spacing[4]),
    paddingRight: makeSpace(theme.spacing[4]),
    borderRadius: makeBorderSize(theme.border.radius.medium),
    border: 'none',
    background: 'none',
    opacity: isActive ? 1 : opacity[1000],
    transition: `opacity ${makeMotionTime(theme.motion.duration.moderate)} ${theme.motion.easing.standard}`,
    position: 'relative',
  };
};

const getTabNavItemWrapperStyles = ({
  theme,
  isActive,
}: {
  theme: Theme;
  isActive?: boolean;
}): CSSProperties => ({
  position: 'relative',
  flexShrink: 0,
  padding: `${makeSpace(theme.spacing[2])} ${makeSpace(theme.spacing[1])}`,
  backgroundColor: 'transparent',
  borderColor: isActive ? theme.colors.surface.border.gray.muted : 'transparent',
  borderTopLeftRadius: makeBorderSize(theme.border.radius.medium),
  borderTopRightRadius: makeBorderSize(theme.border.radius.medium),
  transition: `${makeMotionTime(theme.motion.duration.moderate)} ${theme.motion.easing.standard}`,
  transitionProperty: 'background',
  zIndex: 1,
  cursor: 'pointer',
});

const getTabNavItemFocusRingStyles = (theme: Theme): CSSProperties =>
  getFocusRingStyles({ theme }) as CSSProperties;

export { getTabNavItemStyles, getTabNavItemWrapperStyles, getTabNavItemFocusRingStyles };
