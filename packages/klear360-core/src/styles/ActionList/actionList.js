import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './actionList.module.css';

/**
 * @typedef {Object} ActionListWrapperVariants
 * @property {boolean} [isInBottomSheet]
 */

/**
 * ListBox scroll wrapper. Standalone → `.wrapper` (max-height 300px + spacing.3
 * padding + overflow-y auto). In-sheet → `.wrapperInSheet` (overflow-y only;
 * BottomSheetBody owns padding + scroll bounds).
 */
export const actionListWrapperCva = cva('', {
  variants: {
    isInBottomSheet: {
      true: styles.wrapperInSheet,
      false: styles.wrapper,
    },
  },
  defaultVariants: {
    isInBottomSheet: false,
  },
});

/**
 * @param {ActionListWrapperVariants} props
 * @returns {string}
 */
export function getActionListWrapperClasses(props) {
  return actionListWrapperCva(props);
}

/**
 * @typedef {Object} ActionListItemVariants
 * @property {'default' | 'negative'} [intent]
 */

/**
 * Row container (inlined BaseMenuItem). `.item` carries layout + hover/selected/
 * focus states; `.itemNegative` adds the negative-faded hover for
 * `intent="negative"`.
 */
export const actionListItemCva = cva(styles.item, {
  variants: {
    intent: {
      default: null,
      negative: styles.itemNegative,
    },
  },
  defaultVariants: {
    intent: 'default',
  },
});

/**
 * @param {ActionListItemVariants} props
 * @returns {string}
 */
export function getActionListItemClasses(props) {
  return actionListItemCva(props);
}

/**
 * Structural/template classes. Call from the Svelte component so Svelte does
 * not tree-shake CVA class references that only appear in compound selectors.
 * @returns {{
 *   wrapper: string,
 *   wrapperInSheet: string,
 *   item: string,
 *   itemNegative: string,
 *   itemInner: string,
 *   itemLeading: string,
 *   itemSelector: string,
 *   itemContent: string,
 *   itemContentWithLeading: string,
 *   itemTitleRow: string,
 *   itemTrailing: string,
 *   itemBadgeGroup: string,
 *   section: string,
 *   sectionTitle: string,
 *   sectionItems: string,
 * }}
 */
export function getActionListTemplateClasses() {
  return {
    wrapper: styles.wrapper,
    wrapperInSheet: styles.wrapperInSheet,
    item: styles.item,
    itemNegative: styles.itemNegative,
    itemInner: styles.itemInner,
    itemLeading: styles.itemLeading,
    itemSelector: styles.itemSelector,
    itemContent: styles.itemContent,
    itemContentWithLeading: styles.itemContentWithLeading,
    itemTitleRow: styles.itemTitleRow,
    itemTrailing: styles.itemTrailing,
    itemBadgeGroup: styles.itemBadgeGroup,
    section: styles.section,
    sectionTitle: styles.sectionTitle,
    sectionItems: styles.sectionItems,
  };
}
