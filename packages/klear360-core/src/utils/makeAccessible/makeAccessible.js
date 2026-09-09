import { logger } from '~utils/logger';
import { accessibilityMap } from './accessibilityMap';

/**
 * @param {Partial<import('./types').AccessibilityProps>} props
 * @returns {Record<string, unknown>}
 */
export const makeAccessible = (props) => {
  /** @type {Record<string, any>} */
  const newProps = {};

  // eslint-disable-next-line guard-for-in
  for (const key in props) {
    const propKey = /** @type {keyof import('./types').AccessibilityMap} */ (key);
    const propValue = props[propKey];
    const accessibilityAttribute = accessibilityMap[propKey];

    if (accessibilityAttribute) {
      newProps[accessibilityAttribute] = propValue;
    } else if (__DEV__) {
      logger({
        message: `No mapping found for ${propKey}. Make sure you have entered valid key`,
        moduleName: 'makeAccessible',
        type: 'warn',
      });
    }
  }

  return newProps;
};
