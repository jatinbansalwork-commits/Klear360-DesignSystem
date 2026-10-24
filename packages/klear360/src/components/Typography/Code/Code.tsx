import React from 'react';
import { makeTypographySize } from '~utils/makeTypographySize';
import { useTheme } from '~components/Klear360Provider';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import { getPlatformType, isAndroid } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { FontSize, Typography } from '~tokens/global';
import type { Klear360ElementRef, StringChildrenType, TestID } from '~utils/types';
import { makeSpace } from '~utils/makeSpace';
import { throwKlear360Error } from '~utils/logger';

type CodeCommonProps = {
  /**
   * Sets the color of the Heading component.
   */
  children: StringChildrenType;
  /**
   * Decides the fontSize and padding of Code
   *
   * @default small
   */
  size?: Extract<BaseTextSizes, 'small' | 'medium'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'bold'>;
  isHighlighted?: boolean;
  textTransform?: BaseTextProps['textTransform'];
  color?: BaseTextProps['color'];
} & TestID &
  StyledPropsKlear360;

type CodeHighlightedProps = CodeCommonProps & {
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted?: true;
  /**
   * color prop can only be added when `isHighlighted` is set to `false`
   */
  color?: undefined;
};

type CodeNonHighlightedProps = CodeCommonProps & {
  /**
   * Adds background color to highlight the text
   *
   * @default true
   */
  isHighlighted: false;
  /**
   * color prop to set color of text when `isHighlighted` is set to false
   */
  color?: BaseTextProps['color'];
};

export type CodeProps = CodeHighlightedProps | CodeNonHighlightedProps;

const platformType = getPlatformType();
const isPlatformWeb = platformType === 'browser' || platformType === 'node';

const getCodeFontSizeAndLineHeight = (
  size: CodeProps['size'],
):
  | {
      fontSize: keyof FontSize;
      lineHeight: keyof Typography['lineHeights'];
      letterSpacing: keyof Typography['letterSpacings'];
    }
  | undefined => {
  switch (size) {
    case 'medium':
      return { fontSize: 75, lineHeight: 75, letterSpacing: 100 };
    case 'small':
      return { fontSize: 25, lineHeight: 25, letterSpacing: 100 };
    default:
      if (__DEV__) {
        throwKlear360Error({
          moduleName: 'Code',
          message: `Unexpected size: ${size}`,
        });
      }
      return undefined;
  }
};

const getCodeColor = ({
  isHighlighted,
  color,
}: Pick<CodeProps, 'isHighlighted' | 'color'>): CodeProps['color'] => {
  if (isHighlighted) {
    if (__DEV__) {
      if (color) {
        throwKlear360Error({
          moduleName: 'Code',
          message: '`color` prop cannot be used without `isHighlighted={false}`',
        });
      }
    }

    return 'surface.text.gray.subtle';
  }

  if (color) {
    return color;
  }

  return 'surface.text.gray.normal';
};

const _Code = (
  {
    children,
    size = 'small',
    weight = 'regular',
    isHighlighted = true,
    color,
    testID,
    textTransform,
    ...styledProps
  }: CodeProps,
  ref: React.Ref<Klear360ElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const { fontSize, lineHeight, letterSpacing } = getCodeFontSizeAndLineHeight(size)!;
  const codeTextColor = React.useMemo<CodeProps['color']>(
    () => getCodeColor({ isHighlighted, color }),
    [isHighlighted, color],
  );

  const codeContainerStyle = React.useMemo((): React.CSSProperties => {
    return {
      padding: `${makeSpace(theme.spacing[0])} ${makeSpace(theme.spacing[2])}`,
      backgroundColor: isHighlighted ? theme.colors.feedback.background.neutral.subtle : undefined,
      borderRadius: theme.border.radius.xsmall,
      display: isPlatformWeb ? 'inline-block' : 'flex',
      alignSelf: isPlatformWeb ? undefined : 'center',
      verticalAlign: 'middle',
      lineHeight: makeTypographySize(theme.typography.lineHeights[0]),
    };
  }, [theme, isHighlighted]);

  return (
    <BaseBox
      ref={ref as never}
      as={isPlatformWeb ? 'span' : undefined}
      style={codeContainerStyle as never}
      {...metaAttribute({ name: MetaConstants.Code, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseText
        color={codeTextColor}
        fontFamily="code"
        fontSize={fontSize}
        fontWeight={weight}
        as={isPlatformWeb ? 'code' : undefined}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        textTransform={textTransform}
        // Android's default font padding nudges inline code up relative to adjacent text.
        style={(isAndroid() ? { includeFontPadding: false } : undefined) as never}
      >
        {children}
      </BaseText>
    </BaseBox>
  );
};

/**
 * Code component can be used for displaying token, variable names, or inlined code snippets.
 *
 * ## Usage
 *
 * ### In Web
 * In web, you can use it inside `Text` component or individually. The component is set to display `inline-block`
 *
 * ```tsx
 * <Text>
 *  Lorem ipsum <Code>SENTRY_TOKEN</Code> normal text
 * </Text>
 * ```
 *
 * ### In React Native
 *
 * In React Native, you would have to align it using flex to make sure the Code and the surrounding text is correctly aligned
 *
 * ```tsx
 *  <Box flexWrap="wrap" flexDirection="row" alignItems="flex-start">
 *   <Text>Lorem ipsum </Text>
 *   <Code>SENTRY_TOKEN</Code>
 *   <Text> normal text</Text>
 * </Box>
 * ```
 */
const Code = React.forwardRef(_Code);

export { Code };
