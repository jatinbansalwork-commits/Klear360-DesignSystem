import type { ToastProps } from './types';
import styles from './Toast.module.scss';

type ToastClassProps = {
  type: ToastProps['type'];
  color: NonNullable<ToastProps['color']>;
  isVisible?: boolean;
};

const colorClassMap = {
  neutral: styles.colorNeutral,
  positive: styles.colorPositive,
  negative: styles.colorNegative,
  notice: styles.colorNotice,
  information: styles.colorInformation,
} as const;

export const getToastModuleClasses = ({
  type,
  color,
  isVisible,
}: ToastClassProps): string => {
  const isPromotional = type === 'promotional';

  return [
    styles.toast,
    isPromotional ? styles.typePromotional : styles.typeInformational,
    !isPromotional ? colorClassMap[color] : undefined,
    isVisible ? styles.toastEnter : styles.toastExit,
  ]
    .filter(Boolean)
    .join(' ');
};
