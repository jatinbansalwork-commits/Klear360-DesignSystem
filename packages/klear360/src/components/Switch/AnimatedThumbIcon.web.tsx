import React from 'react';
import type { SwitchProps } from './types';
import { getSwitchThumbIconModuleClasses } from './getSwitchThumbModuleClasses';
import Svg from '~components/Icons/_Svg';
import type { SvgProps } from '~components/Icons/_Svg/Svg/types';

type AnimatedThumbIconProps = SvgProps & {
  isChecked?: boolean;
  size?: NonNullable<SwitchProps['size']>;
};

const AnimatedThumbIcon = ({
  isChecked,
  size = 'medium',
  children,
  ...rest
}: AnimatedThumbIconProps): React.ReactElement => (
  <span
    className={getSwitchThumbIconModuleClasses({
      size,
      isEffectivelyChecked: Boolean(isChecked),
    })}
  >
    <Svg {...rest}>{children}</Svg>
  </span>
);

export { AnimatedThumbIcon };
