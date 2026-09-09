/**
 * @typedef {Object} Breakpoints
 * @property {number} base `base` is used for responsive styling following a **mobile first** approach. It starts from 0px till the next existing token. Think of this as styles without any media query.
 * @property {number} xs `@media screen and (min-width: 320px)` - Small Mobiles
 * @property {number} s `@media screen and (min-width: 480px)` - Mobiles and Small Tablets
 * @property {number} m `@media screen and (min-width: 768px)` - Medium and Large Tablets. Dimensions with `m` and above can be treated as desktop in mobile-first approach (with min-width). Hence this breakpoint can be used for desktop styling.
 * @property {number} l `@media screen and (min-width: 1024px)` - Desktop
 * @property {number} xl `@media screen and (min-width: 1200px)` - HD Desktop
 */

/** @type {Breakpoints} */
export const breakpoints = {
  base: 0,
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
};
