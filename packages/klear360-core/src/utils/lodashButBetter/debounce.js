/**
 * @param {(...args: any[]) => void} func
 * @param {number} wait
 * @returns {(...args: any[]) => void}
 */
function debounce(func, wait) {
  /** @type {ReturnType<typeof setTimeout> | null} */
  let timeoutId;

  /** @param {any[]} args */
  function wrapper(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  }

  return wrapper;
}

export default debounce;
