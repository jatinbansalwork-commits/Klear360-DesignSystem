import { useContext, createContext } from 'react';
import type { Theme } from './';
import type { ThemeTokens } from '~tokens/theme';
import type { UseColorScheme } from '~utils/useColorScheme';
import type { TypographyPlatforms } from '~tokens/global';
import { throwKlear360Error } from '~utils/logger';

export type ThemeContext = UseColorScheme & {
  theme: Theme;
  themeTokens: ThemeTokens;
  platform: TypographyPlatforms;
};

export const ThemeContext = createContext<ThemeContext>({
  // @ts-expect-error set null
  theme: null,
  // @ts-expect-error set null
  themeTokens: null,
  colorScheme: 'light',
  platform: 'onDesktop',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (__DEV__) {
    if (!themeContext.theme) {
      throwKlear360Error({
        message: 'Klear360Provider is missing theme',
        moduleName: 'Klear360Provider',
      });
    }
    if (themeContext === undefined) {
      throwKlear360Error({
        message: 'useTheme must be used within Klear360Provider',
        moduleName: 'Klear360Provider',
      });
    }
  }
  return themeContext;
};

export default useTheme;
