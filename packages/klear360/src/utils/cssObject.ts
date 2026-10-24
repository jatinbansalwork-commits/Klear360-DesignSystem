/**
 * Style object for shared getters (formerly imported from styled-components).
 * Re-exports styled-components' `CSSObject` so native `styled()` callbacks and
 * web style getters share one type until the native styled-components cutover (item 3).
 */
export type { CSSObject } from 'styled-components';
