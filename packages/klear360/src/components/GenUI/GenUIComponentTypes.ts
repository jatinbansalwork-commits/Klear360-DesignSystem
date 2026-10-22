import type { GenUIAction, GenUIBaseComponent } from './types';

/**
 * Built-in component types supported by GenUI
 */
const ComponentType = {
  TEXT: 'TEXT',
  CHART: 'CHART',
  TABLE: 'TABLE',
  CARD: 'CARD',
  BADGE: 'BADGE',
  SPACER: 'SPACER',
  DIVIDER: 'DIVIDER',
  STACK: 'STACK',
  GRID: 'GRID',
  INFO_GROUP: 'INFO_GROUP',
  BUTTON: 'BUTTON',
  LINK: 'LINK',
  ALERT: 'ALERT',
  AMOUNT: 'AMOUNT',
} as const;

/**
 * Valid feedback colors used across GenUI components (Badge, Indicator, Alert)
 * Used to validate streaming JSON where color values might be partial/incomplete
 */
const FeedbackColors = [
  'information',
  'negative',
  'neutral',
  'notice',
  'positive',
  'primary',
] as const;
type FeedbackColor = typeof FeedbackColors[number];

const getValidFeedbackColor = (
  color: string | undefined,
  fallback: FeedbackColor = 'neutral',
): FeedbackColor => {
  if (!color) return fallback;
  if (FeedbackColors.includes(color as FeedbackColor)) {
    return color as FeedbackColor;
  }
  return fallback;
};

type TextComponent = GenUIBaseComponent & {
  component: typeof ComponentType.TEXT;
  content?: string;
};

type ChartComponent = GenUIBaseComponent & {
  component: typeof ComponentType.CHART;
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  variant?: 'full' | 'tiny';
  title?: string;
  xAxis?: string;
  data?: Array<Record<string, string | number>>;
  unit?: string;
  valueFormatter?: {
    type: 'currency' | 'percentage' | 'number' | 'string';
    currency?: string;
    suffix?: string;
  };
};

// Table cell component types (using component pattern)
type TableCellText = {
  component: 'TEXT';
  value: string;
  copyable?: boolean;
};

type TableCellAmount = {
  component: 'AMOUNT';
  value: number;
  currency?: string;
};

type TableCellIndicator = {
  component: 'INDICATOR';
  value: string;
  color: 'positive' | 'negative' | 'notice' | 'neutral' | 'primary' | 'information';
};

type TableCellBadge = {
  component: 'BADGE';
  value: string;
  color: 'positive' | 'negative' | 'notice' | 'neutral' | 'primary' | 'information';
};

type TableCellDate = {
  component: 'DATE';
  value: string;
  dateFormat?: string;
};

type TableCellLink = {
  component: 'LINK';
  text: string;
  copyable?: boolean;
  action?: {
    type: 'CLICK';
    eventName?: 'link_click';
    data?: {
      url?: string;
    };
  };
};

type TableCellType =
  | TableCellText
  | TableCellAmount
  | TableCellIndicator
  | TableCellBadge
  | TableCellDate
  | TableCellLink;

// Table row action schema type
type TableRowActionSchema = {
  type: 'TABLE_ROW_ACTION';
  eventName: string;
};

type TableRowActionButton = {
  type: 'BUTTON';
  text: string;
  action: TableRowActionSchema;
};

type TableRowActionIconButton = {
  type: 'ICON_BUTTON';
  icon: 'check' | 'close' | 'edit' | 'delete' | 'download' | 'view' | 'copy';
  accessibilityLabel: string;
  action: TableRowActionSchema;
};

type TableRowAction = TableRowActionButton | TableRowActionIconButton;

// Event payload dispatched when table row actions are triggered
type TableRowActionEvent = {
  type: 'TABLE_ROW_ACTION';
  eventName: string;
  data: {
    rowIndex: number;
    rowData: TableCellType[];
  };
};

