import isPropValid from '@emotion/is-prop-valid';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';

const shouldForwardDomProp = (prop: string): boolean => {
  return omitPropsFromHTML(prop as never, isPropValid as never);
};

const filterForwardableDomProps = <T extends Record<string, unknown>>(props: T): Partial<T> => {
  const forwardable: Partial<T> = {};
  for (const key of Object.keys(props)) {
    if (shouldForwardDomProp(key)) {
      forwardable[key as keyof T] = props[key as keyof T];
    }
  }
  return forwardable;
};

export { filterForwardableDomProps, shouldForwardDomProp };
