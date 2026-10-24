/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import usePresence from 'use-presence';
import styles from './RadioIconFade.module.scss';
import type { FadeProps } from './types';
import { useTheme } from '~components/Klear360Provider';

const Fade = ({ show, children, styles: inlineStyles }: FadeProps) => {
  const { theme } = useTheme();

  const duration = theme.motion.duration.xquick;

  const { isMounted, isVisible } = usePresence(!!show, {
    transitionDuration: duration,
    initialEnter: true,
  });

  return (
    <>
      {isMounted && (
        <div
          className={[styles.fadeRoot, isVisible ? styles.enter : styles.exit]
            .filter(Boolean)
            .join(' ')}
          style={inlineStyles}
        >
          {children}
        </div>
      )}
    </>
  );
};

export { Fade };
