import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { baseInputBorderRadius } from './baseInputTokens';

type BaseInputFocusRingSize = keyof typeof baseInputBorderRadius;
type BaseInputFocusRingBorderRadius = 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
import { useTheme } from '~components/Klear360Provider';
import { makeBorderSize } from '~utils';
import type { ActionStates } from '~utils/useInteraction';

type BaseInputFocusRingWrapperProps = React.PropsWithChildren<{
  currentInteraction: ActionStates;
  isTableInputCell?: boolean;
  className?: string;
  shouldAddLimitedFocus: boolean;
  $size: BaseInputFocusRingSize;
  $borderRadius?: BaseInputFocusRingBorderRadius;
}>;

/** Native: outer ring handled by AnimatedBaseInputWrapper; this wrapper only sets layout radius. */
const BaseInputFocusRingWrapper = ({
  children,
  isTableInputCell,
  className,
  $size,
  $borderRadius,
}: BaseInputFocusRingWrapperProps): React.ReactElement => {
  const { theme } = useTheme();

  const borderRadius = makeBorderSize(
    isTableInputCell
      ? theme.border.radius.none
      : theme.border.radius[$borderRadius ?? baseInputBorderRadius[$size]],
  );

  return (
    <BaseBox className={className} style={{ borderRadius, width: '100%' }}>
      {children}
    </BaseBox>
  );
};

export { BaseInputFocusRingWrapper as FocusRingWrapper };
