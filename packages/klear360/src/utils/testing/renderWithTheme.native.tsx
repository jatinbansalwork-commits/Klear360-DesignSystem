import type { RenderAPI, RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';

const Klear360Wrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
    {children}
  </Klear360Provider>
);

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderAPI =>
  render(ui, { ...options, wrapper: Klear360Wrapper });

export default renderWithTheme;
