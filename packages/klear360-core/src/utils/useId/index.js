let counter = 0;

/**
 * Generates a process-unique id string. Framework-agnostic (no React/Svelte
 * hooks) — mirrors the React `useId` output shape (`prefix-<n>`).
 *
 * Unlike React's hook, this is a plain function: it returns a fresh id on each
 * call. Callers that need a stable id across renders must memoise it themselves
 * (e.g. compute once in a Svelte component's script body, which runs once per
 * instance).
 *
 * @param {string} [prefix] optional prefix prepended to the generated id
 * @param {string} [idProp] external id passed by the consumer; returned as-is when present
 * @returns {string}
 */
export const useId = (prefix, idProp) => {
  if (idProp) {
    return idProp;
  }
  counter += 1;
  const id = counter.toString();
  return prefix ? `${prefix}-${id}` : id;
};
