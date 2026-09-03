import { w as withErrorBoundary } from '../index-hH4j_WbX.js';
import { s as state } from '../index-fuw8iepm.js';

/**
 * function to return active i18n state
 *
 *  ===== USAGE =====
 * import { getState } from '@klear/i18n';
 *
 * console.log(getState())
 *
 * @returns i18n state
 */
const getState = () => {
  return state.getState();
};
var getState$1 = withErrorBoundary(getState);

/**
 * Function to set and override the active state in the i18n library
 *
 * ===== USAGE =====
 * import { setState } from "@klear/i18n";
 * setState({locale: 'en-US'})
 *
 * @param newState data to set in i18nState instance
 */
const setState = (newState) => {
  state.setState(newState);
};
var setState$1 = withErrorBoundary(setState);

/**
 * Function to reset the active state in the i18n library
 *
 * ===== USAGE =====
 * import { resetState } from "@klear/i18n";
 * resetState()
 *
 * @param newState data to set in i18nState instance
 */
const resetState = () => {
  state.resetState();
};
var resetState$1 = withErrorBoundary(resetState);

export { getState$1 as getState, resetState$1 as resetState, setState$1 as setState };
//# sourceMappingURL=index.js.map
