import type { Klear360Props } from '~/code/types/Klear360';

export const defaultValues: Klear360Props = {
  title: {
    type: 'string',
    value: '',
  },
  description: {
    type: 'string',
    value: 'string',
  },
  isFullWidth: {
    type: 'boolean',
    value: 'false',
  },
  isDismissible: {
    type: 'boolean',
    value: 'true',
  },
  contrast: {
    type: 'string',
    value: 'low',
  },
  intent: {
    type: 'string',
    value: 'neutral',
  },
  actions: {
    type: 'instance',
    value: '{}',
  },
};
