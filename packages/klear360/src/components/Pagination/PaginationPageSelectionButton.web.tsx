import React from 'react';
import styles from './Pagination.module.scss';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

type PaginationPageSelectionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected?: boolean;
  isDisabled?: boolean;
};

const PaginationPageSelectionButton = React.forwardRef<
  HTMLButtonElement,
  PaginationPageSelectionButtonProps
>(({ isSelected, isDisabled, className, children, ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    {...rest}
    {...metaAttribute({ name: MetaConstants.TablePageSelectionButton })}
    disabled={isDisabled}
    data-selected={isSelected ? true : undefined}
    data-disabled={isDisabled ? true : undefined}
    className={[styles.pageSelectionButton, className].filter(Boolean).join(' ')}
  >
    {children}
  </button>
));

PaginationPageSelectionButton.displayName = 'PaginationPageSelectionButton';

export { PaginationPageSelectionButton };
