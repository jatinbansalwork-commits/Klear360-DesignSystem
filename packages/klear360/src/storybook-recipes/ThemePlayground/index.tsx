/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import React, { useState } from 'react';
import { WorkspaceHome } from './Workspace/WorkspaceHome';
import { WorkspaceCard } from './Workspace/WorkspaceCard';
import { PhantomUI } from './PhantomUI';
import { ThemeSelector } from './ThemeSelector';
import { BrandedComponentKitchenSink } from './BrandedComponentKitchenSink';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme, createTheme, overrideTheme } from '~tokens/theme';
import type { ColorSchemeNames, ThemeTokens } from '~tokens/theme';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';
import { Card, CardBody } from '~components/Card';

const ThemePlayground = (): React.ReactElement => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [borderBase, setBorderBase] = useState<string>('2');
  const [colorScheme, setColorScheme] = useState<ColorSchemeNames>('light');
  const [selectedPreBuiltTheme, setSelectedPreBuiltTheme] = useState<string | undefined>(
    'klear360Theme',
  );
  const [showInternalDemoConfig, setShowInternalDemoConfig] = useState(false);
  const getTheme = (): ThemeTokens => {
    if (selectedColor) {
      return createTheme({ brandColor: selectedColor }).theme;
    }
    if (selectedPreBuiltTheme === 'paymentTheme') {
      return klear360Theme;
    }

    return klear360Theme;
  };

  const getOverriddenTheme = (): ThemeTokens => {
    return overrideTheme({
      baseThemeTokens: getTheme(),
      overrides: {
        border: {
          radius: {
            none: 0,
            // @ts-ignore
            small: Number(borderBase) * 1,
            // @ts-ignore
            medium: Number(borderBase) * 2,
            // @ts-ignore
            large: Number(borderBase) * 3,
            max: 9999,
            round: '50%',
          },
        },
      },
    });
  };

  return (
    <Klear360Provider
      themeTokens={getOverriddenTheme()}
      colorScheme={colorScheme}
      key={`${colorScheme}-${borderBase}-${selectedColor}-${selectedPreBuiltTheme}`}
    >
      <Box maxWidth={{ l: '50vw', m: '50vw', s: '100%' }}>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <ThemeSelector
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
            selectedPreBuiltTheme={selectedPreBuiltTheme}
            setSelectedPreBuiltTheme={setSelectedPreBuiltTheme}
            setBorderBase={setBorderBase}
            borderBase={borderBase}
            showInternalDemoConfig={showInternalDemoConfig}
            setShowInternalDemoConfig={setShowInternalDemoConfig}
          />
          <Card backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box>
                <Box flex={1}>
                  <Heading size="medium" marginBottom="spacing.4">
                    Workspace Home
                  </Heading>
                  <WorkspaceHome />
                </Box>
                <Box flex={1} marginTop="spacing.8">
                  <Heading size="medium" marginBottom="spacing.4">
                    Workspace Settings
                  </Heading>
                  <WorkspaceCard />
                </Box>
                <Box flex={1} marginTop="spacing.8">
                  <Heading size="medium" marginBottom="spacing.4">
                    Onboarding Flow
                  </Heading>
                  <PhantomUI />
                </Box>
                <Box marginTop="spacing.8">
                  <Heading size="medium" marginBottom="spacing.4">
                    Component Showcase
                  </Heading>
                  <BrandedComponentKitchenSink />
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Klear360Provider>
  );
};

export { ThemePlayground };
