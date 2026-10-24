import React from 'react';
import type { ProgressBarFilledProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';
import { useTheme } from '~components/Klear360Provider';
import styles from './ProgressBarFilled.module.scss';

const ProgressBarFilled = ({
  backgroundColor,
  fillMotionDuration,
  motionEasing,
  progress,
  pulseMotionDelay,
  pulseMotionDuration,
  indeterminateMotionDuration,
  type,
  isIndeterminate,
  _oscillation = false,
}: ProgressBarFilledProps): React.ReactElement => {
  const { theme } = useTheme();

  const cssVars = {
    '--progress-indeterminate-duration': castWebType(
      makeMotionTime(getIn(theme.motion, indeterminateMotionDuration)),
    ),
    '--progress-pulse-duration': castWebType(
      makeMotionTime(getIn(theme.motion, pulseMotionDuration)),
    ),
    '--progress-pulse-easing': castWebType(getIn(theme.motion, motionEasing)),
    '--progress-pulse-delay': castWebType(makeMotionTime(getIn(theme.motion, pulseMotionDelay))),
    '--progress-fill-duration': castWebType(makeMotionTime(getIn(theme.motion, fillMotionDuration))),
    '--progress-fill-easing': castWebType(getIn(theme.motion, motionEasing)),
    '--progress-bar-radius': `${theme.border.radius.xsmall}px`,
  } as React.CSSProperties;

  const showPulse = type === 'progress';

  if (isIndeterminate) {
    return (
      <BaseBox
        className={styles.indeterminateFill}
        style={{
          ...cssVars,
          backgroundColor,
          borderRadius: theme.border.radius.xsmall,
        }}
      >
        <BaseBox
          className={
            _oscillation ? styles.indeterminateOscillate : styles.indeterminateSlide
          }
          style={{ backgroundColor }}
        />
        {showPulse ? <div className={styles.pulse} style={cssVars} /> : null}
      </BaseBox>
    );
  }

  return (
    <BaseBox
      className={styles.determinateFill}
      style={{
        ...cssVars,
        backgroundColor,
        width: `${progress}%`,
        borderRadius: theme.border.radius.xsmall,
      }}
    >
      {showPulse ? <div className={styles.pulse} style={cssVars} /> : null}
    </BaseBox>
  );
};

export { ProgressBarFilled };
