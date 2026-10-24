import React from 'react';
import styles from './BottomSheet.module.scss';

type BottomSheetGrabHandleProps = React.HTMLAttributes<HTMLDivElement> & {
  isHeaderFloating?: boolean;
};

const BottomSheetGrabHandle = React.forwardRef<HTMLDivElement, BottomSheetGrabHandleProps>(
  ({ isHeaderFloating, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={[
        styles.grabHandle,
        isHeaderFloating ? styles.grabHandleFloating : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  ),
);

BottomSheetGrabHandle.displayName = 'BottomSheetGrabHandle';

export { BottomSheetGrabHandle };
