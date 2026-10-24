import React from 'react';
import type { CardVariant } from './types';
import type { ColorSchemeNames } from '~tokens/theme';
import { getCardSurfaceClasses } from './getCardModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';

type CardSurfaceProps = BaseBoxProps & {
  colorScheme: ColorSchemeNames;
  isSelected?: boolean;
  variant?: CardVariant;
  className?: string;
  style?: React.CSSProperties;
};

const CardSurface = React.forwardRef<HTMLElement, CardSurfaceProps>(
  ({ variant = 'primary', className, style, colorScheme: _colorScheme, isSelected: _isSelected, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[getCardSurfaceClasses(variant), className].filter(Boolean).join(' ')}
      style={style}
    />
  ),
);

CardSurface.displayName = 'CardSurface';

export { CardSurface };
