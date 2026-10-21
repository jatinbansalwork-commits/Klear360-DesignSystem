import { EmptyState } from '~components/EmptyState';
import { SearchIcon } from '~components/Icons';

/**
 * Default content rendered by `ActionList` when a filterable trigger (`AutoComplete`, or any
 * trigger with an `AutoComplete` in the `DropdownHeader`, e.g. `FilterChipSelectInput`) narrows
 * the options down to zero matches. Pass `ActionList`'s `noResultsContent` prop to override it.
 */
const ActionListNoResults = (): React.ReactElement => {
  return (
    <EmptyState
      size="small"
      testID="action-list-no-results"
      asset={<SearchIcon size="xlarge" color="surface.icon.gray.muted" />}
      title="No results found"
      description="Try searching for a different value"
    />
  );
};

export { ActionListNoResults };
