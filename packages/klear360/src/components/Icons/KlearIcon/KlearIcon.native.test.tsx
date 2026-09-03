import KlearIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearIcon />', () => {
  it('should render KlearIcon', () => {
    const renderTree = renderWithTheme(
      <KlearIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
