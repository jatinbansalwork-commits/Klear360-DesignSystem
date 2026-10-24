import type { CardRootProps, CardVariant } from './types';
import styles from './Card.module.scss';

export const getCardRootClasses = ({
  as,
}: Pick<CardRootProps, 'as'>): string =>
  [styles.cardRoot, as === 'label' ? styles.cardRootLabel : undefined].filter(Boolean).join(' ');

export const getCardSurfaceClasses = (variant: CardVariant = 'primary'): string =>
  [
    styles.cardSurface,
    variant === 'primary' ? styles.cardSurfaceElevated : styles.cardSurfaceFlat,
  ].join(' ');
