import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { ActionList, ActionListItem } from '..';
import {
  Dropdown,
  DropdownButton,
  DropdownFooter,
  DropdownHeader,
  DropdownOverlay,
} from '~components/Dropdown';
import { FilterChipSelectInput } from '~components/Dropdown/FilterChipSelectInput';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Button } from '~components/Button';
import { EmptyState } from '~components/EmptyState';
import { InboxIcon } from '~components/Icons';

const ActionListMeta: Meta = {
  title: 'Components/ActionList/Examples/No Results',
  tags: ['autodocs'],
  component: ActionList,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const fruits = ['Apples', 'Apricots', 'Cherries', 'Crab apples', 'Jambolan'];

/**
 * `ActionList` already knew how to show "no results" for the standalone `AutoComplete` trigger
 * (typing into `SelectInput`/`AutoComplete` itself). It did not know about the AutoComplete
 * living in a `DropdownHeader` instead - the combination used by `FilterChipSelectInput` and any
 * `DropdownButton`/`SelectInput` trigger paired with an internal search box - so filtering those
 * down to zero matches used to just hide every `ActionListItem`, leaving a blank panel.
 *
 * `ActionList` now covers both cases through the same `noResultsContent` prop, defaulting to a
 * built-in `EmptyState`. This is a dedicated prop (not a documented `children`-based convention
 * like `Table`'s) because, unlike `Table`, the consumer here never stops rendering
 * `ActionListItem` children themselves - `Dropdown`'s own filtering state hides them
 * internally, so only `ActionList` ever knows when zero items are left visible.
 */
export const WithInternalSearch = (): React.ReactElement => {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <Box minHeight="400px">
      <Heading size="small">DropdownButton + search in header</Heading>
      <Text marginBottom="spacing.4">
        Search for &quot;xyz&quot; to see the fix - it used to render a blank panel.
      </Text>
      <Dropdown selectionType="multiple">
        <DropdownButton variant="tertiary">Fruits: {selected.length}</DropdownButton>
        <DropdownOverlay width="360px" maxWidth="360px">
          <DropdownHeader>
            <AutoComplete label="Search fruits" />
          </DropdownHeader>
          <ActionList>
            {fruits.map((fruit) => (
              <ActionListItem
                key={fruit}
                title={fruit}
                value={fruit}
                onClick={() =>
                  setSelected((prev) =>
                    prev.includes(fruit) ? prev.filter((item) => item !== fruit) : [...prev, fruit],
                  )
                }
                isSelected={selected.includes(fruit)}
              />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

/**
 * `FilterChipSelectInput` is Dropdown's own filterable multi-select trigger - the overlay's
 * search box is an `AutoComplete` placed in `DropdownHeader`, the same `hasAutoCompleteInHeader`
 * mechanism as the story above. Search for a value with no matches to see the same default
 * `EmptyState` render in place of the list.
 */
export const WithFilterChipSelectInput = (): React.ReactElement => {
  const [values, setValues] = React.useState<string[]>([]);

  return (
    <Box minHeight="400px">
      <Heading size="small">FilterChipSelectInput</Heading>
      <Text marginBottom="spacing.4">Search for &quot;xyz&quot; to see the fix.</Text>
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput
          label="Fruits"
          value={values}
          onChange={({ values: nextValues }) => setValues(nextValues)}
          onClearButtonClick={() => setValues([])}
        />
        <DropdownOverlay width="360px" maxWidth="360px">
          <DropdownHeader>
            <AutoComplete label="Search fruits" />
          </DropdownHeader>
          <ActionList>
            {fruits.map((fruit) => (
              <ActionListItem key={fruit} title={fruit} value={fruit} />
            ))}
          </ActionList>
          <DropdownFooter>
            <Button isFullWidth size="small" variant="tertiary" onClick={() => setValues([])}>
              Clear
            </Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

/**
 * Pass `noResultsContent` to replace the default copy/icon/actions - e.g. to add a "Clear
 * search" action, same as `Table`'s `NoResultsAfterFiltering` story does with its own wrapper.
 */
export const WithCustomNoResultsContent = (): React.ReactElement => {
  const [query, setQuery] = React.useState('xyz');

  return (
    <Box minHeight="400px">
      <Heading size="small">Custom noResultsContent</Heading>
      <Text marginBottom="spacing.4">
        Search for &quot;xyz&quot; to see the custom empty state.
      </Text>
      <Dropdown>
        <DropdownButton variant="tertiary">Fruits</DropdownButton>
        <DropdownOverlay width="360px" maxWidth="360px">
          <DropdownHeader>
            <AutoComplete
              label="Search fruits"
              inputValue={query}
              onInputValueChange={({ value }) => setQuery(value ?? '')}
            />
          </DropdownHeader>
          <ActionList
            noResultsContent={
              <EmptyState
                size="small"
                asset={<InboxIcon size="xlarge" color="surface.icon.gray.muted" />}
                title="No fruits found"
                description={`No fruits match "${query}"`}
              >
                <Button size="small" variant="secondary" onClick={() => setQuery('')}>
                  Clear search
                </Button>
              </EmptyState>
            }
          >
            {fruits.map((fruit) => (
              <ActionListItem key={fruit} title={fruit} value={fruit} />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export default ActionListMeta;
