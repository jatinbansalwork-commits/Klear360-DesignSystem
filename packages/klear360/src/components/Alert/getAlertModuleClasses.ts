import type { StyledAlertProps } from './types';
import styles from './Alert.module.scss';

export const getAlertModuleClasses = ({
  color,
  emphasis,
  isFullWidth,
}: Pick<StyledAlertProps, 'color' | 'emphasis' | 'isFullWidth'>): string =>
  [
    styles.alert,
    styles[`color-${color}`],
    styles[`emphasis-${emphasis}`],
    isFullWidth ? styles['full-width'] : undefined,
  ]
    .filter(Boolean)
    .join(' ');
