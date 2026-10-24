/* eslint-disable react/display-name */
import React from 'react';
import styles from './BottomSheet.module.scss';
import { useBottomSheetContext } from './BottomSheetContext';
import { metaAttribute } from '~utils/metaAttribute';

const BottomSheetBackdrop = ({ zIndex }: { zIndex: number }): React.ReactElement => {
  const { close, isOpen, isDismissible } = useBottomSheetContext();

  return (
    <div
      {...metaAttribute({ testID: 'bottomsheet-backdrop' })}
      className={styles.backdrop}
      data-state={isOpen ? 'open' : 'closed'}
      style={{ zIndex }}
      onClick={() => {
        if (isDismissible) {
          close?.();
        }
      }}
      role="presentation"
    />
  );
};

export { BottomSheetBackdrop };
