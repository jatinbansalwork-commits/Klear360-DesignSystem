/**
 * @typedef {'browser' | 'node' | 'react-native' | 'unknown'} PlatformTypes
 */

/**
 * @returns {PlatformTypes}
 */
export const getPlatformType = () => {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }

  if (typeof document !== 'undefined') {
    return 'browser';
  }

  if (typeof process !== 'undefined') {
    return 'node';
  }

  return 'unknown';
};
