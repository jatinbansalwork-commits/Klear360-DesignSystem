/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import toast from 'react-hot-toast';
import type { ToastProps } from './types';
import { getToastModuleClasses } from './getToastModuleClasses';
import styles from './Toast.module.scss';
import { makeAccessible } from '~utils/makeAccessible';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute/makeAnalyticsConstants';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '~components/Icons';
import { Text } from '~components/Typography';

const iconMap = {
  positive: CheckCircleIcon,
  negative: AlertOctagonIcon,
  information: InfoIcon,
  neutral: InfoIcon,
  notice: AlertTriangleIcon,
};

const Toast = ({
  type,
  color = 'neutral',
  leading,
  action,
  content,
  onDismissButtonClick,
  isVisible,
  id,
}: ToastProps & {
  isVisible?: boolean;
}): React.ReactElement => {
  const isPromotional = type === 'promotional';
  const Icon = isPromotional ? leading : leading || iconMap[color];

  const actionButton = action ? (
    <Button
      size="xsmall"
      variant={isPromotional ? 'secondary' : 'tertiary'}
      color={isPromotional ? 'primary' : 'white'}
      onClick={(event) => {
        event.stopPropagation();
        action?.onClick?.({ event: event as never, toastId: id! });
      }}
      isLoading={action?.isLoading}
      data-analytics-name={MAKE_ANALYTICS_CONSTANTS.TOAST.ACTION_BUTTON}
    >
      {action?.text}
    </Button>
  ) : null;

  return (
    <div
      {...makeAccessible({ role: 'status', liveRegion: 'polite' })}
      {...metaAttribute({ name: MetaConstants.Toast })}
      className={getToastModuleClasses({ type, color, isVisible })}
    >
      {Icon ? (
        <div className={styles.iconWrapper}>
          <Icon
            color={isPromotional ? 'surface.icon.gray.normal' : 'surface.icon.staticWhite.normal'}
          />
        </div>
      ) : null}
      <div className={styles.content}>
        {isPromotional ? (
          content
        ) : (
          <Text as="span" size="small" color="surface.text.staticWhite.normal">
            {content}
          </Text>
        )}
        {isPromotional && actionButton}
      </div>
      <div className={styles.trailing}>
        {!isPromotional && actionButton}
        <IconButton
          emphasis={isPromotional ? 'intense' : 'subtle'}
          accessibilityLabel="Dismiss toast"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            onDismissButtonClick?.({ event, toastId: id! });
            toast.dismiss(id);
          }}
          icon={CloseIcon}
        />
      </div>
    </div>
  );
};

export { Toast };
