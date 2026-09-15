// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './spinner.module.css';

export {
  spinnerStyles,
  getSpinnerClasses,
  spinnerClass,
  spinnerBoxClass,
  spinnerIconClass,
} from './spinner';
/** @typedef {import('./spinner').SpinnerVariants} SpinnerVariants */
/** @typedef {import('./spinner').SpinnerSize} SpinnerSize */
/** @typedef {import('./spinner').SpinnerColor} SpinnerColor */
