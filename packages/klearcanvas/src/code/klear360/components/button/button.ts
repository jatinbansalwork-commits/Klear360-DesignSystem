import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { findIconByLayerName } from '../../utils/findIconByLayerName';
import { klear360Imports } from '../../utils/imports';
import { transformButtonVariant } from './utils';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformButton = (
  klear360ComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = klear360ComponentInstance.componentProperties;

  const size = componentProperties.size?.value;
  const variant = componentProperties.variant?.value;
  let icon = '';
  let iconPosition = '';

  const children = findTextByLayerName(klear360ComponentInstance, 'Text') ?? '';

  const iconLeftNode = findNode(
    klear360ComponentInstance,
    (klear360Node) => klear360Node.layerName === 'Icon Left',
  );

  if (iconLeftNode) {
    icon = findIconByLayerName(iconLeftNode, 'Icon (change here)') ?? '';
    iconPosition = 'left';
  }

  const iconRightNode = findNode(
    klear360ComponentInstance,
    (klear360Node) => klear360Node.layerName === 'Icon Right',
  );

  if (iconRightNode) {
    icon = findIconByLayerName(iconRightNode, 'Icon (change here)') ?? '';
    iconPosition = 'right';
  }

  const props: Klear360Props = {
    size: { value: jsxValue(size).toLowerCase(), type: 'string' },
    variant: {
      value: transformButtonVariant(jsxValue(variant)),
      type: 'string',
    },
    isFullWidth: {
      value: jsxValue(componentProperties.isFullWidth?.value),
      type: 'boolean',
    },
    icon: {
      value: icon,
      type: 'instance',
    },
    iconPosition: {
      value: iconPosition,
      type: 'string',
    },
  };

  return {
    component: component('Button', {
      props,
      defaultValues,
      children,
    }),
    imports: klear360Imports(['Button', icon]),
  };
};
