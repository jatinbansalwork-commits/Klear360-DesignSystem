/* eslint-disable import/extensions */
import React from 'react';

import { AnnouncementBanner } from '..';
import { AnnouncementIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<AnnouncementBanner />', () => {
  it('should render default light treatment (centered, with icon) in a light app', () => {
    const { container } = renderWithTheme(
      <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render the dark treatment when app colorScheme is dark', () => {
    const { container } = renderWithTheme(
      <Klear360Provider themeTokens={klear360Theme} colorScheme="dark">
        <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>
      </Klear360Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render left aligned', () => {
    const { container } = renderWithTheme(
      <AnnouncementBanner alignment="left" icon={AnnouncementIcon}>
        Enter promotional text here
      </AnnouncementBanner>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should not render the icon when icon prop is omitted', () => {
    const { queryByRole } = renderWithTheme(
      <AnnouncementBanner>Enter promotional text here</AnnouncementBanner>,
    );

    expect(queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('should render children text', () => {
    const { getByText } = renderWithTheme(
      <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>,
    );

    expect(getByText('Enter promotional text here')).toBeInTheDocument();
  });

  it('should render inline Link inside the message', () => {
    const { getByRole } = renderWithTheme(
      <AnnouncementBanner>
        Your KYC is verified. <Link href="https://klear.com">View details</Link>
      </AnnouncementBanner>,
    );

    expect(getByRole('link', { name: 'View details' })).toBeInTheDocument();
  });

  it('should pass a11y with role region', async () => {
    const { getByRole } = renderWithTheme(
      <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>,
    );
    const banner = getByRole('region', { name: 'Announcement' });

    expect(banner).toBeInTheDocument();
    await assertAccessible(banner);
  });

  it('should use a custom accessibilityLabel', () => {
    const { getByRole } = renderWithTheme(
      <AnnouncementBanner accessibilityLabel="Promotion" icon={AnnouncementIcon}>
        Enter promotional text here
      </AnnouncementBanner>,
    );

    expect(getByRole('region', { name: 'Promotion' })).toBeInTheDocument();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <AnnouncementBanner testID="announcement-banner-test">Test</AnnouncementBanner>,
    );

    expect(getByTestId('announcement-banner-test')).toHaveAttribute(
      'data-klear360-component',
      'announcement-banner',
    );
  });

  it('should accept data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <AnnouncementBanner testID="announcement-banner-test" data-analytics-action="click">
        Test
      </AnnouncementBanner>,
    );

    expect(getByTestId('announcement-banner-test')).toHaveAttribute(
      'data-analytics-action',
      'click',
    );
  });

  it('should forward the ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithTheme(
      <AnnouncementBanner ref={ref} testID="announcement-banner-test">
        Test
      </AnnouncementBanner>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.getAttribute('data-klear360-component')).toBe('announcement-banner');
  });
});
