import type { Klear360Props } from '~/code/types/Klear360';

export const defaultValues: Klear360Props = {
  intent: {
    type: 'string',
    value: 'neutral',
  },
  contrast: {
    type: 'string',
    value: 'low',
  },
  size: {
    type: 'string',
    value: 'medium',
  },
};
