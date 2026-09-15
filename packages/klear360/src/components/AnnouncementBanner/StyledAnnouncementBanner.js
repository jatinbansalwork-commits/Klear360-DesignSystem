import styled from 'styled-components';
import { getCommonStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';

/**
 * @type {import('styled-components').StyledComponent<
 *   typeof BaseBox,
 *   import('~components/Klear360Provider').Theme,
 *   import('./types').StyledAnnouncementBannerProps
 * >}
 */
export const StyledAnnouncementBanner = styled(BaseBox).withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    /** @type {string} */ (prop) !== 'isDark' &&
    /** @type {string} */ (prop) !== 'alignment' &&
    omitPropsFromHTML(/** @type {never} */ (prop), /** @type {never} */ (defaultValidatorFn)),
  displayName: 'StyledAnnouncementBanner',
})(getCommonStyles);
