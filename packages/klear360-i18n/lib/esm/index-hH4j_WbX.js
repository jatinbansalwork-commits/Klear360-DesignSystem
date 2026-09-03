// Custom Error class to extend properties to error object
class KlearI18nError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Klear i18n Error';
    this.timestamp = new Date();
    // more params like type of error/severity can be added in future for better debugging.
  }
}
/**
 * withErrorBoundary is a higher order function that takes function as parameter and wraps it in try/catch block.
 * It appends additional attributes and serves as a centralized error-handling service.
 * Usage =>
 * const wrappedUtilityFn = withErrorBoundary(utilityFn)
 *
 * @param fn utility that is wrapped in error boundary
 * @returns {Function} returns the function wrapped in try/catch block
 */
const withErrorBoundary = (fn) => {
  return function (...rest) {
    try {
      return fn.call(this, ...rest);
    } catch (err) {
      console.error('[Klear i18n Error]: ', err);
      // Currently, we are throwing the error as it is to consumers.
      // In the future, this can be modified as per our requirement, like an error logging service.
      throw new KlearI18nError(err);
    }
  };
};

export { withErrorBoundary as w };
//# sourceMappingURL=index-hH4j_WbX.js.map
