/**
 * @typedef {Readonly<{
 *   none: 0,
 *   '2xsmall': 2,
 *   xsmall: 4,
 *   small: 8,
 *   medium: 12,
 *   large: 16,
 *   xlarge: 20,
 *   '2xlarge': 24,
 *   max: 9999,
 *   round: '50%',
 * }>} BorderRadius
 */

/**
 * @typedef {Object} BorderWidth
 * @property {0} none none: 0(px/rem/pt)
 * @property {0.5} thinner thinner: 0.5(px/rem/pt)
 * @property {1} thin thin: 1(px/rem/pt)
 * @property {1.5} thick thick: 1.5(px/rem/pt)
 * @property {2} thicker thicker: 2(px/rem/pt)
 */

/**
 * @typedef {Object} Border
 * @property {BorderRadius} radius
 * @property {BorderWidth} width
 */

/** @type {Border} */
export const border = {
  radius: {
    none: 0,
    '2xsmall': 2,
    xsmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    '2xlarge': 24,
    max: 9999,
    round: '50%', // this needs to be in % but need to figure out how will we store unitless things
  },
  width: {
    none: 0,
    thinner: 0.5,
    thin: 1,
    thick: 1.5,
    thicker: 2,
  },
};
