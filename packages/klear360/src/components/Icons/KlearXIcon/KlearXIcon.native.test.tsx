import KlearXIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearXIcon />', () => {
  it('should render KlearXIcon', () => {
    const renderTree = renderWithTheme(
      <KlearXIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
