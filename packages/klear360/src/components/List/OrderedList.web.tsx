import React from 'react';
import { getOrderedListClass } from './getListModuleClasses';
import type { DotNotationSpacingStringToken } from '~utils/types';

type OrderedListWebProps = React.OlHTMLAttributes<HTMLOListElement> & {
  marginTop?: DotNotationSpacingStringToken;
};

const OrderedList = React.forwardRef<HTMLOListElement, OrderedListWebProps>(
  ({ className, marginTop: _marginTop, ...rest }, ref) => (
    <ol ref={ref} className={[getOrderedListClass(), className].filter(Boolean).join(' ')} {...rest} />
  ),
);

OrderedList.displayName = 'OrderedList';

export { OrderedList };
