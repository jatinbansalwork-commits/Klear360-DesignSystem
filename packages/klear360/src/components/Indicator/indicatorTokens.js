import { size as sizeToken } from '~tokens/global';

/** @type {{ small: 'small', medium: 'medium', large: 'medium' }} */
const textSizeMapping = {
  small: 'small',
  large: 'medium',
  medium: 'medium',
};

const indicatorDotSizes = {
  subtle: {
    small: {
      outer: 0,
      inner: sizeToken[6],
    },
    medium: {
      outer: 0,
      inner: sizeToken[8],
    },
    large: {
      outer: 0,
      inner: sizeToken[10],
    },
  },
  intense: {
    small: {
      outer: sizeToken[16],
      inner: sizeToken[8],
    },
    medium: {
      outer: sizeToken[20],
      inner: sizeToken[10],
    },
    large: {
      outer: sizeToken[24],
      inner: sizeToken[12],
    },
  },
};

export { indicatorDotSizes, textSizeMapping };
