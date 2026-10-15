import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Dropdown, DropdownOverlay, FilterChipSelectInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';

const renderFilterChip = (
  props: Omit<React.ComponentProps<typeof FilterChipSelectInput>, 'label'> & {
    label?: string;
  } = {},
  dropdownProps: Partial<React.ComponentProps<typeof Dropdown>> = {},
): ReturnType<typeof renderWithTheme> =>
  renderWithTheme(
    <Dropdown {...dropdownProps}>
      <FilterChipSelectInput label="Status" {...props} />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Active" value="active" />
          <ActionListItem title="Inactive" value="inactive" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>,
  );

describe('<FilterChipSelectInput /> (web)', () => {
  it('should render with default props', () => {
    const { getByRole, queryByRole } = renderFilterChip();

    expect(getByRole('button', { name: 'Status' })).toBeInTheDocument();
    expect(queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should open the dropdown on click', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderFilterChip();

    await user.click(getByRole('button', { name: 'Status' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
  });

  it('should not open the dropdown when disabled', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderFilterChip({ isDisabled: true });

    await user.click(getByRole('button', { name: 'Status' }));
    expect(queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should accept a testID', () => {
    const { getByTestId } = renderFilterChip({ testID: 'filter-chip-test' });

    expect(getByTestId('filter-chip-test')).toBeInTheDocument();
  });

  it('should select an option and report it via onChange', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { getByRole } = renderFilterChip({ name: 'status', onChange });

    await user.click(getByRole('button', { name: 'Status' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Active' }));

    expect(onChange).toHaveBeenCalledWith({ name: 'status', values: ['active'] });
  });

  it('should select multiple options and report all selected values', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { getByRole, getAllByRole } = renderFilterChip(
      { name: 'status', onChange },
      { selectionType: 'multiple' },
    );

    await user.click(getByRole('button', { name: 'Status' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    const menuItems = getAllByRole('menuitem');
    await user.click(menuItems[0]);
    await user.click(menuItems[1]);

    expect(onChange).toHaveBeenLastCalledWith({
      name: 'status',
      values: ['active', 'inactive'],
    });
  });

  it('should clear the selected value when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onClearButtonClick = jest.fn();
    const { getByRole } = renderFilterChip({ name: 'status', onChange, onClearButtonClick });

    await user.click(getByRole('button', { name: 'Status' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Active' }));
    expect(onChange).toHaveBeenLastCalledWith({ name: 'status', values: ['active'] });

    await user.click(getByRole('button', { name: 'Clear Status value' }));

    expect(onClearButtonClick).toHaveBeenCalledWith({ name: 'status', values: ['active'] });
    expect(onChange).toHaveBeenLastCalledWith({ name: 'status', values: [] });
  });

  it('should not render the clear button when showClearButton is false, even when selected', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderFilterChip({ name: 'status', showClearButton: false });

    await user.click(getByRole('button', { name: 'Status' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Active' }));

    expect(queryByRole('button', { name: 'Clear Status value' })).not.toBeInTheDocument();
  });

  it('should reflect a controlled string value as the selected chip value', () => {
    const { getAllByText, getByRole } = renderFilterChip({ name: 'status', value: 'active' });

    // "Active" is rendered both in the chip trigger (selected value) and in the ActionList item.
    expect(getAllByText('Active').length).toBeGreaterThanOrEqual(2);
    expect(getByRole('button', { name: 'Clear Status value' })).toBeInTheDocument();
  });

  it('should reflect a controlled single-item array value in multiple mode as the option name', () => {
    const { getAllByText, getByRole } = renderFilterChip(
      { name: 'status', value: ['active'] },
      { selectionType: 'multiple' },
    );

    expect(getAllByText('Active').length).toBeGreaterThanOrEqual(2);
    expect(getByRole('button', { name: 'Clear Status value' })).toBeInTheDocument();
  });

  it('should reflect a controlled multi-item array value with a counter and clear button', () => {
    const { getByRole, getByText } = renderFilterChip(
      { name: 'status', value: ['active', 'inactive'] },
      { selectionType: 'multiple' },
    );

    expect(getByText('2')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Clear Status value' })).toBeInTheDocument();
  });

  it('should clear the selection when a controlled value is emptied from outside', () => {
    const { getByRole, rerender } = renderFilterChip({ name: 'status', value: 'active' });

    expect(getByRole('button', { name: 'Clear Status value' })).toBeInTheDocument();

    rerender(
      <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
        <Dropdown>
          <FilterChipSelectInput label="Status" name="status" value="" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Active" value="active" />
              <ActionListItem title="Inactive" value="inactive" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Klear360Provider>,
    );

    expect(getByRole('button', { name: 'Status' })).toBeInTheDocument();
  });
});
