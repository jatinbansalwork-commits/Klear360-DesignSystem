import React from 'react';
import type { ListViewFilterProps } from './types';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const ListViewFilters = (_prop: ListViewFilterProps): React.ReactElement => {
  throwKlear360Error({
    message: 'ListViewFilter is not yet implemented for native',
    moduleName: 'ListViewFilter',
  });

  return <Text>ListView is not available for Native mobile apps.</Text>;
};

export { ListViewFilters };
