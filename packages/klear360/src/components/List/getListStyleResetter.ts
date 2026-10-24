import type { CSSObject } from '~utils/cssObject';

const getListStyleResetter = (): CSSObject => {
  return {
    listStyleType: 'none',
    padding: '0px',
    margin: '0px',
  };
};

export { getListStyleResetter };
