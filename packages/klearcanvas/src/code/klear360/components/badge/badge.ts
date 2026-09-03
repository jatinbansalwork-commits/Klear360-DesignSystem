import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { convertFigmaIconNameToKlear360IconName, isIconInstance } from '../../utils/iconUtils';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultProps } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  Klear360ComponentInstanceNode,
  Klear360GroupNode,
  Klear360Props,
} from '~/code/types/Klear360';

export const transformBadge = (
  klear360Instance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const isIconPresent = isPresent(klear360Instance.componentProperties.Icon?.value);

  // TODO figure out why this prop does not exist in Klear360 code
  // const isAllCaps = isPresent(klear360Instance.componentProperties.allCaps?.value);

  const contrast = jsxValue(klear360Instance.componentProperties.contrast?.value).toLowerCase();
  const intent = jsxValue(klear360Instance.componentProperties.intent?.value).toLowerCase();
  const size = jsxValue(klear360Instance.componentProperties.size?.value).toLowerCase();

  const children = findTextByLayerName(klear360Instance, 'badge-text') ?? '';

  // TODO figure out why figma structure for Badge icon is
  // different from the way it is done in other places
  let icon = '';
  if (isIconPresent) {
    const iconNodeWrapper = findNode(
      klear360Instance,
      (klear360Node) => klear360Node.layerName === 'badge-icon',
    ) as Klear360GroupNode;
    const iconNode = iconNodeWrapper.children[0];
    if (iconNode && isIconInstance(iconNode as Klear360ComponentInstanceNode)) {
      icon = convertFigmaIconNameToKlear360IconName(
        (iconNode as Klear360ComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  const props: Klear360Props = {
    contrast: {
      type: 'string',
      value: contrast,
    },
    variant: {
      type: 'string',
      value: intent,
    },
    size: {
      type: 'string',
      value: size,
    },
    icon: {
      type: 'instance',
      value: icon,
    },
  };

  return {
    component: component('Badge', {
      props,
      defaultValues: defaultProps,
      children,
    }),
    imports: klear360Imports([icon, 'Badge']),
  };
};
