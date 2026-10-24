import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { baseInputBorderBackgroundMotion, baseInputBorderRadius } from './baseInputTokens';

type BaseInputFocusRingSize = keyof typeof baseInputBorderRadius;
type BaseInputFocusRingBorderRadius = 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
import { useTheme } from '~components/Klear360Provider';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { ScopedRuntimeStyles, useStableScopeClass } from '~utils/web/scopedCssFromObject';
import type { ActionStates } from '~utils/useInteraction';
import getIn from '~utils/lodashButBetter/get';
import { castWebType, makeBorderSize, makeMotionTime } from '~utils';

type BaseInputFocusRingWrapperProps = React.PropsWithChildren<{
  currentInteraction: ActionStates;
  isTableInputCell?: boolean;
  className?: string;
  shouldAddLimitedFocus: boolean;
  $size: BaseInputFocusRingSize;
  $borderRadius?: BaseInputFocusRingBorderRadius;
}>;

const BaseInputFocusRingWrapper = ({
  children,
  currentInteraction,
  isTableInputCell,
  className,
  shouldAddLimitedFocus,
  $size,
  $borderRadius,
}: BaseInputFocusRingWrapperProps): React.ReactElement => {
  const { theme } = useTheme();
  const scopeClass = useStableScopeClass('base-input-fr');

  const borderRadius = makeBorderSize(
    isTableInputCell
      ? theme.border.radius.none
      : theme.border.radius[$borderRadius ?? baseInputBorderRadius[$size]],
  );

  const shouldShowFocusRing =
    !isTableInputCell &&
    (shouldAddLimitedFocus ? currentInteraction === 'focus' : true);

  const motionKey = currentInteraction === 'focus' ? 'enter' : 'exit';

  const styleObject = React.useMemo(() => {
    if (!shouldShowFocusRing) {
      return {};
    }

    return {
      '&:focus-within': {
        ...getFocusRingStyles({ theme }),
        transitionDuration: castWebType(
          makeMotionTime(
            getIn(theme.motion.duration, baseInputBorderBackgroundMotion[motionKey].duration),
          ),
        ),
        transitionTimingFunction: castWebType(
          theme.motion.easing[baseInputBorderBackgroundMotion[motionKey].easing],
        ),
      },
    };
  }, [theme, shouldShowFocusRing, motionKey]);

  return (
    <>
      <ScopedRuntimeStyles scopeClass={scopeClass} styleObject={styleObject} />
      <BaseBox
        className={[scopeClass, className].filter(Boolean).join(' ')}
        style={{ borderRadius, width: '100%' }}
      >
        {children}
      </BaseBox>
    </>
  );
};

export { BaseInputFocusRingWrapper as FocusRingWrapper };
