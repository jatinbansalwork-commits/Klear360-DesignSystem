import type { CSSProperties } from 'react';
import { NAV_ITEM_HEIGHT, getNavItemTransition } from '../tokens';
import type { Theme } from '~components/Klear360Provider';
import { makeBorderSize, makeSize, makeSpace } from '~utils';

const getCurvedVerticalLineStyle = (theme: Theme): CSSProperties => {
  const { colors, border, spacing } = theme;
  return {
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderColor: `${colors.transparent} ${colors.transparent} ${colors.surface.border.gray.muted} ${colors.surface.border.gray.muted}`,
    borderStyle: 'solid',
    borderRadius: `${makeBorderSize(border.radius.none)} ${makeBorderSize(
      border.radius.none,
    )} ${makeBorderSize(border.radius.none)} ${makeBorderSize(border.radius.medium)}`,
    height: '100vh',
    position: 'absolute',
    top: `calc(-100vh + ${makeSize(NAV_ITEM_HEIGHT / 2)})`,
    width: makeSpace(spacing[3]),
    left: makeSpace(-spacing[3]),
  };
};

const getNavLinkShellStyle = ({
  theme,
  hasDescription,
}: {
  theme: Theme;
  hasDescription: boolean;
}): CSSProperties => ({
  ['--sidenav-link-transition' as string]: getNavItemTransition(theme),
  ['--sidenav-link-padding-y' as string]: makeSpace(theme.spacing[hasDescription ? 3 : 0]),
  ['--sidenav-link-padding-x' as string]: makeSpace(theme.spacing[4]),
  ['--sidenav-link-margin-y' as string]: makeSpace(theme.spacing[1]),
  ['--sidenav-link-height' as string]: hasDescription ? 'auto' : makeSize(NAV_ITEM_HEIGHT),
});

export { getCurvedVerticalLineStyle, getNavLinkShellStyle };
