import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { getPopupBoxShadowString, makeSize } from '~utils';
import { useTheme } from '~components/Klear360Provider';
import type { ColorSchemeNames } from '~tokens/theme';
import styles from './StyledDropdownOverlay.module.scss';

type StyledDropdownOverlayProps = BaseBoxProps & {
  isInBottomSheet?: boolean;
  colorScheme: ColorSchemeNames;
  className?: string;
  style?: React.CSSProperties;
};

const StyledDropdownOverlay = React.forwardRef<HTMLElement, StyledDropdownOverlayProps>(
  ({ isInBottomSheet, colorScheme, className, style, ...props }, ref) => {
    const { theme } = useTheme();

    const inlineStyle: React.CSSProperties = {
      borderRadius: makeSize(theme.border.radius.medium),
      backdropFilter: `blur(${theme.backdropBlur.medium}px)`,
      ...(isInBottomSheet ? {} : { boxShadow: getPopupBoxShadowString(theme, colorScheme) }),
      ...style,
    };

    return (
      <BaseBox
        ref={ref as never}
        className={[styles.overlay, className].filter(Boolean).join(' ')}
        style={inlineStyle}
        {...props}
      />
    );
  },
);

StyledDropdownOverlay.displayName = 'StyledDropdownOverlay';

export { StyledDropdownOverlay };
