/**
 * Keep in sync with packages/klear360-core/src/utils/themeToCSSVariables.
 * Duplicated here until @klear/klear360-core is a published peer at P3 cutover.
 */
import { tokenToCSSVariable } from '~utils/tokenToCSSVariable';
import type { Border, Elevation, Motion } from '~tokens/global';
import type { Typography } from '~tokens/global/typography';
import type { Colors as ThemeColors } from '~tokens/theme';

export type ThemeCSSVariableSource = {
  colors: ThemeColors;
  elevation: Elevation;
  border: Border;
  typography?: Typography;
  motion?: Motion;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizePathSegment = (segment: string, parentSegment?: string): string => {
  if (
    parentSegment &&
    /^on[A-Z]/.test(parentSegment) &&
    (segment === 'onSubtle' || segment === 'onIntense')
  ) {
    return segment === 'onSubtle' ? 'subtle' : 'intense';
  }
  return segment;
};

const flattenTokenTree = (value: unknown, path: string[], result: Record<string, string>): void => {
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

const borderValueToCss = (value: number | string): string => {
  if (typeof value === 'string') {
    return value;
  }
  return `${value}px`;
};

const typographyValueToCss = (
  group: 'fontSize' | 'lineHeight' | 'fontWeight',
  value: number,
): string => {
  if (group === 'fontWeight') {
    return String(value);
  }
  return `${value}px`;
};

const typographyToCSSVariables = (typography: Typography): Record<string, string> => {
  const cssVariables: Record<string, string> = {};

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

const motionToCSSVariables = (motion: Motion): Record<string, string> => {
  const cssVariables: Record<string, string> = {};

  for (const [key, value] of Object.entries(motion.duration)) {
    cssVariables[tokenToCSSVariable(`duration.${key}`)] = `${value}ms`;
  }

  for (const [key, value] of Object.entries(motion.delay)) {
    cssVariables[tokenToCSSVariable(`delay.${key}`)] = `${value}ms`;
  }

  for (const [key, value] of Object.entries(motion.easing)) {
    if (typeof value === 'string') {
      cssVariables[tokenToCSSVariable(`easing.${key}`)] = value;
    }
  }

  return cssVariables;
};

export const themeToCSSVariables = (theme: ThemeCSSVariableSource): Record<string, string> => {
  const cssVariables: Record<string, string> = {};

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

  if (theme.motion) {
    Object.assign(cssVariables, motionToCSSVariables(theme.motion));
  }

  return cssVariables;
};
