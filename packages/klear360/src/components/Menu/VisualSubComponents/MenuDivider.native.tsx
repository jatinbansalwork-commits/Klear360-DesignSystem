import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const MenuDivider = (_styledProps: StyledPropsKlear360): React.ReactElement => {
  throwKlear360Error({
    message: 'MenuDivider is not yet implemented for native',
    moduleName: 'MenuDivider',
  });

  return <Text>MenuDivider Component is not available for Native mobile apps.</Text>;
};

export { MenuDivider };
