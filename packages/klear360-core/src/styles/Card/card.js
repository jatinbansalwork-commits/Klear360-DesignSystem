import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './card.module.css';

// --- CardRoot CVA ---

/**
 * @typedef {Object} CardRootVariants
 * @property {'medium' | 'large' | 'xlarge'} [borderRadius]
 * @property {boolean} [asLabel]
 */

export const cardRootStyles = cva(styles.cardRoot, {
  variants: {
    borderRadius: {
      medium: utilityClasses['border-radius-medium'],
      large: utilityClasses['border-radius-large'],
      xlarge: utilityClasses['border-radius-xlarge'],
    },
    asLabel: {
      true: styles.cardRootLabel,
      false: '',
    },
  },
  defaultVariants: {
    borderRadius: 'medium',
    asLabel: false,
  },
});

// --- CardSurface CVA ---

/**
 * @typedef {'surface.background.gray.subtle' | 'surface.background.gray.moderate' | 'surface.background.gray.intense'} CardGrayBackgroundColor
 */

/** Colored surface tokens available only on `theme` variant. */
/**
 * @typedef {'surface.background.primary.subtle' | 'surface.background.primary.intense' | 'surface.background.sea.subtle' | 'surface.background.sea.intense' | 'surface.background.cloud.subtle' | 'surface.background.cloud.intense'} CardThemeBackgroundColor
 */

/** @typedef {CardGrayBackgroundColor | CardThemeBackgroundColor} CardBackgroundColor */

/**
 * Visual treatment of the Card surface.
 *
 * - `primary`: elevated styling (gradients, drop shadow) with
 *   `surface.background.gray.intense` background.
 * - `secondary`: flat styling with `surface.background.gray.moderate` background.
 * - `theme`: primary elevation (white bottom inset lip, drop shadow)
 *   with black 2% top/bottom gradients and configurable backgroundColor.
 * @typedef {'primary' | 'secondary' | 'theme'} CardType
 */

/**
 * Resolves the effective surface background color for a given Card `type`.
 *
 * `primary` and `secondary` own their background and ignore the
 * `backgroundColor` prop. `theme` defers to the configurable
 * `backgroundColor` (defaulting to primary subtle when unset).
 * @param {CardType} type
 * @param {CardBackgroundColor} [backgroundColor]
 * @returns {CardBackgroundColor}
 */
export const getCardBackgroundColor = (type, backgroundColor) => {
  switch (type) {
    case 'secondary':
      return 'surface.background.gray.moderate';
    case 'theme':
      return backgroundColor ?? 'surface.background.primary.subtle';
    case 'primary':
    default:
      return 'surface.background.gray.intense';
  }
};

/**
 * @typedef {Object} CardSurfaceVariants
 * @property {CardType} [type]
 * @property {CardBackgroundColor} [backgroundColor]
 * @property {'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'} [padding]
 * @property {'medium' | 'large' | 'xlarge'} [borderRadius]
 */

// `type` selects elevated (primary, theme) vs flat (secondary)
// surface treatment in card.module.css. The deprecated `elevation` prop on
// <Card> is a no-op for API parity with React's Card.
export const cardSurfaceStyles = cva(styles.cardSurface, {
  variants: {
    type: {
      primary: styles.cardSurfaceElevated,
      secondary: styles.cardSurfaceFlat,
      theme: styles.cardSurfaceThemed,
    },
    backgroundColor: {
      'surface.background.gray.subtle': utilityClasses['background-surface-gray-subtle'],
      'surface.background.gray.moderate': utilityClasses['background-surface-gray-moderate'],
      'surface.background.gray.intense': utilityClasses['background-surface-gray-intense'],
      'surface.background.primary.subtle':
        utilityClasses['background-surface-background-primary-subtle'],
      'surface.background.primary.intense':
        utilityClasses['background-surface-background-primary-intense'],
      'surface.background.sea.subtle': utilityClasses['background-surface-background-sea-subtle'],
      'surface.background.sea.intense': utilityClasses['background-surface-background-sea-intense'],
      'surface.background.cloud.subtle':
        utilityClasses['background-surface-background-cloud-subtle'],
      'surface.background.cloud.intense':
        utilityClasses['background-surface-background-cloud-intense'],
    },
    padding: {
      'spacing.0': utilityClasses['padding-spacing-0'],
      'spacing.3': utilityClasses['padding-spacing-3'],
      'spacing.4': utilityClasses['padding-spacing-4'],
      'spacing.5': utilityClasses['padding-spacing-5'],
      'spacing.7': utilityClasses['padding-spacing-7'],
    },
    borderRadius: {
      medium: utilityClasses['border-radius-medium'],
      large: utilityClasses['border-radius-large'],
      xlarge: utilityClasses['border-radius-xlarge'],
    },
  },
  defaultVariants: {
    type: 'primary',
    padding: 'spacing.7',
    borderRadius: 'medium',
  },
});

