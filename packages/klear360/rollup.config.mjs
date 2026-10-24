/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import pluginPeerDepsExternal from 'rollup-plugin-peer-deps-external';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginDeclarations from 'rollup-plugin-dts';
import pluginAlias from '@rollup/plugin-alias';
import pluginReplace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import ts from 'typescript';
import { depsExternalPlugin } from './dependencies-external-plugin.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagejson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8'));

const webExtensions = [
  '.web.js',
  '.web.ts',
  '.web.tsx',
  '.desktop.js',
  '.desktop.ts',
  '.desktop.tsx',
  '.mobile.js',
  '.mobile.ts',
  '.mobile.tsx',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.mjs',
];

const nativeExtensions = [
  '.native.js',
  '.native.ts',
  '.native.tsx',
  '.android.js',
  '.android.ts',
  '.android.tsx',
  '.ios.js',
  '.ios.ts',
  '.ios.tsx',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.mjs',
];

const packageJsonDeps = Object.keys(packagejson.dependencies).filter(
  (name) => name !== 'patch-package' && name !== 'recharts',
);

const externalDependencies = packageJsonDeps;

const inputRootDirectory = 'src';
const outputRootDirectory = 'build';
const libDirectory = 'lib';
const typesDirectory = 'types';

const aliases = pluginAlias({
  entries: [
    { find: '~src', replacement: fileURLToPath(new URL(inputRootDirectory, import.meta.url)) },
    {
      find: '~components',
      replacement: fileURLToPath(new URL(`${inputRootDirectory}/components`, import.meta.url)),
    },
    {
      find: '~utils',
      replacement: fileURLToPath(new URL(`${inputRootDirectory}/utils`, import.meta.url)),
    },
    {
      find: '~tokens',
      replacement: fileURLToPath(new URL(`${inputRootDirectory}/tokens`, import.meta.url)),
    },
  ],
});

/*
Build structure:

- build
  - lib
    - web
      - production
      - development
    - native
  - types
    - components
    - tokens
    - utils
*/
const getWebConfig = (inputs) => {
  const platform = 'web';
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

  return {
    input: inputs,
    // Since we individually bundle each export category (components, tokens, utils)
    // it is possible that some function of `utils` is used in `components` but
    // rollup will have no idea about it and tree shake it away.
    // So we disable tree shaking, this should not cause any issues since consumers will do their own tree shaking.
    treeshake: false,
    output: [
      {
        dir: `${outputRootDirectory}/${libDirectory}/${platform}/${mode}`,
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      pluginReplace({
        __DEV__: process.env.NODE_ENV !== 'production',
        preventAssignment: true,
      }),
      pluginPeerDepsExternal(),
      depsExternalPlugin({ externalDependencies }),
      pluginResolve({ extensions: webExtensions }),
      pluginCommonjs(),
      // Mirrors @klear/klear360-core's styles config: CSS Modules extracted into a single
      // `styles/index.css` instead of injected at import time. This removes the module-level
      // `document.head.appendChild` side effect, leaving every style module import-time pure so
      // consumers can tree-shake the JS per component. Consumers import the stylesheet once via
      // the `./styles.css` package export. `use: ['sass']` compiles real Sass before PostCSS.
      // A config with no CSS in its graph (tokens, utils) emits no stylesheet.
      postcss({
        extract: 'styles/index.css',
        modules: {
          auto: (resourcePath) => resourcePath.endsWith('.module.scss'),
        },
        minimize:
          process.env.NODE_ENV === 'production'
            ? {
                preset: [
                  'default',
                  // postcss-discard-duplicates throws on compound selectors from CSS Modules
                  // (e.g. `.horizontal.thin`) — disable until cssnano fixes upstream.
                  { discardDuplicates: false },
                ],
              }
            : false,
        sourceMap: true,
        use: ['sass'],
      }),
      pluginBabel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        envName: 'production',
        extensions: webExtensions,
      }),
      aliases,
    ],
  };
};

// This is a special config for klear360Coverage.ts
// We need to bundle it as cjs so that we can use it in playwright tests https://github.com/microsoft/playwright/issues/23662
const getKlear360CoverageConfig = (inputs) => {
  const platform = 'web';
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

  return {
    input: inputs,
    // Since we individually bundle each export category (components, tokens, utils)
    // it is possible that some function of `utils` is used in `components` but
    // rollup will have no idea about it and tree shake it away.
    // So we disable tree shaking, this should not cause any issues since consumers will do their own tree shaking.
    treeshake: false,
    output: [
      {
        dir: `${outputRootDirectory}/${libDirectory}/${platform}/${mode}`,
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      pluginReplace({
        __DEV__: process.env.NODE_ENV !== 'production',
        preventAssignment: true,
      }),
      pluginPeerDepsExternal(),
      depsExternalPlugin({ externalDependencies }),
      pluginResolve({ extensions: webExtensions }),
      pluginCommonjs(),
      pluginBabel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        envName: 'production',
        extensions: webExtensions,
      }),
      aliases,
    ],
  };
};

