import React from 'react';
/* eslint-disable react/jsx-no-useless-fragment */
import type { InputGroupProps } from './types';
import { Text } from '~components/Typography';
import { throwKlear360Error } from '~utils/logger';

const InputGroup = (_props: InputGroupProps): React.ReactElement => {
  throwKlear360Error({
    message: 'InputGroup is not yet implemented for native',
    moduleName: 'InputGroup',
  });

  return <Text>InputGroup Component is not available for Native mobile apps.</Text>;
};

export { InputGroup };
