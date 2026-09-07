import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const klear360Root = path.resolve(__dirname, '..');

// Resolve @klear/klear360 to the monorepo source so token/theme changes
// (e.g. divider muted border) reflect immediately — not the pinned npm build.
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      root: klear360Root,
    }),
  ],
  base: '/dashboard/',
  build: {
    outDir: 'dist',
  },
  define: {
    __DEV__: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.mjs', '.js', '.jsx', '.json'],
    alias: {
      '@klear/klear360/fonts.css': path.join(klear360Root, 'fonts.css'),
      '@klear/klear360/components': path.join(klear360Root, 'src/components'),
      '@klear/klear360/tokens': path.join(klear360Root, 'src/tokens'),
      '@klear/klear360/utils': path.join(klear360Root, 'src/utils'),
      '~utils': path.join(klear360Root, 'src/utils'),
      '~components': path.join(klear360Root, 'src/components'),
      '~tokens': path.join(klear360Root, 'src/tokens'),
      '~src': path.join(klear360Root, 'src'),
    },
  },
});
