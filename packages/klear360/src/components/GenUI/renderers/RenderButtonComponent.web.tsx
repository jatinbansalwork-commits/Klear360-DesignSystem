/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { useGenUIAction } from '../GenUIContext';
import type { ButtonComponent } from '../GenUIComponentTypes';
import { Button } from '~components/Button';

const RenderButtonComponent = memo(({ text, action }: ButtonComponent) => {
  const onActionClick = useGenUIAction();

  if (!text) return null;

  const handleClick = () => {
    if (action && onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <Button marginTop="spacing.2" variant="tertiary" onClick={handleClick}>
      {text}
    </Button>
  );
});

export { RenderButtonComponent };
