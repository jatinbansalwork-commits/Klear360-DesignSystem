// Import CSS module to ensure it's processed by the bundler
import './iconButton.module.css';

export {
  iconButtonStyles,
  getIconButtonClasses,
  getIconButtonTemplateClasses,
  highlightedButtonSizeMap,
} from './iconButton';
/** @typedef {import('./iconButton').IconButtonVariants} IconButtonVariants */
/** @typedef {import('./iconButton').IconButtonEmphasis} IconButtonEmphasis */
/** @typedef {import('./iconButton').IconButtonSize} IconButtonSize */
/** @typedef {import('./slots').IconButtonSlot} IconButtonSlot */
