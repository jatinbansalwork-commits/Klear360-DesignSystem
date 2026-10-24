import React from 'react';
import type { AnimatedThumbProps } from './types';
import {
  getAnimatedThumbDataAttributes,
  getAnimatedThumbModuleClasses,
} from './getSwitchThumbModuleClasses';
import BaseBox from '~components/Box/BaseBox';

const AnimatedThumb = ({
  isChecked,
  isDisabled,
  isPressed,
  children,
  size: _size,
}: AnimatedThumbProps & { children?: React.ReactNode }): React.ReactElement => (
  <BaseBox
    {...getAnimatedThumbDataAttributes(isDisabled)}
    className={getAnimatedThumbModuleClasses({ isChecked, isPressed })}
  >
    {children}
  </BaseBox>
);

export { AnimatedThumb };
