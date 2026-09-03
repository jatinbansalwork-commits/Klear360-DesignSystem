import { AnnouncementBanner } from './AnnouncementBanner';
import type { AnnouncementBannerAlignment } from './types';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { AnnouncementIcon } from '~components/Icons';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';
import type { ColorSchemeNames } from '~tokens/theme';

const colorSchemes: ColorSchemeNames[] = ['light', 'dark'];
const alignments: AnnouncementBannerAlignment[] = ['center', 'left'];

export const AnnouncementBannerKitchenSink = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {colorSchemes.map((colorScheme) => (
        <Klear360Provider key={colorScheme} themeTokens={klear360Theme} colorScheme={colorScheme}>
          <Box
            display="flex"
            flexDirection="column"
            gap="spacing.6"
            padding="spacing.6"
            backgroundColor="surface.background.gray.subtle"
          >
            <Heading size="medium">{`colorScheme="${colorScheme}"`}</Heading>
            {alignments.map((alignment) => (
              <Box
                key={`${colorScheme}-${alignment}`}
                display="flex"
                flexDirection="column"
                gap="spacing.3"
              >
                <Text size="small" weight="semibold" color="surface.text.gray.muted">
                  {`alignment="${alignment}"`}
                </Text>
                <AnnouncementBanner icon={AnnouncementIcon} alignment={alignment}>
                  Enter promotional text here
                </AnnouncementBanner>
                <Text size="small" weight="semibold" color="surface.text.gray.muted">
                  Without icon
                </Text>
                <AnnouncementBanner alignment={alignment}>
                  Enter promotional text here
                </AnnouncementBanner>
              </Box>
            ))}
          </Box>
        </Klear360Provider>
      ))}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/AnnouncementBanner',
  component: AnnouncementBannerKitchenSink,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
