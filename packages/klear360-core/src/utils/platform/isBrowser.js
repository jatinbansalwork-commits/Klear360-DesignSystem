import { getPlatformType } from './getPlatformType';

/** @returns {boolean} */
const isBrowser = () => {
  return getPlatformType() === 'browser';
};

export { isBrowser };
