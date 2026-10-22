import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import type { ToastProps } from '../types';
import { useToast } from '../useToast';
import { ToastContainer } from '../ToastContainer';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Button } from '~components/Button';
import { Box } from '~components/Box';

const ToastExample = (
  // eslint-disable-next-line react/no-unused-prop-types -- `content` is used, just indirectly via the `...props` spread into `toast.show()` below, which the rule's static analysis can't see
  props: Partial<ToastProps> & { content: string },
): React.ReactElement => {
  const toast = useToast();

  // Each test starts from a clean slate - react-hot-toast's store is module-level global state
  // shared across every test in this file.
  React.useEffect(() => {
    toast.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Button onClick={() => toast.show({ type: 'informational', ...props })}>Show Toast</Button>
      <ToastContainer />
    </Box>
  );
};

describe('useToast / ToastContainer', () => {
  it('renders nothing until show() is called', () => {
    const { queryByText } = renderWithTheme(<ToastExample content="Payment successful" />);
    expect(queryByText('Payment successful')).not.toBeInTheDocument();
  });

  it('renders the toast content after show() is called', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText } = renderWithTheme(
      <ToastExample content="Payment successful" />,
    );

    await user.click(getByRole('button', { name: 'Show Toast' }));

    expect(await findByText('Payment successful')).toBeInTheDocument();
  });

  it('dismisses a shown toast', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText, queryByText } = renderWithTheme(
      <ToastExample content="Payment successful" autoDismiss={false} />,
    );

    await user.click(getByRole('button', { name: 'Show Toast' }));
    await findByText('Payment successful');

    const DismissExample = (): React.ReactElement => {
      const toast = useToast();
      return <Button onClick={() => toast.dismiss()}>Dismiss</Button>;
    };
    const { getByRole: getDismissButton } = renderWithTheme(<DismissExample />);
    await user.click(getDismissButton('button', { name: 'Dismiss' }));

    await waitFor(() => expect(queryByText('Payment successful')).not.toBeInTheDocument());
  });

  // Documented business rule in useToast.web.tsx: a second promotional toast is suppressed
  // while one is already showing, so promotional toasts never stack on top of each other. A real
  // app renders exactly one ToastContainer globally with multiple independent triggers, so this
  // uses one shared container rather than one per trigger (which would double-render any shown
  // toast, since both would subscribe to the same global store).
  const TwoPromoTriggers = (): React.ReactElement => {
    const toast = useToast();
    React.useEffect(() => {
      toast.dismiss();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <Box>
        <Button onClick={() => toast.show({ type: 'promotional', content: 'First promo' })}>
          Show First
        </Button>
        <Button onClick={() => toast.show({ type: 'promotional', content: 'Second promo' })}>
          Show Second
        </Button>
        <ToastContainer />
      </Box>
    );
  };

  it('suppresses a second promotional toast while one is already showing', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText, queryByText } = renderWithTheme(<TwoPromoTriggers />);

    await user.click(getByRole('button', { name: 'Show First' }));
    await findByText('First promo');

    await user.click(getByRole('button', { name: 'Show Second' }));

    expect(queryByText('Second promo')).not.toBeInTheDocument();
  });
});
