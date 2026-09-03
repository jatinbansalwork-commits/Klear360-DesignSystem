import KlearTrustIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearTrustIcon />', () => {
  it('should render KlearTrustIcon', () => {
    const renderTree = renderWithTheme(
      <KlearTrustIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