/** @type {readonly CardBackgroundColor[]} */
const CARD_SURFACE_BACKGROUND_COLOR_KEYS = [
  'surface.background.gray.subtle',
  'surface.background.gray.moderate',
  'surface.background.gray.intense',
  'surface.background.primary.subtle',
  'surface.background.primary.intense',
  'surface.background.sea.subtle',
  'surface.background.sea.intense',
  'surface.background.cloud.subtle',
  'surface.background.cloud.intense',
];

/** @type {Record<CardBackgroundColor, string>} */
export const CARD_SURFACE_BACKGROUND_UTILITY = {
  'surface.background.gray.subtle': utilityClasses['background-surface-gray-subtle'],
  'surface.background.gray.moderate': utilityClasses['background-surface-gray-moderate'],
  'surface.background.gray.intense': utilityClasses['background-surface-gray-intense'],
  'surface.background.primary.subtle':
    utilityClasses['background-surface-background-primary-subtle'],
  'surface.background.primary.intense':
    utilityClasses['background-surface-background-primary-intense'],
  'surface.background.sea.subtle': utilityClasses['background-surface-background-sea-subtle'],
  'surface.background.sea.intense': utilityClasses['background-surface-background-sea-intense'],
  'surface.background.cloud.subtle': utilityClasses['background-surface-background-cloud-subtle'],
  'surface.background.cloud.intense': utilityClasses['background-surface-background-cloud-intense'],
};

/**
 * @param {CardBackgroundColor} backgroundColor
 * @returns {string}
 */
export function getCardSurfaceBackgroundUtilityClass(backgroundColor) {
  return CARD_SURFACE_BACKGROUND_UTILITY[backgroundColor];
}

/**
 * @param {string} value
 * @returns {value is CardBackgroundColor}
 */
export function isCardBackgroundColor(value) {
  return /** @type {readonly string[]} */ (CARD_SURFACE_BACKGROUND_COLOR_KEYS).includes(value);
}

/**
 * Pulls a {@link CardBackgroundColor} token out of a space-separated class string.
 * @param {string | undefined} classNames
 * @returns {{ backgroundColor?: CardBackgroundColor, remainingClassNames?: string }}
 */
export function extractCardBackgroundColorFromClassNames(classNames) {
  const trimmed = classNames?.trim();
  if (!trimmed) {
    return {};
  }

  const tokens = trimmed.split(/\s+/);
  const backgroundColor = tokens.find(isCardBackgroundColor);

  if (!backgroundColor) {
    return { remainingClassNames: trimmed };
  }

  const remainingClassNames = tokens.filter((token) => token !== backgroundColor).join(' ');

  return {
    backgroundColor,
    remainingClassNames: remainingClassNames || undefined,
  };
}

/**
 * @typedef {Object} GetCardSurfaceClassesParams
 * @property {CardType} [type]
 * @property {CardBackgroundColor} [backgroundColor]
 * @property {CardSurfaceVariants['padding']} [padding]
 * @property {CardSurfaceVariants['borderRadius']} [borderRadius]
 */

/**
 * Surface class list for {@link CardSurface}: CVA layout, type, and token background utilities.
 * @param {GetCardSurfaceClassesParams} params
 * @returns {string}
 */
export function getCardSurfaceClasses({
  type = 'primary',
  backgroundColor,
  padding = 'spacing.7',
  borderRadius = 'medium',
}) {
  return cardSurfaceStyles({
    type,
    backgroundColor: getCardBackgroundColor(type, backgroundColor),
    padding,
    borderRadius,
  });
}

// --- CardHeader ---

/**
 * @typedef {Object} CardHeaderVariants
 * @property {'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'} [paddingBottom]
 * @property {'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'} [marginBottom]
 */

const cardHeaderWrapperStyles = cva(styles.cardHeader, {
  variants: {
    marginBottom: {
      'spacing.0': utilityClasses['margin-bottom-spacing-0'],
      'spacing.3': utilityClasses['margin-bottom-spacing-3'],
      'spacing.4': utilityClasses['margin-bottom-spacing-4'],
      'spacing.5': utilityClasses['margin-bottom-spacing-5'],
      'spacing.7': utilityClasses['margin-bottom-spacing-7'],
    },
  },
  defaultVariants: {
    marginBottom: 'spacing.4',
  },
});

