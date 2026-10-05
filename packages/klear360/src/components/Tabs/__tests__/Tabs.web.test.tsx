import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { Tabs, TabList, TabItem, TabPanel } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import assertAccessible from '~utils/testing/assertAccessible.web';
import klear360Theme from '~tokens/theme/klear360Theme';

const queryTabPanelByText = (text: string): HTMLElement | null => {
  return (
    screen.queryAllByRole('tabpanel', { hidden: true }).find((el) => el.textContent === text) ??
    null
  );
};

describe('Tabs', () => {
  it('should render', () => {
    const { baseElement, queryAllByRole } = renderWithTheme(
      <Tabs defaultValue="refunds">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(baseElement).toMatchSnapshot();

    // `queryByRole` is failing but `queryAllByRole` is working
    // I think because even with `hidden: true` the `name` will try to assert the `accessibleName`
    // Which never gets computed because `aria-hidden` is set
    // To work around this, I've added a custom `queryTabPanelByText` function
    // expect(queryByRole('Payments', idden: true })).toBeInTheDocument();

    // Expect all tab panles to be in the dom
    expect(queryAllByRole('tabpanel', { hidden: true })).toHaveLength(2);
    expect(queryTabPanelByText('Payments')).toBeInTheDocument();
    expect(queryTabPanelByText('Refunds')).toBeInTheDocument();
  });

  it('should render with vertical orientation', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" orientation="vertical">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with filled variant', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" variant="filled">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with isFullWidthTabItem', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" isFullWidthTabItem>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with size', () => {
    const { baseElement } = renderWithTheme(
      <Tabs defaultValue="refunds" size="large">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should switch tabs with mouse', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <Tabs>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
        <TabPanel value="disputes">
          <Text>Disputes</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');

    expect(queryTabPanelByText('Payments')).toBeVisible();
    expect(queryTabPanelByText('Refunds')).not.toBeVisible();
    expect(queryTabPanelByText('Disputes')).not.toBeVisible();

    await user.click(getByRole('tab', { name: 'Refunds' }));
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');
    expect(queryTabPanelByText('Payments')).not.toBeVisible();
    expect(queryTabPanelByText('Refunds')).toBeVisible();
    expect(queryTabPanelByText('Disputes')).not.toBeVisible();

    await user.click(getByRole('tab', { name: 'Disputes' }));
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(queryTabPanelByText('Payments')).not.toBeVisible();
    expect(queryTabPanelByText('Refunds')).not.toBeVisible();
    expect(queryTabPanelByText('Disputes')).toBeVisible();
  });

  it('should switch tabs with keyboard', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <Tabs>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
        <TabPanel value="disputes">
          <Text>Disputes</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');

    expect(queryTabPanelByText('Payments')).toBeVisible();
    expect(queryTabPanelByText('Refunds')).not.toBeVisible();
    expect(queryTabPanelByText('Disputes')).not.toBeVisible();

    fireEvent.keyDown(getByRole('tab', { name: 'Payments' }), { key: 'ArrowRight' });
    getByRole('tab', { name: 'Refunds' }).focus();
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('tabindex', '0');
    // JSDOM focus/events are such a mess
    // https://github.com/testing-library/react-testing-library/issues/269#issuecomment-1180073128
    // TODO: switch to e2e
    getByRole('tab', { name: 'Refunds' }).focus();
    await user.keyboard('{Enter}');
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');
    expect(queryTabPanelByText('Payments')).not.toBeVisible();
    expect(queryTabPanelByText('Refunds')).toBeVisible();
    expect(queryTabPanelByText('Disputes')).not.toBeVisible();

    // Switch to Disputes
    fireEvent.keyDown(getByRole('tab', { name: 'Refunds' }), { key: 'ArrowRight' });
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('tabindex', '0');
    getByRole('tab', { name: 'Disputes' }).focus();
    await user.keyboard('{Enter}');
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(queryTabPanelByText('Payments')).not.toBeVisible();
    expect(queryTabPanelByText('Refunds')).not.toBeVisible();
    expect(queryTabPanelByText('Disputes')).toBeVisible();

    // Switch to Payments [loops back]
    fireEvent.keyDown(getByRole('tab', { name: 'Disputes' }), { key: 'ArrowRight' });
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('tabindex', '0');
    getByRole('tab', { name: 'Payments' }).focus();
    await user.keyboard('{Enter}');
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');
    expect(queryTabPanelByText('Payments')).toBeVisible();
    expect(queryTabPanelByText('Refunds')).not.toBeVisible();
    expect(queryTabPanelByText('Disputes')).not.toBeVisible();
  });

  it('should work with uncontrolled state', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Tabs onChange={onChange}>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
        <TabPanel value="disputes">
          <Text>Disputes</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');

    expect(queryTabPanelByText('Payments')).toBeVisible();
    expect(queryTabPanelByText('Refunds')).not.toBeVisible();
    expect(queryTabPanelByText('Disputes')).not.toBeVisible();

    await user.click(getByRole('tab', { name: 'Refunds' }));
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');
    expect(onChange).toHaveBeenCalledWith('refunds');

    await user.click(getByRole('tab', { name: 'Disputes' }));
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(onChange).toHaveBeenCalledWith('disputes');
  });

  it('should work with controlled state', async () => {
    const user = userEvent.setup();
    const selectedTabTestId = 'selected-tab-text';
    const ControlledTabExample = (): React.ReactElement => {
      const [value, setValue] = React.useState('refunds');
      return (
        <Box>
          <Text testID={selectedTabTestId}>{value}</Text>
          <Button
            onClick={() => {
              setValue('payments');
            }}
          >
            Change to Payments
          </Button>
          <Tabs
            value={value}
            onChange={(value) => {
              setValue(value);
            }}
          >
            <TabList>
              <TabItem value="payments">Payments</TabItem>
              <TabItem value="refunds">Refunds</TabItem>
              <TabItem value="disputes">Disputes</TabItem>
            </TabList>

            <TabPanel value="payments">
              <Text>Payments</Text>
            </TabPanel>
            <TabPanel value="refunds">
              <Text>Refunds</Text>
            </TabPanel>
            <TabPanel value="disputes">
              <Text>Disputes</Text>
            </TabPanel>
          </Tabs>
        </Box>
      );
    };
    const { getByTestId, getByRole } = renderWithTheme(<ControlledTabExample />);

    expect(getByTestId(selectedTabTestId)).toHaveTextContent('refunds');
    expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-selected', 'true');

    expect(queryTabPanelByText('Payments')).not.toBeVisible();
    expect(queryTabPanelByText('Refunds')).toBeVisible();
    expect(queryTabPanelByText('Disputes')).not.toBeVisible();

    await user.click(getByRole('tab', { name: 'Disputes' }));
    expect(getByRole('tab', { name: 'Disputes' })).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId(selectedTabTestId)).toHaveTextContent('disputes');

    // click on button to change to payments
    await user.click(getByRole('button', { name: 'Change to Payments' }));
    expect(getByTestId(selectedTabTestId)).toHaveTextContent('payments');
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');
  });

  it('should skip disabled tabs', () => {
    const { getByRole } = renderWithTheme(
      <Tabs>
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds" isDisabled>
            Refunds
          </TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );

    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');
    // The tab is a disabled button
    // so no need to check if clicking it actually prevents the tab from switching
    expect(getByRole('tab', { name: 'Refunds' })).toBeDisabled();
  });

  it('should work with isLazy prop', () => {
    const { queryAllByRole } = renderWithTheme(
      <Tabs isLazy defaultValue="refunds">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
        <TabPanel value="disputes">
          <Text>Disputes</Text>
        </TabPanel>
      </Tabs>,
    );

    // should only render active tab panel
    expect(queryAllByRole('tabpanel', { hidden: true })).toHaveLength(1);
    expect(queryTabPanelByText('Payments')).not.toBeInTheDocument();
    expect(queryTabPanelByText('Refunds')).toBeInTheDocument();
    expect(queryTabPanelByText('Disputes')).not.toBeInTheDocument();
  });

  it('should not have any a11y violations', async () => {
    const { container } = renderWithTheme(
      <Tabs defaultValue="refunds">
        <TabList>
          <TabItem value="payments">Payments</TabItem>
          <TabItem value="refunds">Refunds</TabItem>
          <TabItem value="disputes">Disputes</TabItem>
        </TabList>

        <TabPanel value="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds">
          <Text>Refunds</Text>
        </TabPanel>
        <TabPanel value="disputes">
          <Text>Disputes</Text>
        </TabPanel>
      </Tabs>,
    );

    await assertAccessible(container);
  });

  it('should support adding data-analytics attribute', () => {
    const { container } = renderWithTheme(
      <Tabs data-analytics-tab="userOptions">
        <TabList>
          <TabItem value="payments" data-analytics-tab-item="payments">
            Payments
          </TabItem>
          <TabItem value="refunds" data-analytics-tab-item="refunds" isDisabled>
            Refunds
          </TabItem>
        </TabList>
        <TabPanel value="payments" data-analytics-tab-panel="payments">
          <Text>Payments</Text>
        </TabPanel>
        <TabPanel value="refunds" data-analytics-tab-panel="refunds">
          <Text>Refunds</Text>
        </TabPanel>
      </Tabs>,
    );
    expect(container).toMatchSnapshot();
  });

  test('TabItems should respond to click events', async () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <Tabs>
        <TabList>
          <TabItem value="payments" onClick={onClick}>
            Payments
          </TabItem>
        </TabList>
      </Tabs>,
    );

    expect(onClick).not.toHaveBeenCalled();
    await userEvent.click(getByRole('tab', { name: 'Payments' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('TabItems can render as link', () => {
    const { getByRole } = renderWithTheme(
      <Tabs>
        <TabList>
          <TabItem value="payments" href="https://www.google.com">
            Payments
          </TabItem>
        </TabList>
      </Tabs>,
    );

    expect(getByRole('tab', { name: 'Payments' }).tagName).toBe('A');
    expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute(
      'href',
      'https://www.google.com',
    );
  });
  describe('selectedEmphasis', () => {
    const lightColors = klear360Theme.colors.onLight;
    const renderFilledTabs = (
      selectedEmphasis?: 'subtle' | 'intense',
    ): ReturnType<typeof renderWithTheme> =>
      renderWithTheme(
        <Tabs variant="filled" selectedEmphasis={selectedEmphasis} defaultValue="intake">
          <TabList>
            <TabItem value="exceptions">Exceptions</TabItem>
            <TabItem value="intake">Intake</TabItem>
            <TabItem value="temps">Temps</TabItem>
          </TabList>
        </Tabs>,
      );
    const getIndicator = (container: HTMLElement): Element =>
      container.querySelector('[data-klear360-component="tab-indicator"]')!;

    it('keeps the white pill and default selected text by default', () => {
      const { container, getByRole } = renderFilledTabs();

      expect(getIndicator(container)).toHaveStyle({
        backgroundColor: lightColors.surface.background.gray.intense,
      });
      expect(getByRole('tab', { name: 'Intake' }).querySelector('p')).toHaveStyle({
        color: lightColors.interactive.text.gray.normal,
      });
    });

    it('draws a primary pill with white text for the selected tab when "intense"', () => {
      const { container, getByRole } = renderFilledTabs('intense');

      expect(getIndicator(container)).toHaveStyle({
        backgroundColor: lightColors.surface.background.primary.intense,
      });
      expect(getByRole('tab', { name: 'Intake' }).querySelector('p')).toHaveStyle({
        color: lightColors.surface.text.staticWhite.normal,
      });
      // Unselected tabs keep their normal (unfilled) colors.
      expect(getByRole('tab', { name: 'Temps' }).querySelector('p')).toHaveStyle({
        color: lightColors.interactive.text.gray.muted,
      });
    });

    it('moves the white text along with the selection', () => {
      const { getByRole } = renderFilledTabs('intense');

      fireEvent.click(getByRole('tab', { name: 'Temps' }));
      expect(getByRole('tab', { name: 'Temps' })).toHaveAttribute('aria-selected', 'true');
      expect(getByRole('tab', { name: 'Temps' }).querySelector('p')).toHaveStyle({
        color: lightColors.surface.text.staticWhite.normal,
      });
      expect(getByRole('tab', { name: 'Intake' }).querySelector('p')).toHaveStyle({
        color: lightColors.interactive.text.gray.muted,
      });
    });

    it('matches snapshot', () => {
      const { baseElement } = renderFilledTabs('intense');
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('aria-controls', () => {
    it('is omitted when Tabs are used without TabPanels', async () => {
      const { getAllByRole, getByRole } = renderWithTheme(
        <Tabs variant="filled" selectedEmphasis="intense" defaultValue="intake">
          <TabList>
            <TabItem value="exceptions">Exceptions</TabItem>
            <TabItem value="intake">Intake</TabItem>
          </TabList>
        </Tabs>,
      );

      getAllByRole('tab').forEach((tab) => expect(tab).not.toHaveAttribute('aria-controls'));
      // Still announced as a tab list: "tab, 2 of 2, selected".
      expect(getByRole('tablist')).toBeInTheDocument();
      expect(getByRole('tab', { name: 'Intake' })).toHaveAttribute('aria-selected', 'true');
      await assertAccessible(getByRole('tablist'));
    });

    it('points at the rendered panel when TabPanels are present', () => {
      const { getByRole } = renderWithTheme(
        <Tabs defaultValue="payments">
          <TabList>
            <TabItem value="payments">Payments</TabItem>
            <TabItem value="refunds">Refunds</TabItem>
          </TabList>
          <TabPanel value="payments">
            <Text>Payments</Text>
          </TabPanel>
          <TabPanel value="refunds">
            <Text>Refunds</Text>
          </TabPanel>
        </Tabs>,
      );

      ['Payments', 'Refunds'].forEach((name) => {
        const tab = getByRole('tab', { name });
        const panelId = tab.getAttribute('aria-controls');
        expect(panelId).toBeTruthy();
        expect(document.getElementById(panelId!)).toBeInTheDocument();
      });
    });

    it('only points lazy tabs at a panel once it is rendered', () => {
      const { getByRole } = renderWithTheme(
        <Tabs defaultValue="payments" isLazy>
          <TabList>
            <TabItem value="payments">Payments</TabItem>
            <TabItem value="refunds">Refunds</TabItem>
          </TabList>
          <TabPanel value="payments">
            <Text>Payments</Text>
          </TabPanel>
          <TabPanel value="refunds">
            <Text>Refunds</Text>
          </TabPanel>
        </Tabs>,
      );

      expect(getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-controls');
      expect(getByRole('tab', { name: 'Refunds' })).not.toHaveAttribute('aria-controls');

      fireEvent.click(getByRole('tab', { name: 'Refunds' }));
      expect(getByRole('tab', { name: 'Refunds' })).toHaveAttribute('aria-controls');
      expect(getByRole('tab', { name: 'Payments' })).not.toHaveAttribute('aria-controls');
    });
  });
});
