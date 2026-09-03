require('dotenv').config();

module.exports = function buildFigma(buildOptions) {
  const define = {};

  // eslint-disable-next-line guard-for-in
  for (const secretKey in process.env) {
    define[`process.env.${secretKey}`] = JSON.stringify(process.env[secretKey]);
  }

  return {
    ...buildOptions,
    platform: 'browser',
    define,
    plugins: buildOptions.plugins.filter((plugin) => {
      return plugin.name !== 'preact-compat';
    }),
  };
};
