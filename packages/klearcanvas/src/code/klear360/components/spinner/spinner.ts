import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformSpinner = (
  klear360Instance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: Klear360Props = {};

  const componentProperties = klear360Instance.componentProperties;

  props.size = {
    value: jsxValue(componentProperties.size?.value).toLowerCase(),
    type: 'string',
  };

  props.contrast = {
    value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
    type: 'string',
  };

  const isLabelPresent = isPresent(componentProperties.label?.value);
  if (isLabelPresent) {
    props.label = {
      value: findTextByLayerName(klear360Instance, 'Label') ?? '',
      type: 'string',
    };

    props.labelPosition = {
      value: props.size.value === 'medium' ? 'right' : 'bottom',
      type: 'string',
    };
  }

  return {
    component: component('Spinner', {
      props,
      defaultValues,
    }),
    imports: klear360Imports(['Spinner']),
  };
};
