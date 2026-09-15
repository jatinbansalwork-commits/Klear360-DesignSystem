/**
 * @param {any} value
 * @returns {value is Record<string, any>}
 */
function isObject(value) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

export default isObject;
