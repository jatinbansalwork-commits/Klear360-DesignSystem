import { MetaConstants } from './metaConstants';

/**
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.testID]
 * @returns {{'data-klear360-component'?: string, 'data-testid'?: string}}
 */
const metaAttribute = ({ name, testID }) => {
  return {
    ...(name ? { [`data-${MetaConstants.Component}`]: name } : {}),
    ...(testID ? { [`data-testid`]: testID } : {}),
  };
};

export { metaAttribute };
