import { getPlatformType } from './getPlatformType';

/** @returns {boolean} */
const isReactNative = () => {
  return getPlatformType() === 'react-native';
};

export { isReactNative };
