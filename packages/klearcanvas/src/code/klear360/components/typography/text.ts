import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { textDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformText = (
  klear360Instance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: Klear360Props = {};

  const componentProperties = klear360Instance.componentProperties;

  props.size = {
    value: jsxValue(componentProperties.size?.value).toLowerCase(),
    type: 'string',
  };

  props.type = {
    value: jsxValue(componentProperties.type?.value).toLowerCase(),
    type: 'string',
  };

  props.weight = {
    value: jsxValue(componentProperties.weight?.value).toLowerCase(),
    type: 'string',
  };

  props.contrast = {
    value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
    type: 'string',
  };

  props.variant = {
    value: jsxValue(componentProperties.variant?.value).toLowerCase(),
    type: 'string',
  };

  const children = findTextByLayerName(klear360Instance, 'Text') ?? '';

  return {
    component: component('Text', {
      props,
      defaultValues: textDefaultValues,
      children,
    }),
    imports: klear360Imports(['Text']),
  };
};
