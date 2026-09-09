/**
 * @param {number} size
 * @returns {`${number}rem`}
 */
export const makeTypographySize = (size) => {
  const remValue = size / 16;
  return `${remValue}rem`;
};
