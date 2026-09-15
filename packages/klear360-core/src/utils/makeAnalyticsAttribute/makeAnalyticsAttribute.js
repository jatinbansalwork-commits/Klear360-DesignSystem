/**
 * @param {Record<string, unknown>} props
 * @returns {import('~utils/types').DataAnalyticsAttribute}
 */
const makeAnalyticsAttribute = (props) => {
  return Object.entries(props)
    .filter(([key]) => key.startsWith('data-analytics'))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: /** @type {string} */ (value),
      }),
      /** @type {import('~utils/types').DataAnalyticsAttribute} */ ({}),
    );
};

export { makeAnalyticsAttribute };
