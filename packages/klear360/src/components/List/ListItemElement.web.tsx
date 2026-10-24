import React from 'react';
import type { ListProps } from './List';
import { getListItemElementClass } from './getListModuleClasses';

type ListItemElementWebProps = React.LiHTMLAttributes<HTMLLIElement> & {
  level?: number;
  variant?: NonNullable<ListProps['variant']>;
  hasIcon?: boolean;
};

const ListItemElement = React.forwardRef<HTMLLIElement, ListItemElementWebProps>(
  ({ className, children, level: _level, variant: _variant, hasIcon: _hasIcon, ...rest }, ref) => (
    <li ref={ref} className={[getListItemElementClass(), className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </li>
  ),
);

ListItemElement.displayName = 'ListItemElement';

export { ListItemElement };
