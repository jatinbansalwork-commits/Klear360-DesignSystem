import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const TabNavItem = (_props: never): React.ReactElement => {
  throwKlear360Error({
    message: 'TabNavItem is not yet implemented for native',
    moduleName: 'TabNavItem',
  });

  return <Text>TabNavItem Component is not available for Native mobile apps.</Text>;
};

export { TabNavItem };
