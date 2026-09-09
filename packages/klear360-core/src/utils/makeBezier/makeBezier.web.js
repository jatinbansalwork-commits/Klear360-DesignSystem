/**
 * @template {number} X1
 * @template {number} Y1
 * @template {number} X2
 * @template {number} Y2
 * @param {X1} x1
 * @param {Y1} y1
 * @param {X2} x2
 * @param {Y2} y2
 * @returns {`cubic-bezier(${X1}, ${Y1}, ${X2}, ${Y2})`}
 */
export const makeBezier = (x1, y1, x2, y2) => {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
};
