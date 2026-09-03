import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const klear360Root = resolve(__dirname, '../../');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: StorybookConfig = {
  typescript: {
    check: !isDevelopment,
    checkOptions: {
      typescript: {
        configFile: resolve(klear360Root, 'tsconfig-typecheck.web.json'),
      },
    },
    reactDocgen: isDevelopment ? false : 'react-docgen-typescript',
  },

  refs: {
    '@storybook/design-system': { disable: true },
  },

  stories: [
    '../../docs/**/*.mdx',
    '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.mdx',
    '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.internal.stories.@(ts|tsx|js|jsx)',
  ],

  addons: [getAbsolutePath('@storybook/addon-docs'), getAbsolutePath('@storybook/addon-a11y')],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
  }),

  // '../../assets' is served at /assets so stories can point KlearSense's
  // assetsPath at the local (unpublished) spark assets via "/assets/spark".
  staticDirs: ['../../public', { from: '../../assets', to: '/assets' }],

  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
    const react = (await import('@vitejs/plugin-react')).default;

    return mergeConfig(config, {
      plugins: [
        react(),
        tsconfigPaths({
          root: klear360Root,
        }),
      ],
      define: {
        __DEV__: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      resolve: {
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.tsx',
          '.ts',
          '.web.js',
          '.mjs',
          '.js',
          '.jsx',
          '.json',
        ],
        alias: {
          '~utils': resolve(klear360Root, 'src/utils'),
          '~components': resolve(klear360Root, 'src/components'),
          '~tokens': resolve(klear360Root, 'src/tokens'),
          '~src': resolve(klear360Root, 'src'),
        },
      },
    });
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
