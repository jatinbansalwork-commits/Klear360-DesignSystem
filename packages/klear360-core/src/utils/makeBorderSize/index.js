/**
 * @template {number | string} T
 * @param {T} size
 * @returns {T extends number ? `${T}px` : T}
 */
export function makeBorderSize(size) {
  if (typeof size === 'number') {
    return /** @type {any} */ (`${size}px`);
  }
  return /** @type {any} */ (size);
}
