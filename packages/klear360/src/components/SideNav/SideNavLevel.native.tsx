import type { SideNavLevelProps } from './types';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const SideNavLevel = (_props: SideNavLevelProps): React.ReactElement => {
  throwKlear360Error({
    message: 'SideNavLevel is not yet implemented for native',
    moduleName: 'SideNavLevel',
  });

  return <Text>SideNavLevel Component is not available for Native mobile apps.</Text>;
};

export { SideNavLevel };
