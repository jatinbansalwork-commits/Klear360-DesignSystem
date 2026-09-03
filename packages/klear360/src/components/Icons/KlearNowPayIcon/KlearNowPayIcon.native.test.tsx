import KlearNowPayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearNowPayIcon />', () => {
  it('should render KlearNowPayIcon', () => {
    const renderTree = renderWithTheme(
      <KlearNowPayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
