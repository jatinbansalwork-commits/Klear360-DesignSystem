/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import type { BadgeComponent } from '../GenUIComponentTypes';
import { Badge } from '~components/Badge';

const RenderBadgeComponent = memo(({ text, color }: BadgeComponent) => {
  if (!text) return null;

  return (
    <Badge color={color || 'neutral'} emphasis="subtle">
      {text}
    </Badge>
  );
});

export { RenderBadgeComponent };
