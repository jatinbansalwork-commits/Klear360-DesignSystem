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

/**
 * A master-detail "list + map" layout (Visibility/Track & Trace's Card & map view) - the native
 * Klear360 replacement for PrimeReact's `KSplitter` (`.p-splitter`), with the same ~30%/70%
 * split. The map is the **end** pane here (its width is what's explicitly controlled, defaulting
 * to 70% of the container), and the list is the **start** pane, which flexes to fill whatever the
 * map doesn't take - so a consumer wanting "list on the left, ~30%; map on the right, ~70%" just
 * orders the panes that way and points `computeDefaultWidth` at the map's share, rather than
 * needing the component to support reversing which pane is "the sized one."
 *
 * Drag the gutter, or focus it and use arrow keys / Home / End - no PrimeReact CSS (`.p-splitter`,
 * `.p-splitter-gutter`, etc.) involved anywhere; the gutter's visuals come entirely from theme
 * tokens (see `getResizableSplitHandleStyles.ts`).
 */
const ListAndMapTemplate: StoryFn<typeof ResizableSplit> = () => {
  const [mapWidth, setMapWidth] = React.useState<number | null>(null);
  const shipments = [
    { id: 'SHP-1001', origin: 'Shenzhen', destination: 'Los Angeles' },
    { id: 'SHP-1002', origin: 'Busan', destination: 'Long Beach' },
    { id: 'SHP-1003', origin: 'Singapore', destination: 'Oakland' },
    { id: 'SHP-1004', origin: 'Kaohsiung', destination: 'Savannah' },
  ];

  return (
    <Box
      height="500px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.muted"
    >
      <ResizableSplit
        width={mapWidth}
        onWidthChange={setMapWidth}
        onResizeEnd={(finalWidth) => {
          // e.g. localStorage.setItem('track-trace:map-width', String(finalWidth));
          // eslint-disable-next-line no-console
          console.log('onResizeEnd', finalWidth);
        }}
        computeDefaultWidth={(containerWidth) => containerWidth * 0.7}
        minStartWidth={280}
        minEndWidth={320}
        accessibilityLabel="Resize shipment list and map"
      >
        <ResizableSplitPane>
          <Box padding="spacing.3" height="100%" overflow="auto">
            <Heading size="small" marginBottom="spacing.3">
              Shipments
            </Heading>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              {shipments.map((shipment) => (
                <Box
                  key={shipment.id}
                  padding="spacing.3"
                  borderWidth="thin"
                  borderStyle="solid"
                  borderColor="surface.border.gray.muted"
                  borderRadius="medium"
                >
                  <Text weight="semibold">{shipment.id}</Text>
                  <Text color="surface.text.gray.muted">
                    {shipment.origin} → {shipment.destination}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        </ResizableSplitPane>
        <ResizableSplitPane>
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="surface.background.gray.moderate"
          >
            <Text color="surface.text.gray.muted">Map placeholder (e.g. Leaflet)</Text>
          </Box>
        </ResizableSplitPane>
      </ResizableSplit>
    </Box>
  );
};

export const ListAndMap = ListAndMapTemplate.bind({});
ListAndMap.storyName = 'ListAndMap (replaces PrimeReact KSplitter)';
