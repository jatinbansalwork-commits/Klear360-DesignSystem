import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(configDir, '../..');

export default defineConfig({
  root: packageRoot,
  plugins: [
    react(),
    tsconfigPaths({
      root: packageRoot,
    }),
    storybookTest({
      configDir,
      storybookScript: 'yarn react:storybook --no-open',
    }),
  ],
  test: {
    name: 'storybook',
    dir: packageRoot,
    root: packageRoot,
    browser: {
      enabled: true,
      provider: playwright({}),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: [path.join(configDir, 'vitest.setup.ts')],
  },
  resolve: {
    alias: {
      '~utils': path.resolve(packageRoot, 'src/utils'),
      '~components': path.resolve(packageRoot, 'src/components'),
      '~tokens': path.resolve(packageRoot, 'src/tokens'),
      '~src': path.resolve(packageRoot, 'src'),
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.mjs', '.js', '.jsx', '.json'],
  },
  define: {
    __DEV__: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test'),
  },
});
