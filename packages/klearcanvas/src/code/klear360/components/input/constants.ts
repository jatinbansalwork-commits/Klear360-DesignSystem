import type { Klear360HelperProps, Klear360Props } from '~/code/types/Klear360';

export const defaultValues: Klear360Props = {
  labelPosition: { value: 'top', type: 'string' },
  showClearButton: { value: 'false', type: 'boolean' },
  numberOfLines: { value: '2', type: 'number' },
  otpLength: { value: '6', type: 'number' },
};

export const helpers: Klear360HelperProps = {
  value: 'instance',
  onChange: 'instance',
};
