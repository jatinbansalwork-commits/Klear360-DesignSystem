import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './skeleton.module.css';
import { getSpacingValue } from '~utils/styledProps/spacingUtils';

/**
 * @typedef {'none' | '2xsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | 'max' | 'round'} SkeletonBorderRadius
 */

/**
 * @typedef {Object} SkeletonVariants
 * @property {SkeletonBorderRadius} [borderRadius]
 */

export const skeletonStyles = cva(styles.skeleton, {
  variants: {
    borderRadius: {
      none: styles['radius-none'],
      '2xsmall': styles['radius-2xsmall'],
      xsmall: styles['radius-xsmall'],
      small: styles['radius-small'],
      medium: styles['radius-medium'],
      large: styles['radius-large'],
      xlarge: styles['radius-xlarge'],
      '2xlarge': styles['radius-2xlarge'],
      max: styles['radius-max'],
      round: styles['radius-round'],
    },
  },
});

export const skeletonClass = styles.skeleton;

/**
 * @typedef {Object} SkeletonFlexProps
 * @property {'row' | 'row-reverse' | 'column' | 'column-reverse'} [flexDirection]
 * @property {'nowrap' | 'wrap' | 'wrap-reverse'} [flexWrap]
 * @property {'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'} [alignItems]
 * @property {'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch'} [justifyContent]
 * @property {'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'} [alignSelf]
 * @property {'auto' | 'start' | 'end' | 'center' | 'stretch'} [justifySelf]
 * @property {'auto' | 'start' | 'end' | 'center' | 'stretch'} [placeSelf]
 */

/** @type {Record<NonNullable<SkeletonFlexProps['alignItems']>, string>} */
const alignItemsToUtility = {
  'flex-start': 'items-start',
  'flex-end': 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

/** @type {Record<NonNullable<SkeletonFlexProps['justifyContent']>, string>} */
const justifyContentToUtility = {
  'flex-start': 'justify-start',
  'flex-end': 'justify-end',
  center: 'justify-center',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
  stretch: 'justify-stretch',
};

/** @type {Record<NonNullable<SkeletonFlexProps['alignSelf']>, string>} */
const alignSelfToUtility = {
  auto: 'align-self-auto',
  'flex-start': 'align-self-start',
  'flex-end': 'align-self-end',
  center: 'align-self-center',
  baseline: 'align-self-baseline',
  stretch: 'align-self-stretch',
};

/** @type {Record<NonNullable<SkeletonFlexProps['justifySelf']>, string>} */
const justifySelfToUtility = {
  auto: 'justify-self-auto',
  start: 'justify-self-start',
  end: 'justify-self-end',
  center: 'justify-self-center',
  stretch: 'justify-self-stretch',
};

/** @type {Record<NonNullable<SkeletonFlexProps['placeSelf']>, string>} */
const placeSelfToUtility = {
  auto: 'place-self-auto',
  start: 'place-self-start',
  end: 'place-self-end',
  center: 'place-self-center',
  stretch: 'place-self-stretch',
};

/**
 * Build the class string for a Skeleton element. Combines the base/keyframe class,
 * the borderRadius CVA variant, and any flex enum utility classes that have a
 * predefined utility match.
 * @param {SkeletonVariants & SkeletonFlexProps & { className?: string }} props
 * @returns {string}
 */
export function getSkeletonClasses(props) {
  const {
    borderRadius,
    flexDirection,
    flexWrap,
    alignItems,
    justifyContent,
    alignSelf,
    justifySelf,
    placeSelf,
    className,
  } = props;

  const cvaClasses = skeletonStyles({ borderRadius });
  /** @type {string[]} */
  const utilities = [];

  if (flexDirection) {
    utilities.push(
      utilityClasses[
        /** @type {keyof typeof utilityClasses} */ (`flex-direction-${flexDirection}`)
      ],
    );
  }
  if (flexWrap) {
    utilities.push(
      utilityClasses[/** @type {keyof typeof utilityClasses} */ (`flex-wrap-${flexWrap}`)],
    );
  }
  if (alignItems) {
    utilities.push(
      utilityClasses[/** @type {keyof typeof utilityClasses} */ (alignItemsToUtility[alignItems])],
    );
  }
  if (justifyContent) {
    utilities.push(
      utilityClasses[
        /** @type {keyof typeof utilityClasses} */ (justifyContentToUtility[justifyContent])
      ],
    );
  }
  if (alignSelf) {
    utilities.push(
      utilityClasses[/** @type {keyof typeof utilityClasses} */ (alignSelfToUtility[alignSelf])],
    );
  }
  if (justifySelf) {
    utilities.push(
      utilityClasses[
        /** @type {keyof typeof utilityClasses} */ (justifySelfToUtility[justifySelf])
      ],
    );
  }
  if (placeSelf) {
    utilities.push(
      utilityClasses[/** @type {keyof typeof utilityClasses} */ (placeSelfToUtility[placeSelf])],
    );
  }

  return [cvaClasses, ...utilities, className].filter(Boolean).join(' ');
}

/**
 * @typedef {Object} SkeletonInlineStyleProps
 * @property {string} [width]
 * @property {string} [maxWidth]
 * @property {string} [minWidth]
 * @property {string} [height]
 * @property {string} [maxHeight]
 * @property {string} [minHeight]
 * @property {string} [alignContent]
 * @property {string} [justifyItems]
 * @property {string} [placeItems]
 * @property {number} [flexGrow]
 * @property {number} [flexShrink]
 * @property {string} [flexBasis]
 * @property {number} [order]
 */

/**
 * Build the inline style string for a Skeleton element. Covers arbitrary dimension
 * values and the flex/grid props that don't have a matching utility class.
 *
 * Returns `undefined` when no inline style is needed so the consumer can omit the
 * `style` attribute entirely.
 * @param {SkeletonInlineStyleProps} props
 * @returns {string | undefined}
 */
export function getSkeletonInlineStyle(props) {
  /** @type {string[]} */
  const declarations = [];

  /**
   * @param {string} key
   * @param {string | undefined} value
   * @returns {void}
   */
  const dimension = (key, value) => {
    if (value === undefined) return;
    const resolved = getSpacingValue(value);
    if (resolved !== undefined) {
      declarations.push(`${key}: ${resolved}`);
    }
  };

  dimension('width', props.width);
  dimension('max-width', props.maxWidth);
  dimension('min-width', props.minWidth);
  dimension('height', props.height);
  dimension('max-height', props.maxHeight);
  dimension('min-height', props.minHeight);

  if (props.alignContent !== undefined) {
    declarations.push(`align-content: ${props.alignContent}`);
  }
  if (props.justifyItems !== undefined) {
    declarations.push(`justify-items: ${props.justifyItems}`);
  }
  if (props.placeItems !== undefined) {
    declarations.push(`place-items: ${props.placeItems}`);
  }
  if (props.flexGrow !== undefined) {
    declarations.push(`flex-grow: ${props.flexGrow}`);
  }
  if (props.flexShrink !== undefined) {
    declarations.push(`flex-shrink: ${props.flexShrink}`);
  }
  if (props.flexBasis !== undefined) {
    const resolved = getSpacingValue(props.flexBasis);
    if (resolved !== undefined) {
      declarations.push(`flex-basis: ${resolved}`);
    }
  }
  if (props.order !== undefined) {
    declarations.push(`order: ${props.order}`);
  }

  return declarations.length > 0 ? declarations.join('; ') : undefined;
}
