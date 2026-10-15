import KlearLogoIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearLogoIcon />', () => {
  it('should render KlearLogoIcon', () => {
    const renderTree = renderWithTheme(
      <KlearLogoIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
