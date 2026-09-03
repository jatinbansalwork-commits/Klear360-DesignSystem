import type { MenuProps } from './types';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const Menu = (_props: MenuProps): React.ReactElement => {
  throwKlear360Error({
    message: 'Menu is not yet implemented for native',
    moduleName: 'Menu',
  });

  return <Text>Menu Component is not available for Native mobile apps.</Text>;
};

export { Menu };
