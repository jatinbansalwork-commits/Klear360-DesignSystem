import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformRadio = (
  klear360Instance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const children = findTextByLayerName(klear360Instance, 'Label') ?? '';

  const isHelpTextPresent = isPresent(klear360Instance.componentProperties.helpText?.value);

  let helpText = '';
  if (isHelpTextPresent) {
    helpText = findTextByLayerName(klear360Instance, 'Help Text') ?? '';
  }

  const size = jsxValue(klear360Instance.componentProperties.size?.value).toLowerCase();

  const props: Klear360Props = {
    size: {
      type: 'string',
      value: size,
    },
    helpText: {
      value: helpText,
      type: 'string',
    },
  };
  return {
    component: component('Radio', {
      props,
      defaultValues,
      children,
    }),
    imports: klear360Imports(['Radio']),
  };
};
