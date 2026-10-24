import React from 'react';
import styles from './CheckboxIconFade.module.scss';
import type { FadeProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const Fade = ({ show, children, styles: inlineStyles }: FadeProps) => {
  const animationClass =
    show === undefined ? null : show ? styles.enter : styles.exit;

  return (
    <div
      className={[styles.fadeRoot, animationClass].filter(Boolean).join(' ')}
      style={{
        opacity: show ? 1 : 0,
        ...inlineStyles,
      }}
      {...metaAttribute({ name: MetaConstants.CheckboxIconFade })}
    >
      {children}
    </div>
  );
};

export { Fade };
