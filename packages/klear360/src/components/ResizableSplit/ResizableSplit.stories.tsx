import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { ResizableSplit, ResizableSplitPane } from './';
import type { ResizableSplitProps } from './types';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Text, Heading } from '~components/Typography';

export default {
  title: 'Components/ResizableSplit',
  tags: ['autodocs'],
  component: ResizableSplit,
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="A draggable two-pane split layout - a document viewer next to an editable form panel, a preview next to a settings panel, etc. The consumer owns the resized width and its persistence (e.g. localStorage); this component owns the drag/clamp/keyboard/focus/visual mechanics."
          componentName="ResizableSplit"
          apiDecisionComponentName="ResizableSplit"
        />
      ),
    },
  },
} as Meta<typeof ResizableSplit>;

const PaneContent = ({
  label,
  description,
}: {
  label: string;
  description: string;
}): React.ReactElement => (
  <Box padding="spacing.5" height="100%">
    <Heading size="small">{label}</Heading>
    <Text color="surface.text.gray.muted">{description}</Text>
  </Box>
);

const DefaultTemplate: StoryFn<typeof ResizableSplit> = (args: ResizableSplitProps) => {
  const [width, setWidth] = React.useState<number | null>(null);

  return (
    <Box
      height="500px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.muted"
    >
      <ResizableSplit
        {...args}
        width={width}
        onWidthChange={setWidth}
        onResizeEnd={(finalWidth) => {
          // A real consumer persists here, e.g.:
          // localStorage.setItem('my-page:split-width', String(finalWidth));
          // eslint-disable-next-line no-console
          console.log('onResizeEnd', finalWidth);
        }}
        accessibilityLabel="Resize document viewer and form panel"
      >
        <ResizableSplitPane>
          <PaneContent
            label="Document viewer"
            description="The start pane - flexes to fill whatever space the end pane doesn't take."
          />
        </ResizableSplitPane>
        <ResizableSplitPane>
          <PaneContent
            label="Form panel"
            description="The end pane - its width is what `width`/`onWidthChange` control. Drag the handle, use arrow keys once it's focused, or double-click/press Enter to reset to the responsive default."
          />
        </ResizableSplitPane>
      </ResizableSplit>
    </Box>
  );
};

export const Default = DefaultTemplate.bind({});
Default.storyName = 'Default';

const WithMinWidthsTemplate: StoryFn<typeof ResizableSplit> = () => {
  const [width, setWidth] = React.useState<number | null>(null);

  return (
    <Box
      height="500px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.muted"
    >
      <ResizableSplit
        width={width}
        onWidthChange={setWidth}
        minStartWidth={400}
        minEndWidth={250}
        accessibilityLabel="Resize panels with custom minimum widths"
      >
        <ResizableSplitPane>
          <PaneContent
            label="Start pane (min 400px)"
            description="Can't be dragged narrower than 400px, even if the end pane would otherwise allow it."
          />
        </ResizableSplitPane>
        <ResizableSplitPane>
          <PaneContent
            label="End pane (min 250px)"
            description="Can't be dragged narrower than 250px."
          />
        </ResizableSplitPane>
      </ResizableSplit>
    </Box>
  );
};

export const WithCustomMinWidths = WithMinWidthsTemplate.bind({});
WithCustomMinWidths.storyName = 'WithCustomMinWidths';

const ExplicitWidthTemplate: StoryFn<typeof ResizableSplit> = () => {
  const [width, setWidth] = React.useState<number | null>(600);

  return (
    <Box
      height="500px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.muted"
    >
      <ResizableSplit
        width={width}
        onWidthChange={setWidth}
        accessibilityLabel="Resize panels, starting from an explicit width"
      >
        <ResizableSplitPane>
          <PaneContent label="Start pane" description="Flex pane." />
        </ResizableSplitPane>
        <ResizableSplitPane>
          <PaneContent
            label="End pane (starts at 600px)"
            description="Mounted with an explicit width rather than the computed responsive default - e.g. restored from localStorage on mount."
          />
        </ResizableSplitPane>
      </ResizableSplit>
    </Box>
  );
};

export const WithExplicitWidth = ExplicitWidthTemplate.bind({});
WithExplicitWidth.storyName = 'WithExplicitWidth';
