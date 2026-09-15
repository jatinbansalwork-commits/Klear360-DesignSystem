/**
 * Utilities for handling styled props (CSS properties as props)
 * Framework-agnostic utilities that can be used across all component implementations
 */

/**
 * StyledPropsKlear360 type - defines CSS properties that can be passed as props to components
 * These props are converted to CSS classes or inline styles
 *
 * @typedef {Partial<{
 *   margin: string | string[],
 *   marginX: string,
 *   marginY: string,
 *   marginTop: string,
 *   marginBottom: string,
 *   marginLeft: string,
 *   marginRight: string,
 *   display: string,
 *   visibility: string,
 *   alignSelf: string,
 *   justifySelf: string,
 *   placeSelf: string,
 *   order: number | string,
 *   flexWrap: string,
 *   position: string,
 *   zIndex: number | string,
 *   top: string,
 *   right: string,
 *   bottom: string,
 *   left: string,
 *   gridColumn: string,
 *   gridRow: string,
 *   gridRowStart: string,
 *   gridRowEnd: string,
 *   gridColumnStart: string,
 *   gridColumnEnd: string,
 *   gridArea: string,
 * }>} StyledPropsKlear360
 */

/**
 * Removing undefined styledProps because when used with spread operator,
 * undefined can override the earlier defined values.
 * @param {Record<string, any>} obj
 * @returns {StyledPropsKlear360}
 */
const removeUndefinedStyledProps = (obj) => {
  /** @type {StyledPropsKlear360} */
  const onlyDefinedStyledProps = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore: complex type error
      onlyDefinedStyledProps[key] = obj[key];
    }
  }
  return onlyDefinedStyledProps;
};

/**
 * - Removes the props that are not styledProps
 * - Returns all the styled props along with undefined values.
 *
 * Can be used in generating storybook docs and testing the possible props.
 *
 * **Use `getStyledProps` instead if you're using this for adding styledProps!**
 * @param {Record<string, any>} props
 * @returns {StyledPropsKlear360}
 */
const makeStyledProps = (props) => {
  return {
    alignSelf: props.alignSelf,
    display: props.display,
    justifySelf: props.justifySelf,
    placeSelf: props.placeSelf,
    order: props.order,
    position: props.position,
    zIndex: props.zIndex,
    gridColumn: props.gridColumn,
    gridColumnStart: props.gridColumnStart,
    gridColumnEnd: props.gridColumnEnd,
    gridRow: props.gridRow,
    gridRowStart: props.gridRowStart,
    gridRowEnd: props.gridRowEnd,
    gridArea: props.gridArea,
    margin: props.margin,
    marginX: props.marginX,
    marginY: props.marginY,
    marginBottom: props.marginBottom,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginLeft: props.marginLeft,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
    visibility: props.visibility,
    flexWrap: props.flexWrap,
  };
};

/**
 * Extracts styled props from a props object, removing undefined values.
 *
 * ## Usage
 *
 * ```ts
 * const props = {
 *   marginX: 'spacing.3',
 *   display: 'flex',
 *   someOtherProp: 'value',
 * };
 *
 * const styledProps = getStyledProps(props);
 * // Returns: { marginX: 'spacing.3', display: 'flex' }
 * ```
 * @param {Record<string, any>} props
 * @returns {StyledPropsKlear360}
 */
export const getStyledProps = (props) => {
  return removeUndefinedStyledProps(makeStyledProps(props));
};

export { makeStyledProps, removeUndefinedStyledProps };
