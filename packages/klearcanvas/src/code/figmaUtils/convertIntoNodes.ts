import type {
  Klear360ComponentInstanceNode,
  Klear360FrameNode,
  Klear360GroupNode,
  Klear360Node,
  Klear360TextNode,
  Klear360VectorNode,
} from '../types/Klear360';

const convertBaseNode = (
  figmaNode: Readonly<SceneNode>,
  klear360Parent: Klear360Node | null,
): Klear360Node => {
  const klear360Node: Klear360Node = {
    id: figmaNode.id,
    layerName: figmaNode.name,
    type: figmaNode.type,
    parent: klear360Parent,
  };

  return klear360Node;
};

/**
 * Klear360 component structures aren't simple
 * In case of icons, name of the component can be found in the main component property
 * In case of other components, use the parent's name instead
 * @param figmaNode
 * @returns name of the component in figma
 */
const getComponentName = (figmaNode: Readonly<InstanceNode>): string | null => {
  return figmaNode.mainComponent?.parent?.name ?? figmaNode.mainComponent?.name ?? null;
};

const convertInstanceToNode = (
  figmaNode: Readonly<InstanceNode>,
  klear360Node: Klear360Node,
): Klear360ComponentInstanceNode => {
  const klear360ComponentInstance: Klear360ComponentInstanceNode = {
    ...klear360Node,
    componentProperties: figmaNode.componentProperties,
    type: 'INSTANCE',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKlear360Nodes(figmaNode.children, klear360Node),
    name: getComponentName(figmaNode),
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    width: figmaNode.width,
    height: figmaNode.height,
  };
  return klear360ComponentInstance;
};

const convertTextToNode = (
  figmaNode: Readonly<TextNode>,
  klear360Node: Klear360Node,
): Klear360TextNode => {
  const klear360TextNode: Klear360TextNode = {
    ...klear360Node,
    type: 'TEXT',
    characters: figmaNode.characters,
    textStyleId: figmaNode.textStyleId,
  };

  return klear360TextNode;
};

const convertFrameToNode = (
  figmaNode: Readonly<FrameNode>,
  klear360Node: Klear360Node,
): Klear360FrameNode => {
  const klear360Frame: Klear360FrameNode = {
    ...klear360Node,
    type: 'FRAME',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKlear360Nodes(figmaNode.children, klear360Node),
    counterAxisAlignItems: figmaNode.counterAxisAlignItems,
    counterAxisSizingMode: figmaNode.counterAxisSizingMode,
    primaryAxisAlignItems: figmaNode.primaryAxisAlignItems,
    primaryAxisSizingMode: figmaNode.primaryAxisSizingMode,
    paddingTop: figmaNode.paddingTop,
    paddingRight: figmaNode.paddingRight,
    paddingLeft: figmaNode.paddingLeft,
    paddingBottom: figmaNode.paddingBottom,
    layoutMode: figmaNode.layoutMode,
    itemSpacing: figmaNode.itemSpacing,
    height: figmaNode.height,
    width: figmaNode.width,
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    layoutSizingHorizontal: figmaNode.layoutSizingHorizontal,
    layoutSizingVertical: figmaNode.layoutSizingVertical,
    inferredAutoLayout: figmaNode.inferredAutoLayout,
    maxHeight: figmaNode.maxHeight,
    maxWidth: figmaNode.maxWidth,
  };
  return klear360Frame;
};

const convertGroupToNode = (
  figmaNode: Readonly<GroupNode>,
  klear360Node: Klear360Node,
): Klear360GroupNode => {
  const klear360GroupNode: Klear360GroupNode = {
    ...klear360Node,
    type: 'GROUP',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKlear360Nodes(figmaNode.children, klear360Node),
    rotation: figmaNode.rotation,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutPositioning: figmaNode.layoutPositioning,
  };
  return klear360GroupNode;
};

const convertVectorToNode = (
  figmaNode: Readonly<VectorNode>,
  klear360Node: Klear360Node,
): Klear360VectorNode => {
  const klear360VectorNode: Klear360VectorNode = {
    ...klear360Node,
    type: 'VECTOR',
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
  };
  return klear360VectorNode;
};

export const convertIntoKlear360Nodes = (
  figmaNodes: ReadonlyArray<SceneNode>,
  klear360Parent: Klear360Node | null,
): Array<Klear360Node> => {
  const klear360Nodes: Klear360Node[] = [];
  figmaNodes.forEach((figmaNode) => {
    if (!figmaNode.visible) {
      return;
    }

    let klear360Node = convertBaseNode(figmaNode, klear360Parent);

    switch (figmaNode.type) {
      case 'INSTANCE':
        klear360Node = convertInstanceToNode(figmaNode, klear360Node);
        break;
      case 'TEXT':
        klear360Node = convertTextToNode(figmaNode, klear360Node);
        break;
      case 'FRAME':
        klear360Node = convertFrameToNode(figmaNode, klear360Node);
        break;
      case 'GROUP':
        klear360Node = convertGroupToNode(figmaNode, klear360Node);
        break;
      case 'VECTOR':
        klear360Node = convertVectorToNode(figmaNode, klear360Node);
        break;
      default:
        break;
    }

    klear360Nodes.push(klear360Node);
  });

  return klear360Nodes;
};
