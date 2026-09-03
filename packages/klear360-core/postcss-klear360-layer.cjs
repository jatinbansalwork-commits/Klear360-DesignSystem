const postcss = require('postcss');

const KLEAR360_LAYER_NAME = 'klear360';

/**
 * Wraps klear360-core `*.module.css` output in `@layer klear360` so unlayered consumer
 * classes win the cascade without `!important`.
 */
function postcssKlear360Layer() {
  return {
    postcssPlugin: 'postcss-klear360-layer',
    OnceExit(root, { result }) {
      const from = result.opts.from ?? '';

      if (!from.includes('.module.css')) {
        return;
      }

      const isKlear360CoreModule =
        from.includes('klear360-core/') || from.includes('klear360-core\\');
      if (!isKlear360CoreModule) {
        return;
      }

      const alreadyWrapped = root.nodes.some(
        (node) =>
          node.type === 'atrule' &&
          node.name === 'layer' &&
          node.params.trim() === KLEAR360_LAYER_NAME,
      );
      if (alreadyWrapped) {
        return;
      }

      const layerAtRule = postcss.atRule({ name: 'layer', params: KLEAR360_LAYER_NAME });
      const nodes = [...root.nodes];
      for (const node of nodes) {
        layerAtRule.append(node);
      }
      root.append(layerAtRule);
    },
  };
}

postcssKlear360Layer.postcss = true;

module.exports = postcssKlear360Layer;
