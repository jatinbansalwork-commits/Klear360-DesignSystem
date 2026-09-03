export interface BaseNode {
  layerName: string;
  id: string;
  type: SceneNode['type'];
  parent: Klear360Node | null;
}

type Klear360ComponentProperties = {
  [key: string]: { type: ComponentPropertyType; value: string | boolean } | undefined;
};

export interface Klear360ComponentInstanceNode extends BaseNode {
  componentProperties: Klear360ComponentProperties;
  type: InstanceNode['type'];
  children: Klear360Node[];
  name: string | null;
  fills: InstanceNode['fills'];
  fillStyleId: InstanceNode['fillStyleId'];
  width: InstanceNode['width'];
  height: InstanceNode['height'];
}

export type Klear360Node =
  | Klear360ComponentInstanceNode
  | Klear360FrameNode
  | Klear360TextNode
  | Klear360GroupNode
  | Klear360VectorNode
  | Klear360RectangleNode
  | BaseNode;

export interface Klear360FrameNode extends BaseNode {
  type: FrameNode['type'];
  children: Klear360Node[];
  layoutMode: FrameNode['layoutMode'];
  primaryAxisAlignItems: FrameNode['primaryAxisAlignItems'];
  primaryAxisSizingMode: FrameNode['primaryAxisSizingMode'];
  counterAxisAlignItems: FrameNode['counterAxisAlignItems'];
  counterAxisSizingMode: FrameNode['counterAxisSizingMode'];
  paddingLeft: FrameNode['paddingLeft'];
  paddingRight: FrameNode['paddingRight'];
  paddingBottom: FrameNode['paddingBottom'];
  paddingTop: FrameNode['paddingTop'];
  itemSpacing: FrameNode['itemSpacing'];
  width: FrameNode['width'];
  height: FrameNode['height'];
  fills: FrameNode['fills'];
  fillStyleId: FrameNode['fillStyleId'];
  layoutSizingVertical: FrameNode['layoutSizingVertical'];
  layoutSizingHorizontal: FrameNode['layoutSizingHorizontal'];
  inferredAutoLayout: FrameNode['inferredAutoLayout'];
  maxWidth: FrameNode['maxWidth'];
  maxHeight: FrameNode['maxHeight'];
}

export interface Klear360TextNode extends BaseNode {
  characters: TextNode['characters'];
  type: TextNode['type'];
  textStyleId: TextNode['textStyleId'];
}

export interface Klear360GroupNode extends BaseNode {
  type: 'GROUP';
  children: Klear360Node[];
  rotation: GroupNode['rotation'];
  layoutAlign: GroupNode['layoutAlign'];
  layoutGrow: GroupNode['layoutGrow'];
  layoutPositioning: GroupNode['layoutPositioning'];
}

export interface Klear360VectorNode extends BaseNode {
  type: VectorNode['type'];
  fillStyleId: VectorNode['fillStyleId'];
  fills: VectorNode['fills'];
}

export interface Klear360RectangleNode extends BaseNode {
  type: RectangleNode['type'];
}

type JSXType = 'string' | 'boolean' | 'number' | 'instance';

export type JSXValue = {
  type: JSXType;
  value: string;
  isCommented?: boolean;
  comment?: string;
};

export type Klear360Props = Record<string, JSXValue>;

export type Klear360HelperProps = Record<string, JSXType>;
