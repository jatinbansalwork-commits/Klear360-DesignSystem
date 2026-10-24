import type { ReactNode } from 'react';
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { StyledAnnouncementBannerProps } from './types';
import { getAnnouncementBannerModuleClasses } from './getAnnouncementBannerModuleClasses';

type StyledAnnouncementBannerWebProps = StyledAnnouncementBannerProps & {
  className?: string;
  children?: ReactNode;
};

export const StyledAnnouncementBanner = React.forwardRef<
  HTMLElement,
  StyledAnnouncementBannerWebProps
>(({ alignment, isDark: _isDark, className, children, ...props }, ref) => (
  <BaseBox
    ref={ref as never}
    {...props}
    className={[getAnnouncementBannerModuleClasses({ alignment }), className]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </BaseBox>
));

StyledAnnouncementBanner.displayName = 'StyledAnnouncementBanner';
