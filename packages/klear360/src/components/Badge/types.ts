import type { ReactNode } from 'react';
import type { BadgeProps } from './Badge';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Theme } from '~components/Klear360Provider';
import type { DotNotationColorStringToken } from '~utils/types';
import type { SubtleOrIntense } from '~tokens/theme/theme';

type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type StyledBadgeProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<BadgeProps['size']>;
  color: NonNullable<BadgeProps['color']>;
  emphasis: NonNullable<BadgeProps['emphasis']>;
  /** Injected by styled-components on native; omitted on web SCSS path. */
  theme?: Theme;
  className?: string;
  children?: ReactNode;
} & Pick<BaseBoxProps, 'height' | 'textAlign'>;
