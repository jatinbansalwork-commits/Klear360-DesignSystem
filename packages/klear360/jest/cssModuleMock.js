/** CSS Modules stub for Jest — class names pass through unchanged for stable snapshots. */
module.exports = new Proxy(
  {},
  {
    get: (_target, key) => (typeof key === 'string' ? key : ''),
  },
);
