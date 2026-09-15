import { makeBezier } from '~utils/makeBezier';

/**
 * Milliseconds for each named duration step.
 * @typedef {Readonly<{
 *   '2xquick': 80,
 *   xquick: 160,
 *   quick: 200,
 *   moderate: 280,
 *   xmoderate: 360,
 *   gentle: 480,
 *   xgentle: 640,
 *   '2xgentle': 960,
 * }>} Duration
 */

/**
 * Milliseconds for each named delay step.
 * @typedef {Readonly<{
 *   '2xquick': 80,
 *   xquick: 160,
 *   moderate: 280,
 *   gentle: 480,
 *   xgentle: 960,
 *   long: 2000,
 *   xlong: 3000,
 *   '2xlong': 5000,
 * }>} Delay
 */

/**
 * @typedef {{factory: () => (value: number) => number}} EasingFactoryFn similar to EasingFactoryFn of `react-native-reanimated`
 */

/**
 * @template {string} Value
 * @typedef {import('~utils').Platform.Select<{web: Value, native: EasingFactoryFn}>} EasingType
 */

/**
 * @typedef {Object} Easing
 * @property {EasingType<'cubic-bezier(0, 0, 0, 0)'>} linear Linear Easing. Use Case: Marquee, Progress Bar, etc. Returns cubic-bezier string in web and EasingFactoryFn of react-native-reanimated in native
 * @property {EasingType<'cubic-bezier(0, 0, 0.2, 1)'>} entrance Entrance Animation Easing. Use Case: Entry of modals, drawer, dropdown, etc.
 * @property {EasingType<'cubic-bezier(0.17, 0, 1, 1)'>} exit Exit Animation Easing. Use Case: Exit of modals, drawer, dropdown, etc.
 * @property {EasingType<'cubic-bezier(0.3, 0, 0.2, 1)'>} standard Standard Easing. Use Case: Morph
 * @property {EasingType<'cubic-bezier(0.5, 0, 0, 1)'>} emphasized Emphasized Easing. Use Case: Hover states of interactive items
 * @property {EasingType<'cubic-bezier(0.5, 0, 0.3, 1.5)'>} overshoot Overshoot Easing. Use Case: Toast notifications
 * @property {EasingType<'cubic-bezier(1, 0.5, 0, 0.5)'>} shake Error Easing. Use Case: Error States
 */

/**
 * @typedef {Readonly<{delay: Delay, duration: Duration, easing: Easing}>} Motion
 */

/**
 * @typedef {`easing.${keyof Easing}`} EasingString
 */
/**
 * @typedef {`duration.${keyof Duration}`} DurationString
 */
/**
 * @typedef {`delay.${keyof Delay}`} DelayString
 */

/** @type {Delay} */
const delay = {
  '2xquick': 80,
  xquick: 160,
  moderate: 280,
  gentle: 480,
  xgentle: 960,
  long: 2000,
  xlong: 3000,
  '2xlong': 5000,
};

/** @type {Duration} */
const duration = {
  '2xquick': 80,
  xquick: 160,
  quick: 200,
  moderate: 280,
  xmoderate: 360,
  gentle: 480,
  xgentle: 640,
  '2xgentle': 960,
};

/* makeBezier returns a string of `cubic-bezier()` for web & a react-native-reanimated Easing Function of type `EasingFactoryFn` for native */
/** @type {Easing} */
const easing = {
  linear: makeBezier(0, 0, 0, 0),
  entrance: makeBezier(0, 0, 0.2, 1),
  exit: makeBezier(0.17, 0, 1, 1),
  standard: makeBezier(0.3, 0, 0.2, 1),
  emphasized: makeBezier(0.5, 0, 0, 1),
  overshoot: makeBezier(0.5, 0, 0.3, 1.5),
  shake: makeBezier(1, 0.5, 0, 0.5),
};

/** @type {Motion} */
export const motion = {
  delay,
  duration,
  easing,
};
