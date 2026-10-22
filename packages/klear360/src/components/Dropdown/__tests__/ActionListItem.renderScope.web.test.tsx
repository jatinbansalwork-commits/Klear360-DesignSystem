import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Dropdown, DropdownOverlay } from '../index';
import { DropdownButton } from '../DropdownButton';
import { DropdownHeader } from '../DropdownHeaderFooter';
import { ActionList, ActionListItem } from '~components/ActionList';
import * as getA11yRoles from '~components/ActionList/getA11yRoles';
import { SelectInput } from '~components/Input/DropdownInputTriggers/SelectInput';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * Regression guard for the Dropdown/ActionList `React.memo` investigation (see
 * ActionList/_decisions/decisions.md, "React.memo evaluation"): moving the active (focussed)
 * index with arrow keys, or filtering with AutoComplete, must only re-render the
 * `ActionListItem`(s) whose OWN derived state (isActive / isVisible) actually changed - not
 * every mounted item.
 *
 * Measured the same way TreeView's own investigation was (see TreeView/_decisions/decisions.md,
 * "React.memo evaluation" and CONTRIBUTING.md's "Performance & Profiling" section): a
 * non-interactive-repro jest measurement that counts how many times `_ActionListItem`'s render
 * body actually executes, via a spy on `getActionListItemRole` - a module function it calls
 * unconditionally on every render (not gated by anything a memoized bail-out would skip).
 *
 * Comparing DOM node references across the interaction (the technique
 * `TreeViewItem.renderScope.web.test.tsx` uses) was tried first here and does NOT work as a
 * regression guard for this bug: a re-render that produces identical output still leaves the
 * DOM node in place, so that check passed identically against the pre-fix code too. The call
 * count below is the actual signal and was confirmed to fail against the pre-fix code (see PR
 * description for the before/after numbers).
 */
const NUM_ITEMS = 50;

const buildMenuItems = (): React.ReactElement[] =>
  Array.from({ length: NUM_ITEMS }, (_, index) => (
    <ActionListItem key={`item-${index}`} title={`Item ${index}`} value={`item-${index}`} />
  ));

describe('<ActionListItem /> re-render scope', () => {
  let renderSpy: jest.SpiedFunction<typeof getA11yRoles.getActionListItemRole>;

  beforeEach(() => {
    renderSpy = jest.spyOn(getA11yRoles, 'getActionListItemRole');
  });

  afterEach(() => {
    renderSpy.mockRestore();
  });

  it(`sanity check: the menu actually mounts all ${NUM_ITEMS} items`, async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole } = renderWithTheme(
      <Dropdown>
        <DropdownButton>Actions</DropdownButton>
        <DropdownOverlay>
          <ActionList>{buildMenuItems()}</ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    await user.click(getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    expect(getAllByRole('menuitem')).toHaveLength(NUM_ITEMS);
  });

  it('moving the active index with ArrowDown only re-renders the newly- and previously-active items', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <Dropdown>
        <DropdownButton>Actions</DropdownButton>
        <DropdownOverlay>
          <ActionList>{buildMenuItems()}</ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const trigger = getByRole('button', { name: 'Actions' });
    trigger.focus();
    // first ArrowDown opens the menu; second moves the active index onto "Item 0"
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.keyboard('{ArrowDown}');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(
      getByRole('menuitem', { name: 'Item 0' }).id,
    );

    // active index is now on "Item 0" - start counting from here
    renderSpy.mockClear();

    // moves the active index from "Item 0" to "Item 1"
    await user.keyboard('{ArrowDown}');

    expect(trigger.getAttribute('aria-activedescendant')).toBe(
      getByRole('menuitem', { name: 'Item 1' }).id,
    );

    // only the item that lost `isActive` (Item 0) and the one that gained it (Item 1) should
    // have actually re-rendered - not all 50 mounted items
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('typing a filter character in AutoComplete only re-renders items whose visibility changed', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <DropdownHeader title="Recent Searches">
            <AutoComplete label="Fruits" />
          </DropdownHeader>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Apricot" value="apricot" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    await user.click(getByRole('combobox', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());

    renderSpy.mockClear();

    const autoCompleteInput = getByRole('searchbox', { name: 'Fruits' });
    // "m" (single keystroke) filters out Apple/Apricot (were visible, become hidden) and leaves
    // Mango visible (substring match, see AutoComplete.tsx's `.includes()` filter) - a single
    // character avoids compounding effects from `user.type`'s per-character key events
    await user.type(autoCompleteInput, 'm');

    await waitFor(() =>
      expect(document.querySelector('[data-value="apple"]')).toHaveStyle('display: none'),
    );
    // once filtered out, an item loses its accessible name (CSS `display: none` excludes its
    // text from the a11y name computation), so look it up by `data-value` instead of role+name
    expect(document.querySelector('[data-value="apricot"]')).toHaveStyle('display: none');
    expect(getByRole('option', { name: 'Mango' })).toBeVisible();

    // Filtering also moves `activeIndex` to the first visible match (AutoComplete's "first item
    // always in focus" effect), so Apple (loses active+visible), Apricot (loses visible), and
    // Mango (gains active) all have a real reason to re-render here - this asserts the fixed
    // item count stays small and stable, not that it's the theoretical minimum
    expect(renderSpy).toHaveBeenCalledTimes(5);
  });
});
