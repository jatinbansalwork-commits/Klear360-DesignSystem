import ConnectionIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ConnectionIcon />', () => {
  it('should render ConnectionIcon', () => {
    const renderTree = renderWithTheme(
      <ConnectionIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
