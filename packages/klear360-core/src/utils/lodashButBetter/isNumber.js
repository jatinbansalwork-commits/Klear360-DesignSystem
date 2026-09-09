/**
 * @param {any} value
 * @returns {value is number}
 */
function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

export default isNumber;
