import styles from './Card.module.scss';

export const getCardTicketWrapperClass = (): string => styles.cardTicketWrapper;
export const getCardTicketClipContentClass = (): string => styles.cardTicketClipContent;
export const getCardTicketOutlineClass = (): string => styles.cardTicketOutline;

export const getCardTicketSectionClasses = (position: 'top' | 'bottom'): string =>
  [
    styles.cardTicketSection,
    position === 'top' ? styles.cardTicketSectionTop : styles.cardTicketSectionBottom,
  ].join(' ');
