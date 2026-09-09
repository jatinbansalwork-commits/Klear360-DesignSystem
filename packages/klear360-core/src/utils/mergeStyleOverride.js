/**
 * Merges styleOverride maps left-to-right; later maps win on slot conflicts.
 *
 * Precedence: instance `styleOverride` > provider `componentConfig.styleOverride` > base styles.
 * Base (internal) classes are applied separately in components — not through this helper.
 *
 * @template {string} Slot
 * @param {Array<import('../styles/shared/styleOverride').StyleOverride<Slot> | undefined>} overrides
 * @returns {import('../styles/shared/styleOverride').StyleOverride<Slot>}
 */
export function mergeStyleOverride(...overrides) {
  return Object.assign(
    {},
    ...overrides.filter(
      /**
       * @param {import('../styles/shared/styleOverride').StyleOverride<Slot> | undefined} override
       * @returns {override is import('../styles/shared/styleOverride').StyleOverride<Slot>}
       */
      (override) => override != null,
    ),
  );
}
