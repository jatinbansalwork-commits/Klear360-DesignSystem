import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { SkeletonProps } from './types';
import styles from './Skeleton.module.scss';

const _PulseAnimation = (
  props: SkeletonProps,
  ref: React.Ref<HTMLElement>,
): React.ReactElement => (
  <BaseBox
    ref={ref as never}
    {...props}
    className={[styles.skeleton, props.className].filter(Boolean).join(' ')}
  />
);

const PulseAnimation = React.forwardRef(_PulseAnimation);

export { PulseAnimation };
