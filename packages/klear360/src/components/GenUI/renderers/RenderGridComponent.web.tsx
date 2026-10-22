/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { ComponentRenderer } from '../GenUISchemaRenderer';
import type { GridComponent } from '../GenUIComponentTypes';
import { Box } from '~components/Box';

const RenderGridComponent = memo(({ columns, gap, children }: GridComponent) => {
  if (!columns || !children || children.length === 0) {
    return null;
  }

  const sizeMap = {
    small: 'spacing.2',
    medium: 'spacing.4',
    large: 'spacing.5',
  } as const;

  return (
    <Box
      display="grid"
      width="100%"
      marginY="spacing.3"
      gridTemplateColumns={`repeat(${columns}, 1fr)`}
      gap={sizeMap[gap ?? 'small']}
    >
      {children.map((child, index) => (
        <ComponentRenderer key={index} component={child} index={index} />
      ))}
    </Box>
  );
});

export { RenderGridComponent };
