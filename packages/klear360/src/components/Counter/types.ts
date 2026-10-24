import type { ReactNode } from 'react';
import type { CounterProps } from './Counter';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Theme } from '~components/Klear360Provider';
import type { TypographyPlatforms } from '~tokens/global';
import type { DotNotationColorStringToken } from '~utils/types';
import type { SubtleOrIntense } from '~tokens/theme/theme';

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;

export type StyledCounterProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<CounterProps['size']>;
  color: NonNullable<CounterProps['color']>;
  emphasis: NonNullable<CounterProps['emphasis']>;
  platform: TypographyPlatforms;
  /** Injected by styled-components on native; omitted on web SCSS path. */
  theme?: Theme;
  className?: string;
  children?: ReactNode;
} & Pick<BaseBoxProps, 'minHeight' | 'minWidth'>;
