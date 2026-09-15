/**
 * @param {any} value
 * @returns {value is undefined}
 */
export default function isUndefined(value) {
  return typeof value === 'undefined';
}
