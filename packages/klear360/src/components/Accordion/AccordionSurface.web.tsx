import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceStyles } from '~utils/makeSurfaceStyles';
import styles from './AccordionSurface.module.scss';

type AccordionSurfaceProps = BaseBoxProps & {
  colorScheme: ColorSchemeNames;
  className?: string;
  style?: React.CSSProperties;
};

const AccordionSurface = React.forwardRef<HTMLElement, AccordionSurfaceProps>(
  ({ colorScheme, className, style, ...props }, ref) => {
    const { theme } = useTheme();
    const surfaceStyle = getSurfaceStyles(theme, colorScheme) as React.CSSProperties;

    return (
      <BaseBox
        ref={ref as never}
        {...props}
        className={[styles.surface, className].filter(Boolean).join(' ')}
        style={{ ...surfaceStyle, ...style }}
      />
    );
  },
);

AccordionSurface.displayName = 'AccordionSurface';

export { AccordionSurface };
