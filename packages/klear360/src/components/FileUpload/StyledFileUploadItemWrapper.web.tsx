import React from 'react';
import type { StyledFileUploadItemWrapperProps } from './types';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type StyledFileUploadItemWrapperWebProps = Omit<StyledFileUploadItemWrapperProps, 'theme'> &
  BaseBoxProps &
  Pick<React.HTMLAttributes<HTMLElement>, 'style' | 'className'>;
import {
  fileUploadHeightTokens,
  fileUploadItemBackgroundColors,
} from './fileUploadTokens';
import {
  getFileUploadItemClass,
  getFileUploadItemDataAttributes,
} from './getFileUploadModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import getIn from '~utils/lodashButBetter/get';
import { makeSize } from '~utils';

const StyledFileUploadItemWrapper = React.forwardRef<
  HTMLElement,
  StyledFileUploadItemWrapperWebProps
>(({ status, size, className, style, ...rest }, ref) => {
  const { theme } = useTheme();
  const resolvedSize = size === 'variable' ? 'large' : size;
  const statusColors = fileUploadItemBackgroundColors[status];

  return (
    <BaseBox
      ref={ref as never}
      {...rest}
      {...getFileUploadItemDataAttributes(status)}
      className={[getFileUploadItemClass(), className].filter(Boolean).join(' ')}
      style={
        {
          ['--file-upload-item-min-height' as string]: makeSize(
            fileUploadHeightTokens[resolvedSize],
          ),
          ['--file-upload-item-bg' as string]: getIn(theme.colors, statusColors.default),
          ['--file-upload-item-bg-hover' as string]: getIn(theme.colors, statusColors.hover),
          ...style,
        } as React.CSSProperties
      }
    />
  );
});

StyledFileUploadItemWrapper.displayName = 'StyledFileUploadItemWrapper';

export { StyledFileUploadItemWrapper };
