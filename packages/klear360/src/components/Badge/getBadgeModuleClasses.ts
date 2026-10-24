import type { BadgeProps } from './Badge';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import styles from './Badge.module.scss';

type BadgeColor = NonNullable<BadgeProps['color']>;

export const getBadgeModuleClasses = ({
  color,
  emphasis,
  size,
}: {
  color: BadgeColor;
  emphasis: SubtleOrIntense;
  size: NonNullable<BadgeProps['size']>;
}): string =>
  [
    styles.badge,
    styles[size],
    styles[`color-${color}`],
    styles[`emphasis-${emphasis}`],
  ]
    .filter(Boolean)
    .join(' ');
