import { makeSpace } from '~utils/makeSpace';

/**
 * @param {boolean} isDark
 * @returns {import('~components/Typography/BaseText/types').BaseTextProps['color']}
 */
export const getBannerTextColor = (isDark) =>
  isDark ? 'surface.text.staticWhite.subtle' : 'surface.text.gray.subtle';

/**
 * @param {boolean} isDark
 * @returns {import('~components/Icons').IconColors}
 */
export const getBannerIconColor = (isDark) =>
  isDark ? 'surface.icon.staticWhite.subtle' : 'surface.icon.gray.subtle';

/**
 * @param {import('styled-components').StyledProps<import('./types').StyledAnnouncementBannerProps>} props
 * @returns {import('styled-components').CSSObject}
 */
export const getCommonStyles = (props) => {
  const { theme, isDark, alignment } = props;

  const background = isDark
    ? theme.colors.interactive.background.staticBlack.fadedHighlighted
    : theme.colors.surface.background.gray.subtle;

  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: makeSpace(theme.spacing[2]),
    justifyContent: alignment === 'center' ? 'center' : 'flex-start',
    width: '100%',
    background,
    paddingTop: makeSpace(theme.spacing[3]),
    paddingBottom: makeSpace(theme.spacing[3]),
    paddingLeft: makeSpace(theme.spacing[5]),
    paddingRight: makeSpace(theme.spacing[5]),
    boxSizing: 'border-box',
  };
};
