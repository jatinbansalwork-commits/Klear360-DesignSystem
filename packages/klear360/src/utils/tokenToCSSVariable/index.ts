/**
 * Keep in sync with packages/klear360-core/src/utils/tokenToCSSVariable.
 * Duplicated here until @klear/klear360-core is a published peer at P3 cutover.
 */
import { kebabCase } from '~utils/lodashButBetter/kebabCase';

export function tokenToCSSVariable(token: string): string {
  const withHyphens = token.replace(/\./g, '-');
  return `--${kebabCase(withHyphens)}`;
}

export function getTokenCSSVariable(token: string): string {
  return `var(${tokenToCSSVariable(token)})`;
}
