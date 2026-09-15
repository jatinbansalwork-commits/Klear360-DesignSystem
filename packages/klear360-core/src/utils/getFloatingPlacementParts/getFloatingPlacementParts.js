/**
 * Splits a Floating UI placement string into its `[side, alignment]` parts.
 *
 * @example
 * getFloatingPlacementParts('top-start') // ['top', 'start']
 * getFloatingPlacementParts('bottom')    // ['bottom', undefined]
 */

/**
 * @typedef {'top' | 'right' | 'bottom' | 'left'} FloatingSide
 */

/**
 * @typedef {'start' | 'end'} FloatingAlignment
 */

/**
 * @typedef {FloatingSide | `${FloatingSide}-${FloatingAlignment}`} FloatingPlacement
 */

/**
 * @param {FloatingPlacement} placement
 * @returns {readonly [FloatingSide, FloatingAlignment | undefined]}
 */
const getFloatingPlacementParts = (placement) => {
  const [
    side,
    alignment,
  ] = /** @type {[FloatingSide, FloatingAlignment | undefined]} */ (placement.split('-'));
  return /** @type {const} */ ([side, alignment]);
};

export { getFloatingPlacementParts };
