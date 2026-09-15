// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './trustBadge.module.css';

/**
 * @typedef {'default' | 'icon-only'} TrustBadgeVariant
 */

/**
 * Label text color token for the TrustBadge pill.
 * @returns {'surface.text.gray.subtle'}
 */
export const getTrustBadgeTextColorToken = () => {
  return 'surface.text.gray.subtle';
};

/**
 * Variant-specific root class. Pair with `trustBadge`.
 * @param {TrustBadgeVariant} variant
 * @returns {string}
 */
export const getTrustBadgeVariantClass = (variant) => {
  return variant === 'icon-only' ? styles.trustBadgeIconOnly : styles.trustBadgeWithPill;
};

/**
 * Get template classes to prevent Svelte tree-shaking of structural CSS-module classes.
 * Call this in component script blocks that reference these classes.
 * @returns {Record<string, string>}
 */
export function getTrustBadgeTemplateClasses() {
  return {
    trustBadge: styles.trustBadge,
    trustBadgeWithPill: styles.trustBadgeWithPill,
    trustBadgeIconOnly: styles.trustBadgeIconOnly,
    trustBadgeIcon: styles.trustBadgeIcon,
  };
}
