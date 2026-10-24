import styles from './Tag.module.scss';

export const getAnimatedTagContainerClass = ({
  isVisible,
  isAnimatingDismiss,
  isAnimatingShow,
}: {
  isVisible: boolean;
  isAnimatingDismiss: boolean;
  isAnimatingShow: boolean;
}): string =>
  [
    styles.animatedContainer,
    !isVisible ? styles.animatedContainerCollapsed : null,
    isAnimatingShow ? styles.showAnimation : null,
    isAnimatingDismiss ? styles.dismissAnimation : null,
  ]
    .filter(Boolean)
    .join(' ');