const cardHeaderContentStyles = cva(styles.cardHeaderContent, {
  variants: {
    paddingBottom: {
      'spacing.0': utilityClasses['padding-bottom-spacing-0'],
      'spacing.3': utilityClasses['padding-bottom-spacing-3'],
      'spacing.4': utilityClasses['padding-bottom-spacing-4'],
      'spacing.5': utilityClasses['padding-bottom-spacing-5'],
      'spacing.7': utilityClasses['padding-bottom-spacing-7'],
    },
  },
  defaultVariants: {
    paddingBottom: 'spacing.4',
  },
});

/**
 * @param {CardHeaderVariants} props
 * @returns {{ wrapper: string, content: string }}
 */
export function getCardHeaderClasses(props) {
  return {
    wrapper: cardHeaderWrapperStyles({ marginBottom: props.marginBottom }),
    content: cardHeaderContentStyles({ paddingBottom: props.paddingBottom }),
  };
}

// --- CardFooter ---

/**
 * @typedef {Object} CardFooterVariants
 * @property {'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'} [paddingTop]
 * @property {'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'} [marginTop]
 * @property {boolean} [justifyEnd]
 */

const cardFooterWrapperStyles = cva(styles.cardFooter, {
  variants: {
    marginTop: {
      'spacing.0': utilityClasses['margin-top-spacing-0'],
      'spacing.3': utilityClasses['margin-top-spacing-3'],
      'spacing.4': utilityClasses['margin-top-spacing-4'],
      'spacing.5': utilityClasses['margin-top-spacing-5'],
      'spacing.7': utilityClasses['margin-top-spacing-7'],
    },
  },
  defaultVariants: {
    marginTop: 'spacing.4',
  },
});

const cardFooterContentStyles = cva(styles.cardFooterContent, {
  variants: {
    paddingTop: {
      'spacing.0': utilityClasses['padding-top-spacing-0'],
      'spacing.3': utilityClasses['padding-top-spacing-3'],
      'spacing.4': utilityClasses['padding-top-spacing-4'],
      'spacing.5': utilityClasses['padding-top-spacing-5'],
      'spacing.7': utilityClasses['padding-top-spacing-7'],
    },
    justifyEnd: {
      true: styles.cardFooterContentEnd,
      false: '',
    },
  },
  defaultVariants: {
    paddingTop: 'spacing.4',
    justifyEnd: false,
  },
});

/**
 * @param {CardFooterVariants} props
 * @returns {{ wrapper: string, content: string }}
 */
export function getCardFooterClasses(props) {
  return {
    wrapper: cardFooterWrapperStyles({ marginTop: props.marginTop }),
    content: cardFooterContentStyles({
      paddingTop: props.paddingTop,
      justifyEnd: props.justifyEnd,
    }),
  };
}

/**
 * Get template classes to prevent Svelte tree-shaking.
 * Call this function in component script blocks.
 * @returns {Record<string, string>}
 */
export function getCardTemplateClasses() {
  return {
    cardRoot: styles.cardRoot,
    cardSurface: styles.cardSurface,
    cardSurfaceElevated: styles.cardSurfaceElevated,
    cardSurfaceThemed: styles.cardSurfaceThemed,
    cardSurfaceFlat: styles.cardSurfaceFlat,
    cardTicketWrapper: styles.cardTicketWrapper,
    cardTicketOutline: styles.cardTicketOutline,
    cardTicketClipContent: styles.cardTicketClipContent,
    cardTicketSection: styles.cardTicketSection,
    cardTicketSectionTop: styles.cardTicketSectionTop,
    cardTicketSectionBottom: styles.cardTicketSectionBottom,
    cardInfoWrapper: styles.cardInfoWrapper,
    cardInfoSectionTop: styles.cardInfoSectionTop,
    cardInfoSectionBottom: styles.cardInfoSectionBottom,
    linkOverlay: styles.linkOverlay,
    cardHeaderLeading: styles.cardHeaderLeading,
    cardHeaderLeadingRow: styles.cardHeaderLeadingRow,
    cardHeaderLeadingPrefix: styles.cardHeaderLeadingPrefix,
    cardHeaderLeadingTitleWrap: styles.cardHeaderLeadingTitleWrap,
    cardHeaderLeadingTitleRow: styles.cardHeaderLeadingTitleRow,
    cardHeaderLeadingSuffix: styles.cardHeaderLeadingSuffix,
    cardHeaderTrailing: styles.cardHeaderTrailing,
    cardBody: styles.cardBody,
    cardFooterLeading: styles.cardFooterLeading,
    cardFooterTrailing: styles.cardFooterTrailing,
    cardFooterActionWrapper: styles.cardFooterActionWrapper,
    cardFooterActionSpacer: styles.cardFooterActionSpacer,
    cardHeaderIconButtonWrapper: styles.cardHeaderIconButtonWrapper,
  };
}
