import { kebabCase } from '../lodashButBetter/kebabCase';

/**
 * Convert dot notation token to CSS variable name
 * Example: 'surface.text.gray.normal' -> '--surface-text-gray-normal'
 * Handles dot notation by replacing dots with hyphens, then applies kebabCase for any camelCase
 *
 * @param {string} token - Dot notation token (e.g., 'surface.text.gray.normal')
 * @returns {string} CSS variable name (e.g., '--surface-text-gray-normal')
 */
export function tokenToCSSVariable(token) {
  // First replace dots with hyphens, then apply kebabCase for any remaining camelCase
  const withHyphens = token.replace(/\./g, '-');
  return `--${kebabCase(withHyphens)}`;
}

/**
 * Get CSS variable value reference from a dot notation token
 * Example: 'surface.text.gray.normal' -> 'var(--surface-text-gray-normal)'
 *
 * @param {string} token - Dot notation token (e.g., 'surface.text.gray.normal')
 * @returns {string} CSS variable reference (e.g., 'var(--surface-text-gray-normal)')
 */
export function getTokenCSSVariable(token) {
  return `var(${tokenToCSSVariable(token)})`;
}
