const postcssKlear360Layer = require('./postcss-klear360-layer.cjs');

module.exports = {
  plugins: [require('postcss-nested'), postcssKlear360Layer, require('autoprefixer')],
};
