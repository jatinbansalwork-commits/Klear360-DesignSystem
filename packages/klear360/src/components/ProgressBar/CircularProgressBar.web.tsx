import React from 'react';
import type { CircularProgressBarFilledProps } from './types';
import {
  circularProgressSizeTokens,
  getCircularProgressSVGTokens,
} from './progressBarTokens';
import { CircularProgressLabel } from './CircularProgressLabel';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';
import { getTextProps } from '~components/Typography';
import { Svg, Circle } from '~components/Icons/_Svg';
import getBaseTextStyles from '~components/Typography/BaseText/getBaseTextStyles';
import { useTheme } from '~components/Klear360Provider';
import styles from './CircularProgressBar.module.scss';

const CircularProgressBarFilled = ({
  progressPercent,
  fillColor,
  backgroundColor,
  size = 'small',
  label,
  showPercentage = true,
  isMeter,
  pulseMotionDuration,
  motionEasing,
}: CircularProgressBarFilledProps): React.ReactElement => {
  const { theme } = useTheme();
  const {
    sqSize,
    strokeWidth,
    radius,
    viewBox,
    dashArray,
    dashOffset,
  } = getCircularProgressSVGTokens({ size, progressPercent });

  const duration = castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDuration)));
  const easing = castWebType(getIn(theme.motion, motionEasing));
  const shouldPulse = !isMeter && progressPercent !== 100;

  const arcStyle: React.CSSProperties = {
    transition: `stroke-dashoffset ${duration} ${easing}`,
    ...(shouldPulse
      ? ({
          '--circular-progress-duration': duration,
          '--circular-progress-easing': easing,
        } as React.CSSProperties)
      : {}),
  };

  const percentTextStyles = getBaseTextStyles({
    theme,
    ...getTextProps({
      variant: 'body',
      size: circularProgressSizeTokens[size].percentTextSize,
      weight: 'semibold',
    }),
  });

  return (
    <BaseBox
      width="fit-content"
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Svg width={String(sqSize)} height={String(sqSize)} viewBox={viewBox}>
        <Circle
          fill="none"
          stroke={backgroundColor}
          cx={String(sqSize / 2)}
          cy={String(sqSize / 2)}
          r={String(radius)}
          strokeWidth={`${strokeWidth}px`}
        />

        <circle
          className={[styles.progressArc, shouldPulse ? styles.progressArcPulse : undefined]
            .filter(Boolean)
            .join(' ')}
          style={arcStyle}
          fill="none"
          stroke={fillColor}
          cx={String(sqSize / 2)}
          cy={String(sqSize / 2)}
          r={String(radius)}
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
        {showPercentage && size !== 'small' && (
          <text
            style={{
              ...percentTextStyles,
              fill: theme.colors.surface.text.gray.normal,
            }}
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".4em"
          >
            {progressPercent}%
          </text>
        )}
      </Svg>

      <CircularProgressLabel
        progressPercent={progressPercent}
        size={size}
        label={label}
        showPercentage={showPercentage}
      />
    </BaseBox>
  );
};

export { CircularProgressBarFilled };
