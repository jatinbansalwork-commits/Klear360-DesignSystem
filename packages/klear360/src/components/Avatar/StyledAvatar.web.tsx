import React from 'react';
import type { StyledAvatarProps } from './types';
import { getAvatarWrapperClasses } from './getAvatarModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type WebStyledAvatarProps = StyledAvatarProps &
  BaseBoxProps & {
    isInteractive?: boolean;
    children?: React.ReactNode;
  };

const StyledAvatar = ({
  variant,
  size,
  isInteractive,
  className,
  children,
  ...rest
}: WebStyledAvatarProps): React.ReactElement => (
  <BaseBox
    {...rest}
    className={[getAvatarWrapperClasses({ variant, size, isInteractive }), className]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </BaseBox>
);

export { StyledAvatar };
