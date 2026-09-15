import { cva, cx } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './avatar.module.css';

// ===== Avatar outer wrapper CVA =====

/**
 * @typedef {Object} AvatarWrapperVariants
 * @property {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'} [size]
 * @property {'circle' | 'square'} [variant]
 * @property {boolean} [isInteractive]
 */

export const avatarWrapperStyles = cva(styles['avatar-wrapper'], {
  variants: {
    size: {
      xsmall: styles['size-xsmall'],
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
      xlarge: styles['size-xlarge'],
    },
    variant: {
      circle: styles['variant-circle'],
      square: styles['variant-square'],
    },
    isInteractive: {
      true: styles.interactive,
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'square', size: 'xsmall', class: styles['square-xsmall'] },
    { variant: 'square', size: 'small', class: styles['square-small'] },
    { variant: 'square', size: 'medium', class: styles['square-medium'] },
    { variant: 'square', size: 'large', class: styles['square-large'] },
    { variant: 'square', size: 'xlarge', class: styles['square-xlarge'] },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'circle',
    isInteractive: false,
  },
});

/**
 * @param {AvatarWrapperVariants} props
 * @returns {string}
 */
export function getAvatarWrapperClasses(props) {
  return avatarWrapperStyles(props);
}

// ===== AvatarButton inner element CVA =====

/**
 * @typedef {Object} AvatarButtonVariants
 * @property {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'} [size]
 * @property {'circle' | 'square'} [variant]
 * @property {'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral'} [color]
 * @property {boolean} [isInteractive]
 * @property {boolean} [isSelected]
 */

export const avatarButtonStyles = cva(styles['avatar-btn'], {
  variants: {
    size: {
      xsmall: styles['btn-size-xsmall'],
      small: styles['btn-size-small'],
      medium: styles['btn-size-medium'],
      large: styles['btn-size-large'],
      xlarge: styles['btn-size-xlarge'],
    },
    variant: {
      circle: styles['btn-variant-circle'],
      square: styles['btn-variant-square'],
    },
    color: {
      primary: styles['btn-color-primary'],
      positive: styles['btn-color-positive'],
      negative: styles['btn-color-negative'],
      notice: styles['btn-color-notice'],
      information: styles['btn-color-information'],
      neutral: styles['btn-color-neutral'],
    },
    isInteractive: {
      true: styles['btn-interactive'],
      false: '',
    },
    isSelected: {
      true: styles['btn-selected'],
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'square', size: 'xsmall', class: styles['btn-square-xsmall'] },
    { variant: 'square', size: 'small', class: styles['btn-square-small'] },
    { variant: 'square', size: 'medium', class: styles['btn-square-medium'] },
    { variant: 'square', size: 'large', class: styles['btn-square-large'] },
    { variant: 'square', size: 'xlarge', class: styles['btn-square-xlarge'] },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'circle',
    color: 'neutral',
    isInteractive: false,
    isSelected: false,
  },
});

/**
 * @param {AvatarButtonVariants} props
 * @returns {string}
 */
export function getAvatarButtonClasses(props) {
  return avatarButtonStyles(props);
}

/** Text color token for AvatarGroup overflow (+N) counter */
export const avatarGroupOverflowTextColorToken = /** @type {const} */ ('interactive.text.neutral.muted');

/**
 * AvatarGroup overflow (+N) body text size mapping (avatar size → Text size).
 * All sizes use Body/Semibold; xlarge uses Heading/SmallSemibold separately.
 */
export const avatarGroupOverflowTextSizeMapping = /** @type {const} */ ({
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
});

/**
 * @typedef {typeof avatarGroupOverflowTextSizeMapping[keyof typeof avatarGroupOverflowTextSizeMapping]} AvatarGroupOverflowBodyTextSize
 */

/**
 * @param {Exclude<NonNullable<AvatarGroupVariants['size']>, 'xlarge'>} size
 * @returns {AvatarGroupOverflowBodyTextSize}
 */
export function getAvatarGroupOverflowBodyTextSize(size) {
  return avatarGroupOverflowTextSizeMapping[size];
}

/**
 * Button classes for AvatarGroup overflow (+N) counter avatar.
 *
 * Builds on `color: 'neutral'` (kept inside the public color enum) and layers
 * a Svelte-only `btn-color-group-overflow` override on top to give the counter
 * its distinct panel-style background. The override is intentionally not
 * exposed via `AvatarButtonVariants['color']` so the public type stays aligned
 * with React's `AvatarProps['color']`.
 * @param {Pick<AvatarButtonVariants, 'size' | 'variant'>} props
 * @returns {string}
 */
export function getAvatarGroupOverflowButtonClasses(props) {
  return cx(
    avatarButtonStyles({
      ...props,
      color: 'neutral',
      isInteractive: false,
      isSelected: false,
    }),
    styles['btn-color-group-overflow'],
  );
}

// ===== AvatarGroup CVA =====

/** @typedef {'compact' | 'normal' | 'comfortable'} AvatarDensity */

/**
 * @typedef {Object} AvatarGroupVariants
 * @property {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'} [size]
 * @property {AvatarDensity} [density]
 */

