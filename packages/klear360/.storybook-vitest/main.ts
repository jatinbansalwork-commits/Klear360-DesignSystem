import type { StorybookConfig } from '@storybook/react-vite';
import realConfig from '../.storybook/react/main.ts';

// @storybook/addon-vitest's file discovery breaks when `configDir` is nested more than one
// level below the package root (e.g. `.storybook/react`, needed here so the web and
// React Native Storybooks can share `packages/klear360`). This shallow config re-exports the
// real one from `.storybook/react/main.ts` with paths re-based for this directory's depth,
// purely so Vitest has a configDir shape the addon can index correctly.
const { staticDirs: _staticDirs, refs: _refs, ...rest } = realConfig;

const config: StorybookConfig = {
  ...rest,
  stories: (realConfig.stories as string[]).map((story) => story.replace('../../', '../')),
};

export default config;
