import type {
  Klear360ComponentInstanceNode,
  Klear360FrameNode,
  Klear360GroupNode,
  Klear360Node,
} from '~/code/types/Klear360';

const canHaveChildren = (
  node: Klear360Node,
): node is Klear360GroupNode | Klear360FrameNode | Klear360ComponentInstanceNode => {
  return node.type === 'GROUP' || node.type === 'FRAME' || node.type === 'INSTANCE';
};

export const findNode = (
  node: Klear360Node,
  processNode: (node: Klear360Node) => boolean,
): null | Klear360Node => {
  if (node) {
    const shouldStopTraversal = processNode(node);
    if (shouldStopTraversal) {
      return node;
    }

    if (canHaveChildren(node)) {
      const children = node.children;

      for (const child of children) {
        const newNode = findNode(child, processNode);
        if (newNode) {
          return newNode;
        }
      }
    }

    return null;
  }

  return null;
};