type TableComponent = GenUIBaseComponent & {
  component: typeof ComponentType.TABLE;
  headers?: string[];
  rows?: TableCellType[][];
  rowActions?: TableRowAction[];
};

type BadgeComponent = GenUIBaseComponent & {
  component: typeof ComponentType.BADGE;
  text?: string;
  color?: 'neutral' | 'negative' | 'notice' | 'positive' | 'primary' | 'information';
};

type SpacerComponent = GenUIBaseComponent & {
  component: typeof ComponentType.SPACER;
  size?: 'small' | 'medium' | 'large';
};

type DividerComponent = GenUIBaseComponent & {
  component: typeof ComponentType.DIVIDER;
  orientation?: 'horizontal' | 'vertical';
};

type StackComponent = GenUIBaseComponent & {
  component: typeof ComponentType.STACK;
  direction?: 'vertical' | 'horizontal';
  gap?: 'small' | 'medium' | 'large';
  children?: GenUIComponent[];
};

type GridComponent = GenUIBaseComponent & {
  component: typeof ComponentType.GRID;
  columns?: number;
  gap?: 'small' | 'medium' | 'large';
  children?: GenUIComponent[];
};

type CardComponent = GenUIBaseComponent & {
  component: typeof ComponentType.CARD;
  title?: string;
  description?: string;
  footer?: string | null;
  children?: GenUIComponent[];
};

type InfoGroupItemValue = {
  helpText?: string;
  children: string | GenUIComponent;
};

type InfoGroupComponent = GenUIBaseComponent & {
  component: typeof ComponentType.INFO_GROUP;
  items?: Array<{
    key?: {
      helpText?: string;
      children: string;
    };
    value?: InfoGroupItemValue;
  }>;
};

type ButtonComponent = GenUIBaseComponent & {
  component: typeof ComponentType.BUTTON;
  text?: string;
  action?: GenUIAction;
};

type LinkComponent = GenUIBaseComponent & {
  component: typeof ComponentType.LINK;
  text?: string;
  action?: {
    type: 'CLICK';
    eventName?: 'link_click';
    data?: {
      url?: string;
    };
  };
};

type AlertComponent = GenUIBaseComponent & {
  component: typeof ComponentType.ALERT;
  title?: string;
  description?: string;
  color?: 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
  actions?: {
    primary?: {
      text?: string;
      action?: GenUIAction;
    };
    secondary?: {
      text?: string;
      action?: GenUIAction;
    };
  };
};

type AmountComponent = GenUIBaseComponent & {
  component: typeof ComponentType.AMOUNT;
  value?: number;
  currency?: string;
};

/**
 * Union type of all built-in UI components
 */
type GenUIBuiltInUIComponent =
  | TextComponent
  | ChartComponent
  | TableComponent
  | BadgeComponent
  | SpacerComponent
  | DividerComponent
  | StackComponent
  | GridComponent
  | CardComponent
  | InfoGroupComponent
  | ButtonComponent
  | LinkComponent
  | AlertComponent
  | AmountComponent;

/**
 * Generic UI component type - can be extended with custom components
 */
type GenUIComponent = GenUIBuiltInUIComponent | GenUIBaseComponent;

export { ComponentType, FeedbackColors, getValidFeedbackColor };
export type {
  FeedbackColor,
  TextComponent,
  ChartComponent,
  TableCellText,
  TableCellAmount,
  TableCellIndicator,
  TableCellBadge,
  TableCellDate,
  TableCellLink,
  TableCellType,
  TableRowActionSchema,
  TableRowActionButton,
  TableRowActionIconButton,
  TableRowAction,
  TableRowActionEvent,
  TableComponent,
  BadgeComponent,
  SpacerComponent,
  DividerComponent,
  StackComponent,
  GridComponent,
  CardComponent,
  InfoGroupItemValue,
  InfoGroupComponent,
  ButtonComponent,
  LinkComponent,
  AlertComponent,
  AmountComponent,
  GenUIBuiltInUIComponent,
  GenUIComponent,
};
