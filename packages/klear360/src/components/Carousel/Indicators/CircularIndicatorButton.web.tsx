import React from 'react';
import type { IndicatorButtonProps } from './types';
import { CAROUSEL_AUTOPLAY_INTERVAL } from '../constants';
import { metaAttribute } from '~utils/metaAttribute';
import { useTheme } from '~components/Klear360Provider';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { ScopedRuntimeStyles, useStableScopeClass } from '~utils/web/scopedCssFromObject';
import styles from './CircularIndicatorButton.module.scss';

const DOT_RADIUS = 3;
const RING_GAP = 1;
const RING_STROKE_WIDTH = 2;
const RING_RADIUS = DOT_RADIUS + RING_GAP + RING_STROKE_WIDTH / 2;
const SVG_SIZE = (RING_RADIUS + RING_STROKE_WIDTH / 2) * 2;
const CENTER = SVG_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type CircularIndicatorButtonProps = IndicatorButtonProps & {
  isAutoPlaying?: boolean;
};

const CircularIndicatorButton = ({
  onClick,
  isActive,
  variant,
  isAutoPlaying,
  slideIndex: _slideIndex,
  ...rest
}: CircularIndicatorButtonProps): React.ReactElement => {
  const { theme } = useTheme();
  const focusScope = useStableScopeClass('carousel-ind');
  const focusStyles = React.useMemo(
    () => ({
      '&:focus-visible': {
        ...getFocusRingStyles({ theme }),
        borderRadius: theme.border.radius.max,
      },
    }),
    [theme],
  );

  const activeColor = {
    gray: theme.colors.interactive.icon.gray.muted,
    white: theme.colors.interactive.icon.staticWhite.normal,
    blue: theme.colors.interactive.icon.primary.subtle,
  };

  const inactiveColor = theme.colors.overlay.background.moderate;
  const fillColor = isActive ? activeColor[variant] : inactiveColor;
  const showProgressRing = isActive && isAutoPlaying;

  const cssVars = {
    '--carousel-indicator-svg-size': `${SVG_SIZE}px`,
    '--carousel-ring-circumference': CIRCUMFERENCE,
    '--carousel-autoplay-interval': `${CAROUSEL_AUTOPLAY_INTERVAL}ms`,
  } as React.CSSProperties;

  return (
    <>
      <ScopedRuntimeStyles scopeClass={focusScope} styleObject={focusStyles} />
      <button
        type="button"
        className={[styles.button, focusScope].join(' ')}
        style={cssVars}
        onClick={onClick}
        {...rest}
        {...metaAttribute({ name: 'carousel-indicator-button' })}
      >
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          style={{ display: 'block' }}
        >
          <circle cx={CENTER} cy={CENTER} r={DOT_RADIUS} fill={fillColor} stroke="none" />
          {isActive && (
            <circle
              className={[styles.progressRing, showProgressRing ? styles.animate : undefined]
                .filter(Boolean)
                .join(' ')}
              style={cssVars}
              cx={CENTER}
              cy={CENTER}
              r={RING_RADIUS}
              fill="none"
              stroke={showProgressRing ? activeColor[variant] : 'transparent'}
              strokeWidth={RING_STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          )}
        </svg>
      </button>
    </>
  );
};

export { CircularIndicatorButton };
export type { CircularIndicatorButtonProps };
