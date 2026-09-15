/**
 * @param {string} src
 * @returns {string}
 */
const normalizeSrc = (src) => {
  const trimmed = src.trim();
  if (trimmed.startsWith('url(')) {
    return trimmed;
  }
  return `url(${JSON.stringify(trimmed)})`;
};

/**
 * @param {string} src
 * @param {string} [format]
 * @returns {string}
 */
const srcWithFormat = (src, format) => {
  const url = normalizeSrc(src);
  if (!format || /\sformat\s*\(/i.test(src)) {
    return url;
  }
  return `${url} format('${format}')`;
};

/**
 * Build a CSS string of `@font-face` rules for custom merchant fonts.
 * @param {import('~tokens/theme/createThemeConfig').CreateThemeFontFace[]} fontFaces
 * @returns {string}
 */
export const buildFontFaceCss = (fontFaces) => {
  return fontFaces
    .map((face) => {
      const sources = (Array.isArray(face.src) ? face.src : [face.src])
        .map((item) => srcWithFormat(item, face.format))
        .join(', ');
      const lines = [
        '@font-face {',
        `  font-family: ${JSON.stringify(face.fontFamily)};`,
        `  src: ${sources};`,
      ];
      if (face.fontWeight !== undefined) {
        lines.push(`  font-weight: ${face.fontWeight};`);
      }
      if (face.fontStyle) {
        lines.push(`  font-style: ${face.fontStyle};`);
      }
      if (face.fontDisplay) {
        lines.push(`  font-display: ${face.fontDisplay};`);
      }
      lines.push('}');
      return lines.join('\n');
    })
    .join('\n\n');
};
