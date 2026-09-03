import type { ReactElement } from 'react';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';

const themeWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
    {children}
  </Klear360Provider>
);

export default themeWrapper;
