import React from 'react';
import { getUnorderedListClass } from './getListModuleClasses';
import type { DotNotationSpacingStringToken } from '~utils/types';

type UnorderedListWebProps = React.HTMLAttributes<HTMLUListElement> & {
  marginTop?: DotNotationSpacingStringToken;
};

const UnorderedList = React.forwardRef<HTMLUListElement, UnorderedListWebProps>(
  ({ className, marginTop: _marginTop, ...rest }, ref) => (
    <ul ref={ref} className={[getUnorderedListClass(), className].filter(Boolean).join(' ')} {...rest} />
  ),
);

UnorderedList.displayName = 'UnorderedList';

export { UnorderedList };
