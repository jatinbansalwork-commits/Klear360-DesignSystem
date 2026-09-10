// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './baseLink.module.css';

export {
  baseLinkStyles,
  getBaseLinkClasses,
  getBaseLinkContentClasses,
  getBaseLinkTemplateClasses,
  baseLinkContentClass,
  baseLinkIconClass,
  getLinkColorToken,
  getLinkTextSizes,
  getLinkIconSizeMap,
} from './baseLink';
/** @typedef {import('./baseLink').BaseLinkVariants} BaseLinkVariants */
/** @typedef {import('./baseLink').LinkColor} LinkColor */
/** @typedef {import('./baseLink').LinkVariant} LinkVariant */
/** @typedef {import('./baseLink').ActionStatesType} ActionStatesType */
/** @typedef {import('./baseLink').ColorType} ColorType */
