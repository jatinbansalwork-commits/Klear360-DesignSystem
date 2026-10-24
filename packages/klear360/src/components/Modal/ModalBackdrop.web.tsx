/* eslint-disable react/display-name */
import React from 'react';
import { FloatingOverlay } from '@floating-ui/react';
import { useModalContext } from './ModalContext';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import styles from './Modal.module.scss';

const ModalBackdrop = (): React.ReactElement => {
  const { close, isDismissible, isVisible } = useModalContext();

  return (
    <FloatingOverlay
      {...metaAttribute({ name: MetaConstants.ModalBackdrop, testID: MetaConstants.ModalBackdrop })}
      className={styles.backdrop}
      data-state={isVisible ? 'open' : 'closed'}
      onClick={() => {
        if (isDismissible) {
          close?.();
        }
      }}
      lockScroll={true}
    />
  );
};

export { ModalBackdrop };
