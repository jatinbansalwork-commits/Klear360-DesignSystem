/**
 * @template {Record<string, any>} T
 * @param {T} obj
 * @returns {Array<keyof T>}
 */
function keys(obj) {
  return /** @type {Array<keyof T>} */ (Object.keys(obj));
}

export default keys;
