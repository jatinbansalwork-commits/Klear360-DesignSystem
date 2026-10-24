import React from 'react';
import type { AnimatedButtonContentProps } from './types';
import styles from './BaseButton.module.scss';
import getIn from '~utils/lodashButBetter/get';
import { castWebType, makeMotionTime } from '~utils';
import { useTheme } from '~components/Klear360Provider';
import BaseBox from '~components/Box/BaseBox';

type WebAnimatedButtonContentProps = AnimatedButtonContentProps & {
  children?: React.ReactNode;
};

const AnimatedButtonContent = ({
  motionDuration,
  motionEasing,
  isPressed,
  children,
}: WebAnimatedButtonContentProps): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <BaseBox
      className={[styles.animatedContent, isPressed ? styles.pressed : undefined]
        .filter(Boolean)
        .join(' ')}
      style={{
        transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, motionDuration))),
        transitionTimingFunction: castWebType(getIn(theme.motion, motionEasing)),
      }}
    >
      {children}
    </BaseBox>
  );
};

export default AnimatedButtonContent;
