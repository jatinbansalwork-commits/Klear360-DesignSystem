import React from 'react';

import { StyledAnnouncementBanner } from './StyledAnnouncementBanner';
import { getBannerIconColor, getBannerTextColor } from './styles';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { useTheme } from '~components/Klear360Provider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/** @typedef {import('./types').AnnouncementBannerProps} AnnouncementBannerProps */

/**
 * @param {AnnouncementBannerProps} props
 * @param {React.Ref<import('~utils/types').Klear360ElementRef>} ref
 * @returns {React.ReactElement}
 */
const _AnnouncementBanner = (
  {
    children,
    alignment = 'center',
    icon: Icon,
    accessibilityLabel = 'Announcement',
    testID,
    ...rest
  },
  ref,
) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const a11yProps = makeAccessible({
    role: 'region',
    label: accessibilityLabel,
  });

  return (
    <StyledAnnouncementBanner
      ref={ref}
      isDark={isDark}
      alignment={alignment}
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.AnnouncementBanner, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {Icon ? (
        <BaseBox display="flex" alignItems="center" {...makeAccessible({ hidden: true })}>
          <Icon size="small" color={getBannerIconColor(isDark)} />
        </BaseBox>
      ) : null}
      <Text size="small" weight="medium" color={getBannerTextColor(isDark)} truncateAfterLines={1}>
        {children}
      </Text>
    </StyledAnnouncementBanner>
  );
};

const AnnouncementBanner = assignWithoutSideEffects(React.forwardRef(_AnnouncementBanner), {
  displayName: 'AnnouncementBanner',
});

export { AnnouncementBanner };
