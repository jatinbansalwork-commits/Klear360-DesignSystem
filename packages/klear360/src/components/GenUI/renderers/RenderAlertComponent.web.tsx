/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { useGenUIAction } from '../GenUIContext';
import { getValidFeedbackColor } from '../GenUIComponentTypes';
import type { AlertComponent } from '../GenUIComponentTypes';
import { Box } from '~components/Box';
import { InfoIcon, CheckCircleIcon, AlertTriangleIcon } from '~components/Icons';
import { Alert } from '~components/Alert';

const RenderAlertComponent = memo(
  ({ title, description, color = 'neutral', actions }: AlertComponent) => {
    const onActionClick = useGenUIAction();
    if (!title && !description) return null;

    // Validate color during streaming - show placeholder for invalid colors
    const validColor = getValidFeedbackColor(color);
    if (validColor !== color) {
      return <Box marginY="spacing.3" width="100%" />;
    }

    const iconMap = {
      information: InfoIcon,
      negative: AlertTriangleIcon,
      neutral: InfoIcon,
      notice: InfoIcon,
      positive: CheckCircleIcon,
    } as const;

    const Icon = iconMap[validColor];

    return (
      <Alert
        emphasis="subtle"
        title={title}
        icon={Icon}
        description={description!}
        color={validColor}
        isDismissible={false}
        marginY="spacing.4"
        actions={{
          primary: actions?.primary?.text
            ? {
                text: actions.primary.text,
                onClick: () => {
                  if (actions.primary?.action && onActionClick) {
                    onActionClick(actions.primary.action);
                  }
                },
              }
            : undefined,
          secondary: actions?.secondary?.text
            ? {
                text: actions.secondary.text,
                onClick: () => {
                  if (actions.secondary?.action && onActionClick) {
                    onActionClick(actions.secondary.action);
                  }
                },
              }
            : undefined,
        }}
      />
    );
  },
);

export { RenderAlertComponent };
