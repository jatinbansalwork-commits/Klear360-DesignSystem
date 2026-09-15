import merge from '~utils/lodashButBetter/merge';
import cloneDeep from '~utils/lodashButBetter/cloneDeep';
import { hasSameObjectStructure } from '~utils/hasSameObjectStructure';
import { isPartialMatchObjectKeys } from '~utils/isPartialMatchObjectKeys';
import { throwKlear360Error } from '~utils/logger';
import klear360Theme from './klear360Theme';

/**
 * @deprecated Use `createTheme` from `@klear/klear360/tokens` instead
 *
 * @description
 *
 * `overrideTheme` merges the `baseThemeTokens` and `overrides` and returns a new ThemeTokens object,
 * which you can pass into Klear360Provider.
 *
 * @example
 * ```tsx
 * const customTheme = overrideTheme({
 *   baseThemeTokens: klear360Theme, // theme to override
 *   overrides: {
 *     colors: {
 *       onLight: {
 *         brand: {
 *           primary: {
 *             '500': 'hsla(222, 100%, 96%, 1)',
 *           },
 *         },
 *       },
 *     },
 *   },
 * });
 *
 * <Klear360Provider themeTokens={customTheme} />
 * ```
 * @param {Object} params
 * @param {import('./theme').ThemeTokens} params.baseThemeTokens base tokens
 * @param {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens>} params.overrides partial theme tokens
 * @returns {import('./theme').ThemeTokens}
 */
const overrideTheme = ({ baseThemeTokens, overrides }) => {
  if (__DEV__) {
    if (
      !hasSameObjectStructure(
        /** @type {import('~utils/hasSameObjectStructure').ObjectWithKeys} */ (
          /** @type {unknown} */ (baseThemeTokens)
        ),
        /** @type {import('~utils/hasSameObjectStructure').ObjectWithKeys} */ (
          /** @type {unknown} */ (klear360Theme)
        ),
      )
    ) {
      throwKlear360Error({
        message: 'The base theme provided is not a valid Klear360 theme',
        moduleName: 'overrideTheme',
      });
    }

    if (
      !isPartialMatchObjectKeys({
        objectToMatch: overrides,
        objectToInspect: baseThemeTokens,
      })
    ) {
      throwKlear360Error({
        message: 'The overrides object is not valid',
        moduleName: 'overrideTheme',
      });
    }
  }

  // Need to clone before merging since merge changes/mutates the actual object
  return /** @type {import('./theme').ThemeTokens} */ (merge(
    cloneDeep(baseThemeTokens),
    overrides,
  ));
};

export default overrideTheme;
