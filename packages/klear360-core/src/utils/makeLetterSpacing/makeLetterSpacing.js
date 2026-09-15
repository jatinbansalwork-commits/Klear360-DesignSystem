/**
 * @param {number} letterSpacing
 * @param {number} fontSize
 * @returns {`${number}px`}
 */
export const makeLetterSpacing = (letterSpacing, fontSize) => {
  // Calculating a px letter-spacing from % letter spacing
  return `${fontSize * (letterSpacing / 100)}px`;
};
