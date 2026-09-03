import klear360Theme from './klear360Theme';
import type { ThemeTokens } from './theme';
import merge from '~utils/lodashButBetter/merge';
import cloneDeep from '~utils/lodashButBetter/cloneDeep';
import { hasSameObjectStructure } from '~utils/hasSameObjectStructure';
import type { ObjectWithKeys } from '~utils/hasSameObjectStructure';
import { isPartialMatchObjectKeys } from '~utils/isPartialMatchObjectKeys';
import type { DeepPartial } from '~utils/isPartialMatchObjectKeys';
import { throwKlear360Error } from '~utils/logger';

type OverrideTheme = {
  /**
   * base tokens
   */
  baseThemeTokens: ThemeTokens;
  /**
   * partial theme tokens
   */
  overrides: DeepPartial<ThemeTokens>;
};

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
 */
const overrideTheme = ({ baseThemeTokens, overrides }: OverrideTheme): ThemeTokens => {
  if (__DEV__) {
    if (
      !hasSameObjectStructure(
        (baseThemeTokens as unknown) as ObjectWithKeys,
        (klear360Theme as unknown) as ObjectWithKeys,
      )
    ) {
      throwKlear360Error({
        message: 'The base theme provided is not a valid Klear360 theme',
        moduleName: 'overrideTheme',
      });
    }

    if (
      !isPartialMatchObjectKeys<ThemeTokens>({
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
  return merge(cloneDeep(baseThemeTokens), overrides) as ThemeTokens;
};

export default overrideTheme;
