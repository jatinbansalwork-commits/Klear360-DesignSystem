import type { TrackProps } from './types';
import styles from './Switch.module.scss';

export const getSwitchTrackModuleClasses = ({
  size,
  isChecked,
  isDisabled,
}: Pick<TrackProps, 'size' | 'isChecked' | 'isDisabled'>): string =>
  [
    styles.track,
    styles[`size-${size}`],
    isChecked ? styles.checked : styles.unchecked,
  ]
    .filter(Boolean)
    .join(' ');

export const getSwitchTrackDataAttributes = (
  isDisabled: boolean,
): { 'data-disabled'?: true } => (isDisabled ? { 'data-disabled': true } : {});
