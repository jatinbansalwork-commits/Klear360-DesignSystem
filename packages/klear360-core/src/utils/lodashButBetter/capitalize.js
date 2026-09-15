/**
 * @template {string} T
 * @param {T} str
 * @returns {string}
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { capitalize };
