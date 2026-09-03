/**
 * KlearGlass - WebGL Glass Refraction Effect
 *
 * A React component for rendering a glass refraction shader effect
 * with video texture support, colorama, displacement, and more.
 *
 * @example
 * ```tsx
 * import { KlearGlass } from '@/components/KlearGlass';
 *
 * function MyComponent() {
 *   // Uses default assets (video and gradient maps)
 *   return (
 *     <KlearGlass
 *       width="100%"
 *       height="100vh"
 *     />
 *   );
 * }
 * ```
 */

// React component
export { KlearGlass as KlearSense } from './KlearGlass';

export type { KlearGlassProps as KlearSenseProps } from './types';

// Preload utilities
export { preloadKlearSenseAssets } from './utils';

// Preset types
export type { KlearGlassPreset as KlearSensePreset } from './presets';
