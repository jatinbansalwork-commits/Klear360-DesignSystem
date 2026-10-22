import type { GenUIComponentRegistry, GenUIComponentRenderer } from './types';
import { ComponentType } from './GenUIComponentTypes';
import { genUISpacingContract, getGenUIComponentTopSpacing } from './GenUISpacing';
import { markdownComponents } from './markdown/MarkdownRenderers';
import { RenderTextComponent } from './renderers/RenderTextComponent';
import { RenderChartComponent } from './renderers/RenderChartComponent';
import { RenderTableComponent } from './renderers/RenderTableComponent';
import { RenderCardComponent } from './renderers/RenderCardComponent';
import { RenderBadgeComponent } from './renderers/RenderBadgeComponent';
import {
  RenderSpacerComponent,
  RenderDividerComponent,
} from './renderers/RenderSpacerDividerComponent';
import { RenderStackComponent } from './renderers/RenderStackComponent';
import { RenderGridComponent } from './renderers/RenderGridComponent';
import { RenderInfoGroupComponent } from './renderers/RenderInfoGroupComponent';
import { RenderButtonComponent } from './renderers/RenderButtonComponent';
import { RenderLinkComponent } from './renderers/RenderLinkComponent';
import { RenderAlertComponent } from './renderers/RenderAlertComponent';
import { RenderAmountComponent } from './renderers/RenderAmountComponent';

/**
 * Default registry of built-in components
 */
const createBuiltInRegistry = (): GenUIComponentRegistry => ({
  [ComponentType.TEXT]: {
    renderer: RenderTextComponent as GenUIComponentRenderer,
  },
  [ComponentType.CHART]: {
    renderer: RenderChartComponent as GenUIComponentRenderer,
  },
  [ComponentType.TABLE]: {
    renderer: RenderTableComponent as GenUIComponentRenderer,
  },
  [ComponentType.CARD]: {
    renderer: RenderCardComponent as GenUIComponentRenderer,
  },
  [ComponentType.BADGE]: {
    renderer: RenderBadgeComponent as GenUIComponentRenderer,
  },
  [ComponentType.SPACER]: {
    renderer: RenderSpacerComponent as GenUIComponentRenderer,
  },
  [ComponentType.DIVIDER]: {
    renderer: RenderDividerComponent as GenUIComponentRenderer,
  },
  [ComponentType.STACK]: {
    renderer: RenderStackComponent as GenUIComponentRenderer,
  },
  [ComponentType.GRID]: {
    renderer: RenderGridComponent as GenUIComponentRenderer,
  },
  [ComponentType.INFO_GROUP]: {
    renderer: RenderInfoGroupComponent as GenUIComponentRenderer,
  },
  [ComponentType.BUTTON]: {
    renderer: RenderButtonComponent as GenUIComponentRenderer,
  },
  [ComponentType.LINK]: {
    renderer: RenderLinkComponent as GenUIComponentRenderer,
  },
  [ComponentType.ALERT]: {
    renderer: RenderAlertComponent as GenUIComponentRenderer,
  },
  [ComponentType.AMOUNT]: {
    renderer: RenderAmountComponent as GenUIComponentRenderer,
  },
});

export {
  // Built-in registry creator (used by GenUIProvider)
  createBuiltInRegistry,
  // Markdown renderer overrides
  markdownComponents,
  // Spacing contract
  genUISpacingContract,
  getGenUIComponentTopSpacing,
  // Constants
  ComponentType,
};

export type { GenUIComponent, TableComponent } from './GenUIComponentTypes';
