import React from 'react';
import userEvent from '@testing-library/user-event';
import { ListViewFilters } from '../ListViewFilters.web';
import { useListViewFilterContext } from '../ListViewFiltersContext.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Dropdown, DropdownOverlay, FilterChipSelectInput } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';

// Observes the context ListViewFilters provides, so tests can assert on its state without
// depending on any particular consumer component's own rendering.
const ContextObserver = (): React.ReactElement => {
  const { listViewSelectedFilters, selectedFiltersCount } = useListViewFilterContext();
  return (
    <div data-testid="context-observer">
      {JSON.stringify(listViewSelectedFilters)} | count: {selectedFiltersCount}
    </div>
  );
};

describe('<ListViewFilters />', () => {
  it('should render quickFilters, children and actions', () => {
    const { getByText } = renderWithTheme(
      <ListViewFilters
        quickFilters={<div>Quick filters here</div>}
        actions={<div>Actions here</div>}
      >
        <div>Row 2 content</div>
      </ListViewFilters>,
    );

    expect(getByText('Quick filters here')).toBeInTheDocument();
    expect(getByText('Actions here')).toBeInTheDocument();
    expect(getByText('Row 2 content')).toBeInTheDocument();
  });

  it('should fire onSearchChange and onSearchClear from the (deprecated) search input', async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    const onSearchClear = jest.fn();
    const { getByRole, getByLabelText } = renderWithTheme(
      <ListViewFilters
        quickFilters={<div />}
        searchName="search"
        searchValuePlaceholder="Search..."
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
        searchValue="abc"
      />,
    );

    await user.type(getByRole('textbox'), 'd');
    expect(onSearchChange).toHaveBeenCalled();

    await user.click(getByLabelText(/clear/i));
    expect(onSearchClear).toHaveBeenCalled();
  });

  it('should share selected-filter state with a FilterChipSelectInput child via context', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = renderWithTheme(
      <ListViewFilters
        quickFilters={
          <Dropdown>
            <FilterChipSelectInput label="Status" name="status" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Active" value="active" />
                <ActionListItem title="Inactive" value="inactive" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        }
      >
        <ContextObserver />
      </ListViewFilters>,
    );

    expect(getByTestId('context-observer')).toHaveTextContent('{}');

    await user.click(getByRole('button', { name: 'Status' }));
    await user.click(getByRole('menuitem', { name: 'Active' }));

    // selectedFiltersCount is a separate, externally-controlled prop (default 0) - it isn't
    // derived from listViewSelectedFilters, so only the filters object itself is expected to
    // change. It's keyed by the filter's `label`, not its `name`.
    expect(getByTestId('context-observer')).toHaveTextContent('"Status":[0]');
    expect(getByTestId('context-observer')).toHaveTextContent('count: 0');
  });
});
