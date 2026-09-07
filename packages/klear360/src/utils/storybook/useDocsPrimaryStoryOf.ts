import { useContext } from 'react';
import { DocsContext } from '@storybook/addon-docs/blocks';

/**
 * Storybook 10.2 resolves `<Primary />` / `<Controls />` against autodocs-tagged stories only.
 * Custom docs pages (`parameters.docs.page`) need an explicit story reference instead.
 */
const useDocsPrimaryStoryOf = (override?: unknown): unknown => {
  const docsContext = useContext(DocsContext);
  const stories = docsContext.componentStories?.() ?? [];

  if (override) {
    return override;
  }

  const autodocsStory = stories.find((story) => story.tags?.includes('autodocs'));
  return (autodocsStory ?? stories[0])?.moduleExport;
};

export default useDocsPrimaryStoryOf;
