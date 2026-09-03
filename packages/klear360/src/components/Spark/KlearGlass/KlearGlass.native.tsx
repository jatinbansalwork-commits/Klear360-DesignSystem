import type { KlearGlassProps } from './types';
import { throwKlear360Error } from '~utils/logger';
import { Text } from '~components/Typography';

const KlearGlass = (_props: KlearGlassProps): React.ReactElement => {
  throwKlear360Error({
    message: 'KlearSense is not yet implemented for React Native',
    moduleName: 'KlearSense',
  });

  return <Text>KlearSense Component is not available for Native mobile apps.</Text>;
};

export { KlearGlass };
