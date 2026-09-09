/**
 * Font size and line height types matching BaseText
 * @typedef {25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100} FontSize
 */
/**
 * @typedef {0 | 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100} LineHeight
 */

/** @typedef {'body' | 'caption'} TextVariant */
/** @typedef {'xsmall' | 'small' | 'medium' | 'large'} TextSize */
/** @typedef {'regular' | 'medium' | 'semibold'} TextWeight */
/** @typedef {'p' | 'span' | 'div' | 'abbr' | 'figcaption' | 'cite' | 'q' | 'label'} TextAs */

/** @type {readonly TextAs[]} */
export const validTextAsValues = ['p', 'span', 'div', 'abbr', 'figcaption', 'cite', 'q', 'label'];

/**
 * @typedef {Object} TextPropsResult
 * @property {string} [color]
 * @property {FontSize} fontSize
 * @property {TextWeight} fontWeight
 * @property {'normal'} fontStyle
 * @property {LineHeight} lineHeight
 * @property {25 | 50 | 100} [letterSpacing]
 * @property {'text'} fontFamily
 * @property {'text'} componentName
 * @property {string} [testID]
 * @property {'left' | 'center' | 'right' | 'justify'} [textAlign]
 * @property {'none' | 'underline' | 'line-through'} [textDecorationLine]
 */

/**
 * Get BaseText props from Text props
 * Converts Text component props to BaseText props with appropriate font sizes and line heights
 * These values correspond to BaseText utility classes (font-size-25, font-size-75, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 * @param {{
 *   variant: TextVariant,
 *   weight?: TextWeight,
 *   size?: TextSize | undefined,
 *   color?: string,
 *   testID?: string,
 *   textAlign?: 'left' | 'center' | 'right' | 'justify',
 *   textDecorationLine?: 'none' | 'underline' | 'line-through',
 * }} params
 * @returns {TextPropsResult}
 */
export function getTextProps({
  variant,
  weight,
  size,
  color = 'surface.text.gray.normal',
  testID,
  textAlign,
  textDecorationLine,
}) {
  /** @type {TextPropsResult} */
  const props = {
    color,
    fontSize: 100,
    fontWeight: weight ?? 'regular',
    fontStyle: 'normal',
    lineHeight: 100,
    fontFamily: 'text',
    componentName: 'text',
    testID,
    textAlign,
    textDecorationLine,
  };

  if (variant === 'caption') {
    // Variant of caption can only have size of small or medium
    if (size && size !== 'small' && size !== 'medium') {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.error(
          `[Klear360: Text]: size cannot be '${size}' when variant is 'caption'. Only 'small' and 'medium' are allowed.`,
        );
      }
      // Set size as small in case of invalid size
      size = 'small';
    }
  } else if (!size) {
    // For body variant, default to medium if no size is provided
    size = 'medium';
  }

  if (variant === 'body') {
    if (size === 'xsmall') {
      props.fontSize = 25;
      props.lineHeight = 25;
      props.letterSpacing = 50;
    }
    if (size === 'small') {
      props.fontSize = 75;
      props.lineHeight = 75;
      props.letterSpacing = 50;
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 100;
      props.letterSpacing = 50;
    }
    if (size === 'large') {
      props.fontSize = 200;
      props.lineHeight = 200;
      props.letterSpacing = 25;
    }
  }
  if (variant === 'caption') {
    if (size === 'small') {
      props.fontSize = 50;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
      props.letterSpacing = 50;
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
      props.letterSpacing = 50;
    }
  }

  return props;
}
