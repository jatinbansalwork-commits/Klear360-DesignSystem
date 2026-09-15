import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './alert.module.css';

/** @typedef {'information' | 'negative' | 'neutral' | 'notice' | 'positive' | 'primary'} AlertColor */
/** @typedef {'subtle' | 'intense'} AlertEmphasis */

/**
 * @typedef {Object} AlertVariants
 * @property {AlertColor} [color]
 * @property {AlertEmphasis} [emphasis]
 * @property {boolean} [isFullWidth]
 */

/**
 * CVA-based alert styles
 */
export const alertStyles = cva(styles.alert, {
  variants: {
    color: {
      neutral: styles['color-neutral'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      information: styles['color-information'],
      primary: styles['color-primary'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
    isFullWidth: {
      true: styles['full-width'],
      false: null,
    },
  },
  defaultVariants: {
    color: 'neutral',
    emphasis: 'subtle',
    isFullWidth: false,
  },
});

/**
 * Generate all classes for Alert component container
 * @param {AlertVariants & { className?: string }} props
 * @returns {string}
 */
export function getAlertClasses(props) {
  const { className, ...cvaProps } = props;
  const classes = [alertStyles(cvaProps), className].filter(Boolean).join(' ');
  return classes;
}

// Export structural classes directly
export const alertIconWrapperClass = styles['icon-wrapper'];
export const alertContentClass = styles.content;
export const alertContentFullWidthClass = styles['content-full-width'];
export const alertContentHorizontalActionsClass = styles['content-horizontal-actions'];
export const alertTitleClass = styles.title;
export const alertDescriptionClass = styles.description;
export const alertDescriptionWithTitleClass = styles['description-with-title'];
export const alertActionsVerticalClass = styles['actions-vertical'];
export const alertActionsHorizontalClass = styles['actions-horizontal'];
export const alertActionPrimaryClass = styles['action-primary'];
export const alertActionPrimaryWithTrailingClass = styles['action-primary-with-trailing'];
export const alertActionSecondaryClass = styles['action-secondary'];
export const alertActionSecondaryWithDismissClass = styles['action-secondary-with-dismiss'];
export const alertCloseButtonClass = styles['close-button'];
export const alertIconOffset1Class = styles['icon-offset-1'];
export const alertIconOffset2Class = styles['icon-offset-2'];
export const alertIconWrapperCenterClass = styles['icon-wrapper-center'];
export const alertIconOffsetDescriptionOnlyClass = styles['icon-offset-description-only'];
export const alertCloseButtonDescriptionOnlyClass = styles['close-button-description-only'];

/**
 * Get all Alert component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 * @returns {Record<string, string>}
 */
export function getAlertTemplateClasses() {
  return {
    alert: styles.alert,
    iconWrapper: alertIconWrapperClass,
    content: alertContentClass,
    contentFullWidth: alertContentFullWidthClass,
    contentHorizontalActions: alertContentHorizontalActionsClass,
    title: alertTitleClass,
    description: alertDescriptionClass,
    descriptionWithTitle: alertDescriptionWithTitleClass,
    actionsVertical: alertActionsVerticalClass,
    actionsHorizontal: alertActionsHorizontalClass,
    actionPrimary: alertActionPrimaryClass,
    actionPrimaryWithTrailing: alertActionPrimaryWithTrailingClass,
    actionSecondary: alertActionSecondaryClass,
    actionSecondaryWithDismiss: alertActionSecondaryWithDismissClass,
    closeButton: alertCloseButtonClass,
    iconOffset1: alertIconOffset1Class,
    iconOffset2: alertIconOffset2Class,
    iconWrapperCenter: alertIconWrapperCenterClass,
    iconOffsetDescriptionOnly: alertIconOffsetDescriptionOnlyClass,
    closeButtonDescriptionOnly: alertCloseButtonDescriptionOnlyClass,
  };
}

/**
 * Get text color token based on emphasis
 * @param {{ emphasis: AlertEmphasis }} params
 * @returns {string}
 */
export function getAlertTextColorToken({ emphasis }) {
  return emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.gray.subtle';
}

/**
 * Get icon color token based on color and emphasis
 * @param {{ color: AlertColor, emphasis: AlertEmphasis }} params
 * @returns {string}
 */
export function getAlertIconColorToken({ color, emphasis }) {
  if (emphasis === 'intense') {
    return 'surface.icon.staticWhite.normal';
  }
  if (color === 'primary') {
    return 'interactive.icon.primary.normal';
  }
  return `feedback.icon.${color}.intense`;
}

/**
 * TODO: consume this util in react Alert component
 * */
/**
 * Get primary action button color based on emphasis
 * @param {{ color: AlertColor, emphasis: AlertEmphasis }} params
 * @returns {'white' | 'primary'}
 */
export function getAlertActionButtonColor({ emphasis }) {
  return emphasis === 'intense' ? 'white' : 'primary';
}

/**
 * Get primary action button variant based on emphasis
 * @param {{ emphasis: AlertEmphasis }} params
 * @returns {'primary' | 'secondary'}
 */
export function getAlertActionButtonVariant({ emphasis }) {
  return emphasis === 'intense' ? 'primary' : 'secondary';
}

/**
 * Get secondary action (link) color based on emphasis
 * @param {{ emphasis: AlertEmphasis }} params
 * @returns {'white' | 'neutral'}
 */
export function getAlertLinkColor({ emphasis }) {
  return emphasis === 'intense' ? 'white' : 'neutral';
}
