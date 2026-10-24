import React from 'react';
import type { ReactElement } from 'react';
import { FloatingDelayGroup } from '@floating-ui/react';
import { ThemeContext } from './useTheme';
import { useKlear360Provider } from './useKlear360Provider';
import type { Klear360ProviderProps } from './types';
import { ThemeCssVariablesRoot } from './ThemeCssVariablesRoot';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

const tooltipDelays = { open: 300, close: 300 };

const Klear360Provider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: Klear360ProviderProps): ReactElement => {
  const { theme, themeContextValue } = useKlear360Provider({ initialColorScheme, themeTokens });

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <FloatingDelayGroup delay={tooltipDelays}>
        <ThemeCssVariablesRoot theme={theme} colorScheme={themeContextValue.colorScheme}>
          {/*
            If you want to add a new provider for keeping track of stack in component,
            You can move DrawerStackProvider to common utils and rename to GlobalStackProvider
            and reuse it for your component.
          */}
          <DrawerStackProvider>
            <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
          </DrawerStackProvider>
        </ThemeCssVariablesRoot>
      </FloatingDelayGroup>
    </ThemeContext.Provider>
  );
};

export { Klear360Provider };
