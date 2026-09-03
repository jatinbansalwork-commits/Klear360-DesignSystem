import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformCounter = (
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
    contrast: {
      value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
      type: 'string',
    },
  };

  return {
    component: component('Counter', { props, defaultValues }),
    imports: klear360Imports(['Counter']),
  };
};
