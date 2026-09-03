import type { ReactNode } from 'react';
import type { ThemeTokens, ColorSchemeNamesInput } from '~tokens/theme';

type Klear360ProviderProps = {
  themeTokens: ThemeTokens;
  colorScheme?: ColorSchemeNamesInput;
  children: ReactNode;
};

export type { Klear360ProviderProps };
