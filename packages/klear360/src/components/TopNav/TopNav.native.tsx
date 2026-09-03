import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

type TopNavProps = {
  children?: React.ReactNode;
  variant?: 'primary' | 'neutral';
  [key: string]: unknown;
};

const TopNav = (_props: TopNavProps): React.ReactElement => {
  throwKlear360Error({
    message: 'TopNav is not yet implemented for native',
    moduleName: 'TopNav',
  });

  return <Text>TopNav Component is not available for Native mobile apps.</Text>;
};

export { TopNav };
