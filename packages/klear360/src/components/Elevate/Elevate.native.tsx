import type { ElevateProps } from './types';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const Elevate = (_props: ElevateProps): React.ReactElement => {
  throwKlear360Error({
    message: 'Elevate is not yet implemented for native',
    moduleName: 'Elevate',
  });

  return <Text>Elevate Component is not available for Native mobile apps.</Text>;
};

export { Elevate };
