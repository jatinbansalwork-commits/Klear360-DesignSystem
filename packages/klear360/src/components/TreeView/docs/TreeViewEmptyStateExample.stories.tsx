import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { TreeView, TreeViewItem, TreeViewEmptyState } from '..';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Button } from '~components/Button';

const TreeViewMeta: Meta = {
  title: 'Components/TreeView/Examples/Empty States',
  tags: ['autodocs'],
  component: TreeView,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

/**
 * Before this, a lazily-loaded branch had `isLoading` for the in-flight state but nothing for
 * "loaded, and it's empty" - once the fetch resolved to zero items, the branch just rendered an
 * expanded group with nothing inside it, which reads as broken rather than intentional.
 *
 * `TreeViewEmptyState` is a documented `children`-based slot, same shape as `TreeViewLoadMore`:
 * render it as the branch's only child once loading finishes with no results. Keep `hasChildren`
 * set (so the chevron/expanded state persists) - `TreeViewEmptyState` itself is decorative only,
 * never registered as a row, so it's never focusable or counted in keyboard traversal.
 *
 * Expand "Karnataka" to see the spinner, then the empty state once the (simulated) fetch
 * resolves with zero cities.
 */
export const WithAsyncChildrenEmpty = (): React.ReactElement => {
  const [cities, setCities] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isKarnatakaExpanded, setIsKarnatakaExpanded] = React.useState(false);

  const fetchCities = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      // simulates a filtered/empty fetch result
      setCities([]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <Box maxWidth="320px" minHeight="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Box>
        <Heading size="small">Karnataka resolves to zero cities</Heading>
        <Button
          size="small"
          variant="tertiary"
          onClick={() => {
            setIsKarnatakaExpanded(false);
            setCities(null);
            setIsLoading(false);
          }}
        >
          Reset (check spinner again)
        </Button>
      </Box>
      <Dropdown selectionType="multiple">
        <SelectInput label="Regions" placeholder="Select regions" />
        <DropdownOverlay>
          <TreeView>
            <TreeViewItem
              title="Karnataka"
              value="karnataka"
              hasChildren
              isLoading={isLoading}
              isExpanded={isKarnatakaExpanded}
              onExpandChange={({ isExpanded }) => {
                setIsKarnatakaExpanded(isExpanded);
                if (isExpanded && cities === null) {
                  fetchCities();
                }
              }}
            >
              {cities !== null && !isLoading && cities.length === 0 ? (
                <TreeViewEmptyState description="No cities match this filter" />
              ) : (
                (cities ?? []).map((city) => (
                  <TreeViewItem key={city} title={city} value={city.toLowerCase()} />
                ))
              )}
            </TreeViewItem>
            <TreeViewItem title="Goa" value="goa" />
          </TreeView>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

/**
 * `TreeViewEmptyState` works the same way standalone - at the root (the whole tree resolves to
 * zero items) or nested under any branch.
 */
export const StandaloneRootEmpty = (): React.ReactElement => {
  return (
    <Box maxWidth="320px">
      <Heading size="small">No regions match the current filter</Heading>
      <Text marginBottom="spacing.4">
        The whole tree can resolve to zero items too - render `TreeViewEmptyState` as `TreeView`'s
        only child.
      </Text>
      <TreeView>
        <TreeViewEmptyState title="No regions found" description="Try a different search term" />
      </TreeView>
    </Box>
  );
};

export default TreeViewMeta;
