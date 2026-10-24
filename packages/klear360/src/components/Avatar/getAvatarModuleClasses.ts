import type { AvatarButtonProps, StyledAvatarProps } from './types';
import type { AvatarGroupProps } from './types';
import styles from './Avatar.module.scss';

export const getAvatarWrapperClasses = ({
  variant,
  size,
  isInteractive,
}: StyledAvatarProps & { isInteractive?: boolean }): string =>
  [
    styles['avatar-wrapper'],
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    variant === 'square' ? styles[`square-${size}`] : undefined,
    isInteractive ? styles.interactive : undefined,
  ]
    .filter(Boolean)
    .join(' ');

export const getAvatarButtonClasses = ({
  color = 'neutral',
  isSelected,
  isInteractive,
}: Pick<AvatarButtonProps, 'color' | 'isSelected'> & {
  isInteractive?: boolean;
}): string =>
  [
    styles['avatar-btn'],
    styles[`btn-color-${color}`],
    isSelected ? styles['btn-selected'] : undefined,
    isInteractive ? styles['btn-interactive'] : undefined,
  ]
    .filter(Boolean)
    .join(' ');

export const getAvatarGroupClasses = ({
  size,
  density,
}: {
  size: NonNullable<AvatarGroupProps['size']>;
  density: NonNullable<AvatarGroupProps['density']>;
}): string => {
  const densityPrefix =
    density === 'compact'
      ? 'group-density-compact'
      : density === 'comfortable'
      ? 'group-density-comfortable'
      : 'group-size';

  const overlapClass =
    density === 'normal'
      ? styles[`group-size-${size}` as keyof typeof styles]
      : styles[`${densityPrefix}-${size}` as keyof typeof styles];

  return [styles['avatar-group'], overlapClass].filter(Boolean).join(' ');
};
