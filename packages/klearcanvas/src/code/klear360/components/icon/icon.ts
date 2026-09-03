import { convertStyleNameToKlear360Name, isIconColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { findNode } from '../../utils/findNode';
import { convertFigmaIconNameToKlear360IconName } from '../../utils/iconUtils';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  Klear360ComponentInstanceNode,
  Klear360Node,
  Klear360Props,
  Klear360VectorNode,
} from '~/code/types/Klear360';

const isKlear360VectorNode = (node: Klear360Node): node is Klear360VectorNode => {
  return node.type === 'VECTOR';
};

export const transformIcon = (
  klear360Instance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: Klear360Props = {};

  const klear360IconName = convertFigmaIconNameToKlear360IconName(
    klear360Instance?.name || 'unidentified-icon',
  );

  // TODO fix mapping of pixels to size
  props.size = {
    value: 'medium',
    type: 'string',
  };

  const vectorNode = findNode(klear360Instance, (node) => node.type === 'VECTOR');
  if (vectorNode && isKlear360VectorNode(vectorNode)) {
    if (vectorNode.fillStyleId !== figma.mixed) {
      const fillStyle = figma.getStyleById(vectorNode.fillStyleId);
      if (fillStyle) {
        const styleName = fillStyle.name;
        const klear360TokenName = convertStyleNameToKlear360Name(styleName);
        const isValidToken = isIconColorToken(klear360TokenName);

        props.color = {
          value: klear360TokenName,
          type: 'string',
          isCommented: !isValidToken,
          comment: isValidToken ? '' : 'Unsupported color token for Icon',
        };
      }
    }
  }

  return {
    component: component(klear360IconName, {
      props,
      defaultValues,
    }),
    imports: klear360Imports([klear360IconName]),
  };
};
