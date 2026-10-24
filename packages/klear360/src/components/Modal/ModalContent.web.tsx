import type { ReactNode } from 'react';
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { ModalProps } from './types';
import styles from './Modal.module.scss';

type ModalContentProps = BaseBoxProps & {
  isVisible: boolean;
  size: NonNullable<ModalProps['size']>;
  className?: string;
  children?: ReactNode;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

const sizeClassByModalSize: Record<NonNullable<ModalProps['size']>, string> = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
  full: styles.sizeFull,
};

const ModalContent = React.forwardRef<HTMLElement, ModalContentProps>(
  ({ isVisible, size, className, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      className={[styles.surface, sizeClassByModalSize[size], className].filter(Boolean).join(' ')}
      data-state={isVisible ? 'open' : 'closed'}
    />
  ),
);

ModalContent.displayName = 'ModalContent';

export { ModalContent };
