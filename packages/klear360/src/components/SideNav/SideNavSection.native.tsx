import type { SideNavSectionProps } from './types';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const SideNavSection = (_props: SideNavSectionProps): React.ReactElement => {
  throwKlear360Error({
    message: 'SideNavSection is not yet implemented for native',
    moduleName: 'SideNavSection',
  });

  return <Text>SideNavSection Component is not available for Native mobile apps.</Text>;
};

export { SideNavSection };
