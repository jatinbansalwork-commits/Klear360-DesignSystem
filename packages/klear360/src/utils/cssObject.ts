import type React from 'react';

/**
 * Style object for shared getters (formerly styled-components `CSSObject`).
 * Includes an index signature so token-style keys and vendor properties type-check.
 */
export type CSSObject = React.CSSProperties & Record<string, unknown>;
