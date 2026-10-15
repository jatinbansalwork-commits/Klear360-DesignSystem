const fs = require('fs');
const path = require('path');
const generateBundleDiff = require('./generateBundleDiff');

generateBundleDiff().then(({ diffTable }) => {
  fs.writeFileSync(path.resolve(__dirname, '../bundleSizeDiff.md'), diffTable || '');
});
