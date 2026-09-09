// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './breadcrumb.module.css';

// Export structural classes directly
/** @type {string} */
export const breadcrumbNavClass = styles['breadcrumb-nav'];
/** @type {string} */
export const breadcrumbListClass = styles['breadcrumb-list'];
/** @type {string} */
export const breadcrumbListItemClass = styles['breadcrumb-list-item'];
/** @type {string} */
export const separatorWrapperClass = styles['separator-wrapper'];
/** @type {string} */
export const currentPageWrapperClass = styles['current-page-wrapper'];
/** @type {string} */
export const showLastSeparatorClass = styles['show-last-separator'];

// Stepper variant classes
/** @type {string} */
export const breadcrumbListStepperClass = styles['breadcrumb-list-stepper'];
/** @type {string} */
export const stepperItemClass = styles['stepper-item'];
/** @type {string} */
export const stepperItemSelectedPrimaryClass = styles['stepper-item-selected-primary'];
/** @type {string} */
export const stepperItemSelectedNeutralClass = styles['stepper-item-selected-neutral'];
/** @type {string} */
export const stepperItemSelectedWhiteClass = styles['stepper-item-selected-white'];
/** @type {string} */
export const stepperItemLinkClass = styles['stepper-item-link'];
/** @type {string} */
export const stepperItemLinkOnLightClass = styles['stepper-item-link-onlight'];
/** @type {string} */
export const stepperItemLinkOnDarkClass = styles['stepper-item-link-ondark'];

/**
 * Build the class string for the selected (current page) pill in the stepper
 * variant. The pill background is driven by the Breadcrumb `color` prop.
 * @param {'primary' | 'neutral' | 'white'} color
 * @returns {string}
 */
export function getStepperItemSelectedClasses(color) {
  const colorClass =
    color === 'primary'
      ? stepperItemSelectedPrimaryClass
      : color === 'white'
      ? stepperItemSelectedWhiteClass
      : stepperItemSelectedNeutralClass;
  return [stepperItemClass, colorClass].filter(Boolean).join(' ');
}

/**
 * Build the class string for an unselected (navigable) stepper item. Uses a
 * light or dark hover/focus tint depending on the Breadcrumb `color` prop
 * (`white` is meant for dark/colored surfaces).
 * @param {'primary' | 'neutral' | 'white'} color
 * @returns {string}
 */
export function getStepperItemLinkClasses(color) {
  const tintClass = color === 'white' ? stepperItemLinkOnDarkClass : stepperItemLinkOnLightClass;
  return [stepperItemClass, stepperItemLinkClass, tintClass].filter(Boolean).join(' ');
}

/**
 * Get all Breadcrumb component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 * @returns {Record<string, string>}
 */
export function getBreadcrumbTemplateClasses() {
  return {
    breadcrumbNav: breadcrumbNavClass,
    breadcrumbList: breadcrumbListClass,
    breadcrumbListItem: breadcrumbListItemClass,
    separatorWrapper: separatorWrapperClass,
    currentPageWrapper: currentPageWrapperClass,
    showLastSeparator: showLastSeparatorClass,
    breadcrumbListStepper: breadcrumbListStepperClass,
    stepperItem: stepperItemClass,
    stepperItemSelectedPrimary: stepperItemSelectedPrimaryClass,
    stepperItemSelectedNeutral: stepperItemSelectedNeutralClass,
    stepperItemSelectedWhite: stepperItemSelectedWhiteClass,
    stepperItemLink: stepperItemLinkClass,
    stepperItemLinkOnLight: stepperItemLinkOnLightClass,
    stepperItemLinkOnDark: stepperItemLinkOnDarkClass,
  };
}

/**
 * Get the breadcrumb text size mapping from BreadcrumbSize to BaseText fontSize/lineHeight.
 * Matches body text size mapping: small→75, medium→100, large→200.
 * @returns {{
 *   fontSize: Record<'small' | 'medium' | 'large', 75 | 100 | 200>,
 *   lineHeight: Record<'small' | 'medium' | 'large', 75 | 100 | 200>,
 * }}
 */
export function getBreadcrumbTextSizes() {
  return {
    fontSize: {
      small: 75,
      medium: 100,
      large: 200,
    },
    lineHeight: {
      small: 75,
      medium: 100,
      large: 200,
    },
  };
}
