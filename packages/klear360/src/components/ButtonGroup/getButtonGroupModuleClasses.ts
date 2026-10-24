import type { ButtonGroupProps } from './types';
import styles from './ButtonGroup.module.scss';

export const getButtonGroupRootClass = ({
  variant = 'primary',
}: Pick<ButtonGroupProps, 'variant'>): string =>
  [
    styles.group,
    variant === 'secondary' ? styles.groupSecondary : null,
    variant === 'tertiary' ? styles.groupTertiary : null,
  ]
    .filter(Boolean)
    .join(' ');

export const getButtonGroupDividerClass = (): string => styles.divider;

export const getButtonGroupDataAttributes = (
  isFullWidth?: boolean,
): { 'data-full-width'?: true } => (isFullWidth ? { 'data-full-width': true } : {});
