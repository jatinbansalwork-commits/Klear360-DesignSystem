/**
 * Combines multiple style strings into a single style string
 * Filters out empty strings and joins with semicolons
 *
 * @param {...(string | undefined | null)} styles - Array of style strings to combine
 * @returns {string} Combined style string
 *
 * @example
 * ```ts
 * const combined = combineStyleStrings(
 *   'color: red',
 *   'margin: 10px',
 *   '' // empty strings are filtered out
 * );
 * // Returns: "color: red; margin: 10px"
 * ```
 */
export const combineStyleStrings = (...styles) => {
  return styles.filter(Boolean).join('; ');
};
