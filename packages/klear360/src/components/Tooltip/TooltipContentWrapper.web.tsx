import type { CSSProperties } from 'react';
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { TooltipContentWrapperProps } from './types';
import type { ColorSchemeNames } from '~tokens/theme/theme';
import styles from './Tooltip.module.scss';

type TooltipContentWrapperWebProps = TooltipContentWrapperProps & {
  styles: CSSProperties;
  colorScheme: ColorSchemeNames;
  className?: string;
  style?: CSSProperties;
};

const TooltipContentWrapper = React.forwardRef<HTMLElement, TooltipContentWrapperWebProps>(
  (
    { styles: floatingStyles, colorScheme: _colorScheme, className, style, ...props },
    ref,
  ) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[styles.bubble, className].filter(Boolean).join(' ')}
      style={{ ...floatingStyles, ...style }}
    />
  ),
);

TooltipContentWrapper.displayName = 'TooltipContentWrapper';

export { TooltipContentWrapper };
