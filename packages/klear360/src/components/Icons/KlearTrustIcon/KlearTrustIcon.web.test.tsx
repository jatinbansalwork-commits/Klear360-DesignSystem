import KlearTrustIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearTrustIcon />', () => {
  it('should render KlearTrustIcon', () => {
    const { container } = renderWithTheme(
      <KlearTrustIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
