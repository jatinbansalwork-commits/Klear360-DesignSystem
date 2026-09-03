import type { SideNavLinkProps } from '../types';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const SideNavLink = (_props: SideNavLinkProps): React.ReactElement => {
  throwKlear360Error({
    message: 'SideNavLink is not yet implemented for native',
    moduleName: 'SideNavLink',
  });

  return <Text>SideNavLink Component is not available for Native mobile apps.</Text>;
};

export { SideNavLink };
