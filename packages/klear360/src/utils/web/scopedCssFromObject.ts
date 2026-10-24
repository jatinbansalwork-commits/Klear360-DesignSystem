import React from 'react';

const camelToKebab = (property: string): string =>
  property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const resolveSelector = (parentSelector: string, key: string): string => {
  if (key.includes('&')) {
    return key.replace(/&/g, parentSelector);
  }
  return `${parentSelector} ${key}`;
};

const objectToCssText = (selector: string, obj: Record<string, unknown>): string => {
  const nestedRules: string[] = [];
  const declarations: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      if (key.startsWith('@media') || key.startsWith('@supports')) {
        nestedRules.push(
          `${key}{${objectToCssText(selector, value as Record<string, unknown>)}}`,
        );
      } else {
        nestedRules.push(objectToCssText(resolveSelector(selector, key), value as Record<string, unknown>));
      }
    } else if (value !== undefined) {
      declarations.push(`${camelToKebab(key)}:${String(value)};`);
    }
  }

  const block = declarations.length > 0 ? `${selector}{${declarations.join('')}}` : '';
  return [...nestedRules, block].filter(Boolean).join('');
};

const scopedCssFromObject = (scopeClass: string, styleObject: Record<string, unknown>): string => {
  return objectToCssText(`.${scopeClass}`, styleObject);
};

type ScopedRuntimeStylesProps = {
  scopeClass: string;
  styleObject: Record<string, unknown>;
};

/** Injects nested CSS (styled-components-shaped objects) scoped under `.scopeClass`. */
const ScopedRuntimeStyles = ({ scopeClass, styleObject }: ScopedRuntimeStylesProps): React.ReactElement | null => {
  const cssText = React.useMemo(
    () => scopedCssFromObject(scopeClass, styleObject),
    [scopeClass, styleObject],
  );

  if (!cssText) {
    return null;
  }

  return React.createElement('style', { 'data-klear360-scoped': scopeClass }, cssText);
};

const useStableScopeClass = (prefix = 'k360'): string => {
  const reactId = React.useId();
  return `${prefix}-${reactId.replace(/:/g, '')}`;
};

export { scopedCssFromObject, ScopedRuntimeStyles, useStableScopeClass };
