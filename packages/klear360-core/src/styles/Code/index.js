// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './code.module.css';

export { codeStyles, getCodeClasses, getCodeFontSizeAndLineHeight, getCodeColor } from './code';

/** @typedef {import('./code').CodeVariants} CodeVariants */
/** @typedef {import('./code').CodeSize} CodeSize */
/** @typedef {import('./code').FontSize} FontSize */
/** @typedef {import('./code').LineHeight} LineHeight */