export const avatarGroupStyles = cva(styles['avatar-group'], {
  variants: {
    // size variant carries no margin directly — all spacing is controlled by
    // density × size compound variants below, so that there is a single
    // authoritative source for every margin value regardless of density.
    size: {
      xsmall: '',
      small: '',
      medium: '',
      large: '',
      xlarge: '',
    },
    density: {
      normal: '',
      compact: '',
      comfortable: '',
    },
  },
  compoundVariants: [
    // normal density — same overlap as the original size-only classes
    { density: 'normal', size: 'xsmall', class: styles['group-size-xsmall'] },
    { density: 'normal', size: 'small', class: styles['group-size-small'] },
    { density: 'normal', size: 'medium', class: styles['group-size-medium'] },
    { density: 'normal', size: 'large', class: styles['group-size-large'] },
    { density: 'normal', size: 'xlarge', class: styles['group-size-xlarge'] },
    // compact density — tighter overlap
    { density: 'compact', size: 'xsmall', class: styles['group-density-compact-xsmall'] },
    { density: 'compact', size: 'small', class: styles['group-density-compact-small'] },
    { density: 'compact', size: 'medium', class: styles['group-density-compact-medium'] },
    { density: 'compact', size: 'large', class: styles['group-density-compact-large'] },
    { density: 'compact', size: 'xlarge', class: styles['group-density-compact-xlarge'] },
    // comfortable density — looser overlap
    { density: 'comfortable', size: 'xsmall', class: styles['group-density-comfortable-xsmall'] },
    { density: 'comfortable', size: 'small', class: styles['group-density-comfortable-small'] },
    { density: 'comfortable', size: 'medium', class: styles['group-density-comfortable-medium'] },
    { density: 'comfortable', size: 'large', class: styles['group-density-comfortable-large'] },
    { density: 'comfortable', size: 'xlarge', class: styles['group-density-comfortable-xlarge'] },
  ],
  defaultVariants: {
    size: 'medium',
    density: 'normal',
  },
});

/**
 * @param {AvatarGroupVariants} props
 * @returns {string}
 */
export function getAvatarGroupClasses(props) {
  return avatarGroupStyles(props);
}

// ===== Token maps =====

/**
 * Avatar icon size mapping (avatar size → icon size)
 */
export const avatarIconSizeTokens = /** @type {const} */ ({
  xsmall: 'small',
  small: 'medium',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
});

/**
 * Avatar text size mapping (avatar size → text size)
 */
export const avatarTextSizeMapping = /** @type {const} */ ({
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
  xlarge: 'medium',
});

/**
 * Avatar bottom addon size mapping (avatar size → icon size)
 */
export const avatarToBottomAddonSize = /** @type {const} */ ({
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
  xlarge: 'large',
});

/**
 * Avatar top addon (Indicator) size mapping
 */
export const avatarToIndicatorSize = /** @type {const} */ ({
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
  xlarge: 'large',
});

// ===== Template classes (prevent Svelte tree-shaking) =====

/**
 * Get all Avatar component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 * @returns {Record<string, string>}
 */
export function getAvatarTemplateClasses() {
  return {
    // Root + body wrapper
    avatarRoot: styles['avatar-root'],
    avatarWrapper: styles['avatar-wrapper'],
    interactive: styles.interactive,
    // Button
    avatarBtn: styles['avatar-btn'],
    btnContent: styles['btn-content'],
    btnInteractive: styles['btn-interactive'],
    btnSelected: styles['btn-selected'],
    // Addon containers
    topAddon: styles['top-addon'],
    bottomAddon: styles['bottom-addon'],
    // Top addon offsets - circle
    topAddonCircleXsmall: styles['top-addon-circle-xsmall'],
    topAddonCircleSmall: styles['top-addon-circle-small'],
    topAddonCircleMedium: styles['top-addon-circle-medium'],
    topAddonCircleLarge: styles['top-addon-circle-large'],
    topAddonCircleXlarge: styles['top-addon-circle-xlarge'],
    // Top addon offsets - square
    topAddonSquareXsmall: styles['top-addon-square-xsmall'],
    topAddonSquareSmall: styles['top-addon-square-small'],
    topAddonSquareMedium: styles['top-addon-square-medium'],
    topAddonSquareLarge: styles['top-addon-square-large'],
    topAddonSquareXlarge: styles['top-addon-square-xlarge'],
    // Bottom addon offsets
    bottomAddonCircle: styles['bottom-addon-circle'],
    bottomAddonSquare: styles['bottom-addon-square'],
    // Group
    avatarGroup: styles['avatar-group'],
    // Group density compact
    groupDensityCompactXsmall: styles['group-density-compact-xsmall'],
    groupDensityCompactSmall: styles['group-density-compact-small'],
    groupDensityCompactMedium: styles['group-density-compact-medium'],
    groupDensityCompactLarge: styles['group-density-compact-large'],
    groupDensityCompactXlarge: styles['group-density-compact-xlarge'],
    // Group density comfortable
    groupDensityComfortableXsmall: styles['group-density-comfortable-xsmall'],
    groupDensityComfortableSmall: styles['group-density-comfortable-small'],
    groupDensityComfortableMedium: styles['group-density-comfortable-medium'],
    groupDensityComfortableLarge: styles['group-density-comfortable-large'],
    groupDensityComfortableXlarge: styles['group-density-comfortable-xlarge'],
  };
}

/**
 * Get the top addon position class for a given variant and size.
 * @param {'circle' | 'square'} variant
 * @param {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'} size
 * @returns {string}
 */
export function getTopAddonClass(variant, size) {
  const key = /** @type {keyof typeof styles} */ (`top-addon-${variant}-${size}`);
  return styles[key] || '';
}

/**
 * Get the bottom addon position class for a given variant.
 * @param {'circle' | 'square'} variant
 * @returns {string}
 */
export function getBottomAddonClass(variant) {
  const key = /** @type {keyof typeof styles} */ (`bottom-addon-${variant}`);
  return styles[key] || '';
}
