/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import type { AmountComponent } from '../GenUIComponentTypes';
import { Text } from '~components/Typography';
import { Amount } from '~components/Amount';

const RenderAmountComponent = memo(({ value, currency }: AmountComponent) => {
  const resolvedCurrency = currency || 'INR';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    return <Text size="medium">-</Text>;
  }
  return <Amount value={numValue} currency={resolvedCurrency as 'INR' | 'MYR'} />;
});

export { RenderAmountComponent };
