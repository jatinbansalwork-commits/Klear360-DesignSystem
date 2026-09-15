import React from 'react';
import { indicatorDotSizes, textSizeMapping } from './indicatorTokens';
import { useTheme } from '~components/Klear360Provider';
import BaseBox from '~components/Box/BaseBox';
import Svg from '~components/Icons/_Svg';
import Circle from '~components/Icons/_Svg/Circle';
import { Text } from '~components/Typography';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import { isReactNative } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

/**
 * @typedef {{
 *   color?: import('~tokens/theme/theme').FeedbackColors | 'primary',
 *   emphasis?: 'subtle' | 'intense',
 *   size?: 'small' | 'medium' | 'large',
 *   children?: import('~utils/types').StringChildrenType,
 *   accessibilityLabel?: string,
 * } & import('~utils/types').TestID
 *   & import('~utils/types').DataAnalyticsAttribute
 *   & import('~components/Box/styledProps').StyledPropsKlear360} IndicatorProps
 *
 * - `color` — sets the color tone. Default `neutral`.
 * - `emphasis` — sets the emphasis of the indicator; `intense` shows a background circle. Default `subtle`.
 * - `size` — size of the indicator. Default `medium`.
 * - `children` — a text label to show alongside the indicator dot.
 * - `accessibilityLabel` — a11y label for screen readers.
 */

/**
 * @param {IndicatorProps} props
 * @param {React.Ref<import('~utils/types').Klear360ElementRef>} ref
 * @returns {React.ReactElement}
 */
const _Indicator = (
  {
    accessibilityLabel,
    children,
    size = 'medium',
    color = 'neutral',
    emphasis = 'subtle',
    testID,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const childrenString = getStringFromReactText(children);
  const isIntense = emphasis === 'intense';
  const isPrimary = color === 'primary';

  const fillColorOuter = isPrimary
    ? theme.colors.surface.background.primary.subtle
    : theme.colors.feedback.background[color].subtle;
  const fillColorInner = isPrimary
    ? theme.colors.surface.icon.primary.normal
    : theme.colors.feedback.icon[color].intense;

  const isWeb = !isReactNative();
  const a11yProps = makeAccessible({
    label: accessibilityLabel ?? childrenString,
    ...(isWeb && { role: 'status' }),
  });

  const svgSize = isIntense
    ? indicatorDotSizes[emphasis][size].outer
    : indicatorDotSizes[emphasis][size].inner;

  return (
    <BaseBox
      ref={/** @type {never} */ (ref)}
      display={/** @type {never} */ (isWeb ? 'inline-flex' : 'flex')}
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.Indicator, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox display="flex" flexDirection="row" alignItems="center">
        <Svg width={String(svgSize)} height={String(svgSize)} viewBox="0 0 10 10" fill="none">
          {isIntense ? (
            <>
              <Circle cx="5" cy="5" r="5" fill={fillColorOuter} />
              <Circle cx="5" cy="5" r="2.5" fill={fillColorInner} />
            </>
          ) : (
            <Circle cx="5" cy="5" r="5" fill={fillColorInner} />
          )}
        </Svg>
        <BaseBox marginLeft={childrenString ? 'spacing.2' : 'spacing.0'}>
          <Text
            weight="medium"
            color="surface.text.gray.subtle"
            textAlign="left"
            size={textSizeMapping[size]}
          >
            {children}
          </Text>
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

const Indicator = assignWithoutSideEffects(React.forwardRef(_Indicator), {
  componentId: 'Indicator',
});

export { Indicator };
