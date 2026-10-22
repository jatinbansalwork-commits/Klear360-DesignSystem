/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import type { SpacerComponent, DividerComponent } from '../GenUIComponentTypes';
import { Box } from '~components/Box';
import { Divider } from '~components/Divider';

const RenderSpacerComponent = memo(({ size }: SpacerComponent) => {
  if (!size) return null;

  const sizeMap = {
    small: 'spacing.2',
    medium: 'spacing.4',
    large: 'spacing.5',
  } as const;

  return <Box height={sizeMap[size]} width={sizeMap[size]} />;
});

const RenderDividerComponent = memo(({ orientation = 'horizontal' }: DividerComponent) => {
  return (
    <Box display="flex" paddingY="spacing.7">
      <Divider
        orientation={orientation}
        {...(orientation === 'vertical' ? { height: '24px' } : {})}
      />
    </Box>
  );
});

export { RenderSpacerComponent, RenderDividerComponent };
