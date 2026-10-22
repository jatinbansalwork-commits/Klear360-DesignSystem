/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { ComponentRenderer } from '../GenUISchemaRenderer';
import type { StackComponent } from '../GenUIComponentTypes';
import { Box } from '~components/Box';

const RenderStackComponent = memo(({ direction = 'vertical', gap, children }: StackComponent) => {
  if (!children || children.length === 0) {
    return null;
  }

  const sizeMap = {
    small: 'spacing.2',
    medium: 'spacing.4',
    large: 'spacing.5',
  } as const;

  return (
    <Box
      display="flex"
      width="100%"
      paddingY="spacing.3"
      flexDirection={direction === 'vertical' ? 'column' : 'row'}
      gap={sizeMap[gap ?? 'small']}
    >
      {children.map((child, index) => (
        <ComponentRenderer key={index} component={child} index={index} />
      ))}
    </Box>
  );
});

export { RenderStackComponent };
