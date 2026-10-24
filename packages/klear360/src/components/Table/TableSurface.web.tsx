import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceBoxShadow, getSurfaceStyles } from '~utils/makeSurfaceStyles';
import styles from './TableSurface.module.scss';

type TableSurfaceProps = BaseBoxProps & {
  colorScheme: ColorSchemeNames;
  isInsideListView: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const TableSurface = React.forwardRef<HTMLElement, TableSurfaceProps>(
  ({ colorScheme, isInsideListView, className, style, ...props }, ref) => {
    const { theme } = useTheme();

    let surfaceStyle: React.CSSProperties | undefined;

    if (!isInsideListView) {
      const isDarkMode = colorScheme === 'dark';
      const { elevation, top } = getSurfaceBoxShadow(theme, colorScheme);
      const borderColor = theme.colors.interactive.border.gray.disabled;
      const { boxShadow: _surfaceBoxShadow, ...surfaceDecoration } = getSurfaceStyles(
        theme,
        colorScheme,
      ) as React.CSSProperties;

      surfaceStyle = {
        ...surfaceDecoration,
        boxShadow: `${elevation}, ${top}`,
        borderLeft: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        ...(!isDarkMode ? { borderTop: `1px solid ${borderColor}` } : {}),
      };
    }

    return (
      <BaseBox
        ref={ref as never}
        {...props}
        className={[styles.root, className].filter(Boolean).join(' ')}
        style={surfaceStyle ? { ...surfaceStyle, ...style } : style}
      />
    );
  },
);

TableSurface.displayName = 'TableSurface';

export { TableSurface };
