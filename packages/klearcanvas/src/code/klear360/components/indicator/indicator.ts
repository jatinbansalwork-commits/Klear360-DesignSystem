import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformIndicator = (
  klear360ComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = klear360ComponentInstance.componentProperties;

  const props: Klear360Props = {
    intent: {
      value: jsxValue(componentProperties.intent?.value).toLowerCase(),
      type: 'string',
    },
    size: {
      value: jsxValue(componentProperties.size?.value).toLowerCase(),
      type: 'string',
    },
  };

  const children = findTextByLayerName(klear360ComponentInstance, 'Label') ?? '';

  return {
    component: component('Indicator', { props, defaultValues, children }),
    imports: klear360Imports(['Indicator']),
  };
};
