import { findNode } from './findNode';
import type { Klear360Node, Klear360TextNode } from '~/code/types/Klear360';

const isKlear360TextNode = (node: Klear360Node | null): node is Klear360TextNode => {
  if (node === null) return false;
  return node.type === 'TEXT';
};

export const findTextByLayerName = (
  klear360Node: Klear360Node,
  layerName: string,
): string | null => {
  const validateNode: (node: Klear360Node) => boolean = (node) =>
    node.layerName === layerName && node.type === 'TEXT';

  const textNode = findNode(klear360Node, validateNode);
  return isKlear360TextNode(textNode) ? textNode.characters.trim() : null;
};
