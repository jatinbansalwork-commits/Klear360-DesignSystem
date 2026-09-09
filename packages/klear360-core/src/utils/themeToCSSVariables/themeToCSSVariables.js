import { tokenToCSSVariable } from '../tokenToCSSVariable';

/**
 * Resolved (mode-flattened) theme slice used to emit CSS custom properties.
 * Matches the runtime `Theme` shape consumed by Klear360Provider.
 * @typedef {Object} ThemeCSSVariableSource
 * @property {import('~tokens/theme').Colors} colors
 * @property {import('~tokens/global').Elevation} elevation
 * @property {import('~tokens/global').Border} border
 * @property {import('~tokens/global/typography').Typography} [typography]
 */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * CSS theme generator drops the redundant `on` prefix on leaf keys like
 * `onSubtle` / `onIntense` when nested under `onSea` / `onCloud`.
 * e.g. surface.text.onSea.onSubtle → --surface-text-on-sea-subtle
 * @param {string} segment
 * @param {string} [parentSegment]
 * @returns {string}
 */
const normalizePathSegment = (segment, parentSegment) => {
  if (
    parentSegment &&
    /^on[A-Z]/.test(parentSegment) &&
    (segment === 'onSubtle' || segment === 'onIntense')
  ) {
    return segment === 'onSubtle' ? 'subtle' : 'intense';
  }
  return segment;
};

/**
 * @param {unknown} value
 * @param {string[]} path
 * @param {Record<string, string>} result
 * @returns {void}
 */
const flattenTokenTree = (value, path, result) => {
  if (typeof value === 'string' || typeof value === 'number') {
    const cssVar = tokenToCSSVariable(path.join('.'));
    result[cssVar] = String(value);
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  const parentSegment = path[path.length - 1];
  for (const [key, child] of Object.entries(value)) {
    const normalizedKey = normalizePathSegment(key, parentSegment);
    flattenTokenTree(child, [...path, normalizedKey], result);
  }
};

/**
 * @param {number | string} value
 * @returns {string}
 */
const borderValueToCss = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  return `${value}px`;
};

/**
 * @param {'fontSize' | 'lineHeight' | 'fontWeight'} group
 * @param {number} value
 * @returns {string}
 */
const typographyValueToCss = (group, value) => {
  if (group === 'fontWeight') {
    return String(value);
  }
  return `${value}px`;
};

/**
 * Resolved platform typography → CSS vars matching `theme.css` (`--font-size-*`, etc.).
 * @param {import('~tokens/global/typography').Typography} typography
 * @returns {Record<string, string>}
 */
export const typographyToCSSVariables = (typography) => {
  /** @type {Record<string, string>} */
  const cssVariables = {};

  for (const [key, value] of Object.entries(typography.fonts.family)) {
    cssVariables[tokenToCSSVariable(`fontFamily.${key}`)] = value;
  }

  for (const [key, value] of Object.entries(typography.fonts.size)) {
    cssVariables[tokenToCSSVariable(`fontSize.${key}`)] = typographyValueToCss('fontSize', value);
  }

  for (const [key, value] of Object.entries(typography.fonts.weight)) {
    cssVariables[tokenToCSSVariable(`fontWeight.${key}`)] = typographyValueToCss(
      'fontWeight',
      value,
    );
  }

  for (const [key, value] of Object.entries(typography.lineHeights)) {
    cssVariables[tokenToCSSVariable(`lineHeight.${key}`)] = typographyValueToCss(
      'lineHeight',
      value,
    );
  }

  for (const [key, value] of Object.entries(typography.letterSpacings)) {
    cssVariables[tokenToCSSVariable(`letterSpacing.${key}`)] = `${value}%`;
  }

  return cssVariables;
};

/**
 * Colors slice → CSS vars. Same names `themeToCSSVariables` emits for colors, but on its own so
 * the `theme.css` generator can emit colors in the dark block without re-emitting global border/
 * typography (which belong once in `:root`).
 * @param {import('~tokens/theme').Colors} colors
 * @returns {Record<string, string>}
 */
export const colorsToCSSVariables = (colors) => {
  /** @type {Record<string, string>} */
  const cssVariables = {};
  flattenTokenTree(colors, [], cssVariables);
  return cssVariables;
};

/**
 * Elevation slice → CSS vars (`--elevation-*`). Split out for the same reason as
 * `colorsToCSSVariables`.
 * @param {import('~tokens/global').Elevation} elevation
 * @returns {Record<string, string>}
 */
export const elevationToCSSVariables = (elevation) => {
  /** @type {Record<string, string>} */
  const cssVariables = {};
  flattenTokenTree(elevation, ['elevation'], cssVariables);
  return cssVariables;
};

/**
 * Convert a resolved theme slice into CSS custom property declarations.
 * Keys match `@klear/klear360-core/tokens/theme.css` (e.g. `--surface-background-gray-subtle`).
 * @param {ThemeCSSVariableSource} theme
 * @returns {Record<string, string>}
 */
export const themeToCSSVariables = (theme) => {
  /** @type {Record<string, string>} */
  const cssVariables = {};

  flattenTokenTree(theme.colors, [], cssVariables);
  flattenTokenTree(theme.elevation, ['elevation'], cssVariables);

  for (const [key, value] of Object.entries(theme.border.radius)) {
    cssVariables[tokenToCSSVariable(`border.radius.${key}`)] = borderValueToCss(value);
  }

  for (const [key, value] of Object.entries(theme.border.width)) {
    cssVariables[tokenToCSSVariable(`border.width.${key}`)] = borderValueToCss(value);
  }

  if (theme.typography) {
    Object.assign(cssVariables, typographyToCSSVariables(theme.typography));
  }

  return cssVariables;
};

/**
 * Serialize CSS variable map to an inline style string for DOM `style` attributes.
 * @param {Record<string, string>} cssVariables
 * @returns {string}
 */
export const cssVariablesToInlineStyle = (cssVariables) => {
  return Object.entries(cssVariables)
    .map(([name, value]) => `${name}:${value}`)
    .join(';');
};
