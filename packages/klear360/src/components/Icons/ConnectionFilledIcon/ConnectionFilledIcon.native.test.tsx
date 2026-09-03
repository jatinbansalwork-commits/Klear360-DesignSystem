import ConnectionFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ConnectionFilledIcon />', () => {
  it('should render ConnectionFilledIcon', () => {
    const renderTree = renderWithTheme(
      <ConnectionFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
