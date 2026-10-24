import type { StyledAnnouncementBannerProps } from './types';
import styles from './AnnouncementBanner.module.scss';

export const getAnnouncementBannerModuleClasses = ({
  alignment,
}: Pick<StyledAnnouncementBannerProps, 'alignment'>): string =>
  [
    styles['announcement-banner'],
    alignment === 'center' ? styles['align-center'] : styles['align-left'],
  ]
    .filter(Boolean)
    .join(' ');
