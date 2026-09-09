/**
 * @param {(...args: any[]) => void} func
 * @param {number} wait
 * @returns {(...args: any[]) => void}
 */
function throttle(func, wait) {
  let isThrottled = false;
  /** @type {any[] | null} */
  let lastArgs = null;

  /** @param {any[]} args */
  function wrapper(...args) {
    if (isThrottled) {
      lastArgs = args;
      return;
    }

    func(...args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (lastArgs) {
        wrapper(...lastArgs);
        lastArgs = null;
      }
    }, wait);
  }

  return wrapper;
}

export default throttle;
