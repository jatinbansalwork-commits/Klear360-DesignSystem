import React from 'react';
import type { ReactElement } from 'react';
import {
  ThemeProvider as StyledComponentThemeProvider,
  StyleSheetManager,
} from 'styled-components';
import { themeToCSSVariables } from '~utils/themeToCSSVariables';
import { FloatingDelayGroup } from '@floating-ui/react';
import stylisCSSHigherSpecificity from './stylisCSSHigherSpecificity';
import { ThemeContext } from './useTheme';
import { useKlear360Provider } from './useKlear360Provider';
import type { Klear360ProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

const tooltipDelays = { open: 300, close: 300 };

const Klear360Provider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: Klear360ProviderProps): ReactElement => {
  const { theme, themeContextValue } = useKlear360Provider({ initialColorScheme, themeTokens });

  const themeCssVariables = React.useMemo(
    () =>
      themeToCSSVariables({
        colors: theme.colors,
        elevation: theme.elevation,
        border: theme.border,
        typography: theme.typography,
      }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <FloatingDelayGroup delay={tooltipDelays}>
        <StyledComponentThemeProvider theme={theme}>
          <StyleSheetManager stylisPlugins={[stylisCSSHigherSpecificity()]}>
            {/*
              SCSS Modules read design tokens through CSS custom properties. The resolved Theme
              object (color scheme + breakpoint) is flattened here so migrated components can use
              var(--*) while styled-components consumers keep using theme.* until P3.
            */}
            <div
              style={themeCssVariables as React.CSSProperties}
              data-klear360-color-scheme={themeContextValue.colorScheme}
            >
              {/*
                If you want to add a new provider for keeping track of stack in component,
                You can move DrawerStackProvider to common utils and rename to GlobalStackProvider
                and reuse it for your component.
              */}
              <DrawerStackProvider>
                <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
              </DrawerStackProvider>
            </div>
          </StyleSheetManager>
        </StyledComponentThemeProvider>
      </FloatingDelayGroup>
    </ThemeContext.Provider>
  );
};

export { Klear360Provider };
