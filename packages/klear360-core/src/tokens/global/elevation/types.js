/**
 * @typedef {'none' | 'lowRaised' | 'midRaised' | 'highRaised'} ElevationLevels
 */

/**
 * @typedef {Readonly<{
 *   elevation: number,
 *   shadowColor: string,
 *   shadowOpacity: number,
 *   shadowRadius: number,
 *   shadowOffset: {width: number, height: number},
 * }>} ElevationStyles
 */

/**
 * @typedef {Record<ElevationLevels, import('~utils').Platform.Select<{web: string, native: ElevationStyles}>>} Elevation
 */

/**
 * @typedef {Record<import('~tokens/theme/theme').ColorSchemeModes, Elevation>} ElevationWithColorModes
 */

export {};
