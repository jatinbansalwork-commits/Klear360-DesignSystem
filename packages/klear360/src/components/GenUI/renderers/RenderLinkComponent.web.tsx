/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { useGenUIAction } from '../GenUIContext';
import type { LinkComponent } from '../GenUIComponentTypes';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Link } from '~components/Link';

const RenderLinkComponent = memo(({ text, action }: LinkComponent) => {
  const onActionClick = useGenUIAction();

  if (!text) return null;

  if (!action) {
    return (
      <Box marginBottom="spacing.2">
        <Text size="medium">{text}</Text>
      </Box>
    );
  }

  return (
    <Box marginBottom="spacing.2">
      <Link
        variant="button"
        onClick={() => {
          if (onActionClick) {
            onActionClick(action);
          }
        }}
      >
        {text}
      </Link>
    </Box>
  );
});

export { RenderLinkComponent };
