/**
 * Font size and line height types matching BaseText
 * @typedef {25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100} FontSize
 */
/**
 * @typedef {0 | 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100} LineHeight
 */

/** @typedef {'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'} HeadingSize */
/** @typedef {'regular' | 'medium' | 'semibold'} HeadingWeight */
/** @typedef {'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} HeadingAs */

/** @type {readonly HeadingAs[]} */
export const validHeadingAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * @typedef {Object} HeadingPropsResult
 * @property {string} [color]
 * @property {FontSize} fontSize
 * @property {HeadingWeight} fontWeight
 * @property {'normal'} fontStyle
 * @property {LineHeight} lineHeight
 * @property {'heading'} fontFamily
 * @property {Record<string, never>} accessibilityProps
 * @property {'heading'} componentName
 * @property {string} [testID]
 * @property {HeadingAs} as
 */

/**
 * Get BaseText props from Heading props
 * Converts Heading component props to BaseText props with appropriate font sizes and line heights
 * These values correspond to BaseText utility classes (font-size-300, font-size-400, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 * @param {{
 *   as?: HeadingAs,
 *   size: HeadingSize,
 *   weight: HeadingWeight,
 *   color?: string,
 *   testID?: string,
 * }} params
 * @returns {HeadingPropsResult}
 */
export function getHeadingProps({ as, size, weight, color, testID }) {
  const finalSize = size ?? 'small';
  const finalWeight = weight ?? 'semibold';

  /** @type {HeadingPropsResult} */
  const props = {
    color,
    fontSize: 300,
    fontWeight: finalWeight,
    fontStyle: 'normal',
    lineHeight: 300,
    fontFamily: 'heading',
    accessibilityProps: {},
    componentName: 'heading',
    testID,
    as: 'h6',
  };

  if (finalSize === 'small') {
    props.fontSize = 300;
    props.lineHeight = 300;
    props.as = 'h6';
  } else if (finalSize === 'medium') {
    props.fontSize = 400;
    props.lineHeight = 400;
    props.as = 'h5';
  } else if (finalSize === 'large') {
    props.fontSize = 500;
    props.lineHeight = 500;
    props.as = 'h4';
  } else if (finalSize === 'xlarge') {
    props.fontSize = 600;
    props.lineHeight = 600;
    props.as = 'h3';
  } else if (finalSize === '2xlarge') {
    props.fontSize = 700;
    props.lineHeight = 700;
    props.as = 'h2';
  }

  // Override the computed `as` prop if user passed an `as` prop
  props.as = as ?? props.as;
  return props;
}
