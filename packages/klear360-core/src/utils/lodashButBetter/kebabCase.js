/**
 * @param {string} str
 * @returns {string}
 */
const kebabCase = (str) => {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    (match, index) => (index ? '-' : '') + match.toLowerCase(),
  );
};

export { kebabCase };