const getNativeConfig = (inputs) => {
  const platform = 'native';

  return {
    input: inputs,
    // Mirror getWebConfig: each export category (components, tokens, utils) is
    // bundled as its own rollup entry, so cross-category usages (e.g. a token
    // referenced by a component) are invisible to rollup's tree-shaker. With
    // tree-shaking on, rollup drops bindings whose usage it can't see, leaving
    // only side-effect-bearing expressions behind — which silently breaks
    // multi-statement modules like `tokens/global/motion.ts` (delay, duration,
    // and the motion wrapper get stripped, only the easing object literal
    // survives as a discarded expression). Disable tree-shaking; the consumer
    // will tree-shake instead.
    treeshake: false,
    output: [
      {
        dir: `${outputRootDirectory}/${libDirectory}/${platform}`,
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      pluginPeerDepsExternal(),
      depsExternalPlugin({ externalDependencies }),
      pluginResolve({ extensions: nativeExtensions }),
      pluginCommonjs(),
      pluginBabel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        envName: 'production',
        extensions: nativeExtensions,
      }),
      aliases,
    ],
  };
};

/** Side-effect SCSS/CSS imports are stripped from emitted JS; d.ts bundling must not resolve them. */
const ignoreStyleImportsForDeclarations = () => ({
  name: 'ignore-style-imports-for-declarations',
  resolveId(source) {
    if (/\.(scss|css)$/.test(source)) {
      return source;
    }
    return null;
  },
  load(id) {
    if (/\.(scss|css)$/.test(id)) {
      return 'export {};\n';
    }
    return null;
  },
});

const getDeclarationsConfig = ({ exportCategory, isNative }) => {
  const platform = isNative ? 'native' : 'web';

  // Need to resolve paths in d.ts files
  // https://github.com/Swatinem/rollup-plugin-dts/issues/169
  const currentTsConfig = ts.readConfigFile(
    fileURLToPath(new URL(`tsconfig.json`, import.meta.url)),
    (p) => fs.readFileSync(p, 'utf8'),
  ).config.compilerOptions;
  const compilerOptions = {
    ...currentTsConfig,
    // @TODO: remove this after rebranding when all components pass typecheck
    include: ['src'],
    moduleSuffixes: [`.${platform}`, ''],
  };

  return {
    // input will be the platform specific type which is generated by
    // `yarn build:generate-types`
    input: `${outputRootDirectory}/generated-types/${platform}/${exportCategory}/index.d.ts`,
    output: [
      {
        // don't prefix web index export with .web, for backwards compatibility with TS<4.7
        file: `${outputRootDirectory}/${typesDirectory}/${exportCategory}/${
          isNative ? 'index.native.d.ts' : 'index.d.ts'
        }`,
        format: 'esm',
      },
    ],
    plugins: [
      ignoreStyleImportsForDeclarations(),
      pluginDeclarations({
        compilerOptions,
      }),
    ],
  };
};

const config = () => {
  const framework = process.env.FRAMEWORK;

  const components = 'src/components/index.ts';
  const tokens = 'src/tokens/index.ts';
  const utils = 'src/utils/index.ts';
  // Built alongside components so a single postcss instance extracts every component's CSS
  // (plus the layer-order declaration) into one `styles/index.css`.
  const styles = 'src/styles/index.ts';
  const klear360Coverage = 'src/utils/klear360Coverage.ts';
  if (framework === 'REACT') {
    return [
      getWebConfig([components, styles]),
      getWebConfig(tokens),
      getWebConfig(utils),
      getKlear360CoverageConfig(klear360Coverage),
      // Unfortunately we cannot just simply copy the tsc emitted declarations and put it on build dir,
      // because moduleSuffixes will cause typescript to resolve the d.ts files based on the user's tsconfig.json
      // which will cause the build to fail because the user's tsconfig.json does not have the moduleSuffixes
      // So we opt for the older approach of bundling the d.ts files as index.d.ts and index.native.d.ts and place it on build dir.
      getDeclarationsConfig({ exportCategory: 'components', isNative: false }),
      getDeclarationsConfig({ exportCategory: 'tokens', isNative: false }),
      getDeclarationsConfig({ exportCategory: 'utils', isNative: false }),
    ].flat();
  }

  if (framework === 'REACT_NATIVE') {
    return [
      getNativeConfig(components),
      getNativeConfig(tokens),
      getNativeConfig(utils),
      getDeclarationsConfig({ exportCategory: 'components', isNative: true }),
      getDeclarationsConfig({ exportCategory: 'tokens', isNative: true }),
      getDeclarationsConfig({ exportCategory: 'utils', isNative: true }),
    ].flat();
  }
};

export default config();
