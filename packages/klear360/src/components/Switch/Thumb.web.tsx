import React from 'react';
import type { ThumbProps } from './types';
import { getSwitchThumbWrapperClasses } from './getSwitchThumbModuleClasses';
import BaseBox from '~components/Box/BaseBox';

const Thumb = ({
  size = 'medium',
  deviceType: _deviceType,
  children,
  className,
  ...rest
}: ThumbProps & { children?: React.ReactNode; className?: string }): React.ReactElement => (
  <BaseBox {...rest} className={[getSwitchThumbWrapperClasses(size), className].filter(Boolean).join(' ')}>
    {children}
  </BaseBox>
);

export { Thumb };
