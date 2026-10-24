import React from 'react';
import type { ReactElement, CSSProperties } from 'react';
import { themeToCSSVariables } from '~utils/themeToCSSVariables';
import type { Theme } from './index';
import type { ColorSchemeNames } from '~tokens/theme';

const getThemeCssVariableStyle = (theme: Theme): CSSProperties =>
  themeToCSSVariables({
    colors: theme.colors,
    elevation: theme.elevation,
    border: theme.border,
    typography: theme.typography,
    motion: theme.motion,
  }) as CSSProperties;

type ThemeCssVariablesRootProps = {
  theme: Theme;
  colorScheme: ColorSchemeNames;
  children: React.ReactNode;
};

const ThemeCssVariablesRoot = ({
  theme,
  colorScheme,
  children,
}: ThemeCssVariablesRootProps): ReactElement => (
  <div style={getThemeCssVariableStyle(theme)} data-klear360-color-scheme={colorScheme}>
    {children}
  </div>
);

export { ThemeCssVariablesRoot, getThemeCssVariableStyle };
