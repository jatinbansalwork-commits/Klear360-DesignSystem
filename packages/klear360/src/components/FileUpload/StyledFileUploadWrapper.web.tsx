import React from 'react';
import type { StyledFileUploadWrapperProps } from './types';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type StyledFileUploadWrapperWebProps = Omit<StyledFileUploadWrapperProps, 'theme'> &
  BaseBoxProps &
  Pick<
    React.HTMLAttributes<HTMLElement>,
    'style' | 'className' | 'onClick' | 'onDragOver' | 'onDragLeave' | 'onDrop'
  >;
import {
  getFileUploadDropZoneClass,
  getFileUploadDropZoneDataAttributes,
} from './getFileUploadModuleClasses';
import BaseBox from '~components/Box/BaseBox';

const StyledFileUploadWrapper = React.forwardRef<HTMLElement, StyledFileUploadWrapperWebProps>(
  ({ isDisabled, isActive, className, ...rest }, ref) => (
    <BaseBox
      ref={ref as never}
      {...rest}
      {...getFileUploadDropZoneDataAttributes({ isDisabled, isActive })}
      className={[getFileUploadDropZoneClass(), className].filter(Boolean).join(' ')}
    />
  ),
);

StyledFileUploadWrapper.displayName = 'StyledFileUploadWrapper';

export { StyledFileUploadWrapper };
