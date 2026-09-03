import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformProgressBar = (
  klear360ComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = klear360ComponentInstance.componentProperties;

  const intent = jsxValue(componentProperties.intent?.value).toLowerCase();
  const size = jsxValue(componentProperties.size?.value).toLowerCase();

  const props: Klear360Props = {
    // TODO figma has "none" as a value for intent, but we don't have that in klear360
    intent: {
      value: intent === 'none' ? 'neutral' : intent,
      type: 'string',
    },
    // TODO figma sizes don't match klear360 sizes
    size: {
      value: size === 'large' ? 'medium' : size,
      type: 'string',
    },
    contrast: {
      value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
      type: 'string',
    },
    isIndeterminate: {
      value: jsxValue(componentProperties.isIndeterminate?.value).toLowerCase(),
      type: 'boolean',
    },
    showPercentage: {
      value: jsxValue(componentProperties.showPercentage?.value).toLowerCase(),
      type: 'boolean',
    },
    label: {
      type: 'string',
      value: findTextByLayerName(klear360ComponentInstance, 'Label') ?? '',
    },
  };

  return {
    component: component('ProgressBar', { props, defaultValues }),
    imports: klear360Imports(['ProgressBar']),
  };
};
