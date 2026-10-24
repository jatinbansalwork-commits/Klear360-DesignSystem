import React from 'react';
import styles from './VisuallyHidden.module.scss';
import type { VisuallyHiddenProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

export const VisuallyHidden = ({ children, testID }: VisuallyHiddenProps): React.ReactElement => {
  return (
    <div
      className={styles.visuallyHidden}
      {...metaAttribute({ name: MetaConstants.VisuallyHidden, testID })}
    >
      {children}
    </div>
  );
};
