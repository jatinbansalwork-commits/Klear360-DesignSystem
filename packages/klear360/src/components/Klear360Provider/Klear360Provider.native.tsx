import type { ReactElement } from 'react';
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeContext } from './useTheme';
import { useKlear360Provider } from './useKlear360Provider';
import type { Klear360ProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

const gestureHandlerStyle = {
  flex: 1,
};

const Klear360Provider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: Klear360ProviderProps): ReactElement => {
  const { theme, themeContextValue } = useKlear360Provider({ initialColorScheme, themeTokens });

  return (
    <GestureHandlerRootView style={gestureHandlerStyle}>
      <PortalProvider>
        <ThemeContext.Provider value={themeContextValue}>
          <StyledComponentThemeProvider theme={theme}>
            <DrawerStackProvider>
              <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
            </DrawerStackProvider>
            <PortalHost name="Klear360BottomSheetPortal" />
          </StyledComponentThemeProvider>
        </ThemeContext.Provider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
};

export { Klear360Provider };
