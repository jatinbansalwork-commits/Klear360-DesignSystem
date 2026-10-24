import React from 'react';
import type { AvatarGroupProps } from './types';
import { getAvatarGroupClasses } from './getAvatarModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type WebStyledAvatarGroupProps = BaseBoxProps & {
  size: NonNullable<AvatarGroupProps['size']>;
  density: NonNullable<AvatarGroupProps['density']>;
  children?: React.ReactNode;
  role?: React.AriaRole;
  className?: string;
};

const StyledAvatarGroup = ({
  size,
  density,
  className,
  children,
  ...rest
}: WebStyledAvatarGroupProps): React.ReactElement => (
  <BaseBox
    {...rest}
    className={[getAvatarGroupClasses({ size, density }), className].filter(Boolean).join(' ')}
  >
    {children}
  </BaseBox>
);

export { StyledAvatarGroup };
