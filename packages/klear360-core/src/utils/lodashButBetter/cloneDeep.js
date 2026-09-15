/**
 * @template T
 * @param {T} source
 * @returns {T}
 */
function cloneDeep(source) {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(source)) {
    /** @type {any[]} */
    const newArray = [];
    for (const item of source) {
      newArray.push(cloneDeep(item));
    }
    return /** @type {T} */ (newArray);
  }

  if (typeof source === 'object') {
    /** @type {Record<string, any>} */
    const newObject = {};
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        newObject[key] = cloneDeep(source[key]);
      }
    }
    return /** @type {T} */ (newObject);
  }

  return source;
}

export default cloneDeep;
