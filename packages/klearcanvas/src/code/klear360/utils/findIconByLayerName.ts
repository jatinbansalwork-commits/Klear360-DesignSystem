import { findNode } from './findNode';
import { convertFigmaIconNameToKlear360IconName, isIconInstance } from './iconUtils';
import type { Klear360ComponentInstanceNode, Klear360Node } from '~/code/types/Klear360';

const isKlear360ComponentInstanceNode = (
  node: Klear360Node | null,
): node is Klear360ComponentInstanceNode => {
  if (node === null) return false;
  return node.type === 'INSTANCE';
};

export const findIconByLayerName = (
  klear360Node: Klear360Node,
  layerName: string,
): string | null => {
  const validateNode: (node: Klear360Node) => boolean = (node) =>
    node.layerName === layerName && node.type === 'INSTANCE';

  const iconNode = findNode(klear360Node, validateNode);
  if (isKlear360ComponentInstanceNode(iconNode) && isIconInstance(iconNode)) {
    return convertFigmaIconNameToKlear360IconName(iconNode.name || 'unidentified-icon');
  }

  return null;
};
