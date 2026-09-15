/**
 * @param {number} number
 * @param {number} lower
 * @param {number} upper
 * @returns {number}
 */
function clamp(number, lower, upper) {
  return Math.min(Math.max(number, lower), upper);
}

export default clamp;
