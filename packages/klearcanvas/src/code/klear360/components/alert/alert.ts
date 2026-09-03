import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  Klear360ComponentInstanceNode,
  Klear360Props,
  Klear360TextNode,
} from '~/code/types/Klear360';

export const transformAlert = (
  klear360Instance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = klear360Instance.componentProperties;

  const intent = jsxValue(componentProperties.Intent?.value).toLowerCase();

  const contrast = jsxValue(componentProperties.contrast?.value).toLowerCase();

  const isDismissible = jsxValue(componentProperties.isDismissible?.value).toLowerCase();

  const isFullWidth = jsxValue(componentProperties.isFullWidth?.value).toLowerCase();

  const title = findTextByLayerName(klear360Instance, 'title') ?? '';
  const description = findTextByLayerName(klear360Instance, 'message') ?? '';

  const props: Klear360Props = {
    intent: {
      type: 'string',
      value: intent,
    },
    contrast: {
      type: 'string',
      value: contrast,
    },
    isDismissible: {
      type: 'boolean',
      value: isDismissible,
    },
    isFullWidth: {
      type: 'boolean',
      value: isFullWidth,
    },
    title: {
      type: 'string',
      value: title,
    },
    description: {
      type: 'string',
      value: description,
    },
  };

  const isPrimaryActionPresent = isPresent(componentProperties.primaryAction?.value);
  const isSecondaryActionPresent = isPresent(componentProperties.secondaryAction?.value);

  let actions = '{';

  if (isPrimaryActionPresent) {
    const primaryActionBaseWrapper = findNode(
      klear360Instance,
      (node) => node.type === 'INSTANCE' && node.layerName === '_CButton',
    ) as Klear360ComponentInstanceNode;

    const actionBaseNode = primaryActionBaseWrapper.children[0] as Klear360ComponentInstanceNode;
    const textNode = actionBaseNode.children[0] as Klear360TextNode;
    const text = textNode.characters;
    actions += `primary: { text: "${text}" }, `;
  }

  if (isSecondaryActionPresent) {
    const primaryActionBaseWrapper = findNode(
      klear360Instance,
      (node) => node.type === 'INSTANCE' && node.layerName === '_CLink',
    ) as Klear360ComponentInstanceNode;

    const actionBaseNode = primaryActionBaseWrapper.children[0] as Klear360ComponentInstanceNode;
    const textNode = actionBaseNode.children[0] as Klear360TextNode;
    const text = textNode.characters;
    actions += `secondary: { text: "${text}" }`;
  }

  actions += '}';

  props.actions = {
    type: 'instance',
    value: actions,
  };

  return {
    component: component('Alert', {
      props,
      defaultValues,
    }),
    imports: klear360Imports(['Alert']),
  };
};
