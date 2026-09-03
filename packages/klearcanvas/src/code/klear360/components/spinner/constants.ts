import type { Klear360Props } from '~/code/types/Klear360';

export const defaultValues: Klear360Props = {
  size: {
    type: 'string',
    value: 'medium',
  },
  contrast: {
    type: 'string',
    value: 'low',
  },
  labelPosition: {
    type: 'string',
    value: 'right',
  },
  label: {
    type: 'string',
    value: '',
  },
};
