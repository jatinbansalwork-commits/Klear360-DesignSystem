/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { FloatingFocusManager, FloatingPortal, useFloating } from '@floating-ui/react';
import usePresence from 'use-presence';
import { ModalHeader } from './ModalHeader';
import type { ModalHeaderProps } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import type { ModalFooterProps } from './ModalFooter';
import { ModalBody } from './ModalBody';
import type { ModalBodyProps } from './ModalBody';
import { ModalContext } from './ModalContext';
import { ModalBackdrop } from './ModalBackdrop.web';
import { ModalContent } from './ModalContent.web';
import {
  modalBorderRadius,
  modalMaxHeight,
  modalMaxWidth,
  modalMinWidth,
  modalResponsiveScreenGap,
  modalMargin,
} from './modalTokens';
import type { ModalProps } from './types';
import { makeSize } from '~utils';
import { useTheme } from '~components/Klear360Provider';
import { Box } from '~components/Box';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { logger } from '~utils/logger';
import { componentZIndices } from '~utils/componentZIndices';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TopNavOverlayThemeOverride } from '~components/TopNav/TopNavOverlayThemeOverride';

const Modal = ({
  isOpen = false,
  children,
  onDismiss,
  isDismissible = true,
  initialFocusRef,
  size = 'small',
  accessibilityLabel,
  zIndex = componentZIndices.modal,
  ...rest
}: ModalProps): React.ReactElement => {
  const { theme, platform } = useTheme();
  const { isMounted, isVisible } = usePresence(isOpen, {
    transitionDuration: theme.motion.duration.moderate,
    initialEnter: true,
  });

  // Warn consumer if modal is opened on mobile
  useEffect(() => {
    if (__DEV__) {
      if (platform === 'onMobile') {
        logger({
          message: 'Modal is not supported on mobile devices. Please use BottomSheet instead.',
          moduleName: 'Modal',
          type: 'warn',
        });
      }
    }
  }, [platform]);

  // required by floating ui to handle focus
  const { refs, context } = useFloating({
    open: isMounted,
  });

  const defaultInitialFocusRef = React.useRef<any>(null);

  const modalContext = React.useMemo(
    () => ({
      isOpen,
      close: onDismiss,
      isDismissible,
      defaultInitialFocusRef,
      isVisible,
      isInsideModal: true,
    }),
    [isOpen, onDismiss, isDismissible, defaultInitialFocusRef, isVisible],
  );

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    // close modal on escape key press only if dismissible
    if (isDismissible && (event?.key === 'Escape' || event?.code === 'Escape')) {
      onDismiss?.();
    }
  };

  return (
    <FloatingPortal>
      <ModalContext.Provider value={modalContext}>
        {isMounted ? (
          <FloatingFocusManager
            returnFocus
            initialFocus={initialFocusRef ?? defaultInitialFocusRef}
            context={context}
            modal={true}
          >
            <TopNavOverlayThemeOverride>
              <Box zIndex={zIndex} position="fixed" testID="modal-wrapper">
                <ModalBackdrop />
                <ModalContent
                  {...metaAttribute({
                    name: MetaConstants.Modal,
                  })}
                  {...makeAccessible({
                    role: 'dialog',
                    modal: true,
                    label: accessibilityLabel,
                  })}
                  {...makeAnalyticsAttribute(rest)}
                  maxWidth={size === 'full' ? '100%' : makeSize(modalMaxWidth[size])}
                  minWidth={makeSize(modalMinWidth)}
                  maxHeight={modalMaxHeight[size]}
                  width={
                    size === 'full'
                      ? `calc(100vw - ${makeSize(modalMargin[size] * 2)})`
                      : `calc(100vw - ${makeSize(modalResponsiveScreenGap)})`
                  }
                  borderRadius={modalBorderRadius}
                  backgroundColor="popup.background.gray.subtle"
                  display="flex"
                  flexDirection="column"
                  top="50%"
                  left="50%"
                  onKeyDown={handleKeyDown}
                  isVisible={isVisible}
                  size={size}
                  ref={refs.setFloating}
                  overflow="hidden"
                >
                  {children}
                </ModalContent>
              </Box>
            </TopNavOverlayThemeOverride>
          </FloatingFocusManager>
        ) : null}
      </ModalContext.Provider>
    </FloatingPortal>
  );
};

export { Modal, ModalHeader, ModalFooter, ModalBody };
export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
