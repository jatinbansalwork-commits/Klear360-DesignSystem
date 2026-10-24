// Selector* components are used in Checkbox/Radio
import React from 'react';
import styles from './Selector.module.scss';
import type { SelectorLabelProps } from './types';
import { metaAttribute } from '~utils/metaAttribute';

const SelectorLabel = ({
  children,
  componentName,
  testID,
  onMouseDown,
  onMouseUp,
  onMouseOut,
  onKeyDown,
  onKeyUp,
  onTouchStart,
  onTouchEnd,
  style,
}: SelectorLabelProps): React.ReactElement => {
  return (
    <label
      className={styles.label}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      style={style}
      {...metaAttribute({ name: componentName, testID })}
    >
      {children}
    </label>
  );
};

export { SelectorLabel };
