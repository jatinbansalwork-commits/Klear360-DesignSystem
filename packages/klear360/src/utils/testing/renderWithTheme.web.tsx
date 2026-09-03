import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderResult =>
  render(
    <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
      {ui}
    </Klear360Provider>,
    options,
  );

export default renderWithTheme;
