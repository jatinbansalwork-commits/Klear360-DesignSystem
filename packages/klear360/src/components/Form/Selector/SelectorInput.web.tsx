/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import type { CSSProperties } from 'react';
import type { HoverProps, SelectorInputProps } from './types';
import styles from './SelectorInput.module.scss';
import getIn from '~utils/lodashButBetter/get';
import type { Theme } from '~components/Klear360Provider';
import { useTheme } from '~components/Klear360Provider';
import { castWebType } from '~utils';
import type { Klear360ElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeMotionTime } from '~utils/makeMotionTime';
import { makeAccessible } from '~utils/makeAccessible';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const getHoverStyleVars = ({
  theme,
  isDisabled,
  hasError,
  isChecked,
  hoverTokens,
}: { theme: Theme } & HoverProps): CSSProperties => {
  if (isDisabled || hasError) return {};

  const checked = isChecked ? 'checked' : 'unchecked';
  const backgroundColor = hoverTokens.default.background[checked];
  const borderColor = hoverTokens.default.border?.[checked];

  return {
    ['--selector-hover-background-color' as string]: getIn(theme, backgroundColor),
    ['--selector-hover-border-color' as string]: borderColor
      ? getIn(theme, borderColor)
      : 'transparent',
    ['--duration-2xquick' as string]: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
  };
};

const _SelectorInput: React.ForwardRefRenderFunction<Klear360ElementRef, SelectorInputProps> = (
  {
    id,
    inputProps,
    isChecked,
    isDisabled,
    hasError,
    hoverTokens,
    tabIndex,
    accessibilityLabel,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const mergedRef = useMergeRefs(ref, inputProps.ref);

  return (
    <input
      id={id}
      className={styles.input}
      style={getHoverStyleVars({
        theme,
        isChecked,
        isDisabled,
        hasError,
        hoverTokens,
      })}
      disabled={isDisabled}
      tabIndex={tabIndex}
      {...inputProps}
      {...makeAccessible({ label: accessibilityLabel })}
      {...makeAnalyticsAttribute(rest)}
      ref={mergedRef as React.Ref<HTMLInputElement>}
    />
  );
};

const SelectorInput = assignWithoutSideEffects(React.forwardRef(_SelectorInput), {
  displayName: 'SelectorInput',
});

export { SelectorInput };
