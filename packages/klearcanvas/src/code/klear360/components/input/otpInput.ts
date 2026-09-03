import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformOtpInput = (
  klear360ComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = klear360ComponentInstance.componentProperties;

  const isHelpTextPresent = isPresent(componentProperties.helperText?.value);

  const props: Klear360Props = {
    labelPosition: {
      value: jsxValue(componentProperties.labelPosition?.value).toLowerCase(),
      type: 'string',
    },
    otpLength: {
      value: jsxValue(componentProperties.numberOfFields?.value).toLowerCase(),
      type: 'number',
    },
  };

  props.label = {
    value: findTextByLayerName(klear360ComponentInstance, 'Label') ?? '',
    type: 'string',
  };

  if (isHelpTextPresent) {
    props.helpText = {
      value: findTextByLayerName(klear360ComponentInstance, 'Help Text') ?? '',
      type: 'string',
    };
  }

  return {
    component: component('OTPInput', { props, defaultValues }),
    imports: klear360Imports(['OTPInput']),
  };
};
