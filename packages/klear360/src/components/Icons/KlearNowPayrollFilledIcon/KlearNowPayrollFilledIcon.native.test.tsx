import KlearNowPayrollFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearNowPayrollFilledIcon />', () => {
  it('should render KlearNowPayrollFilledIcon', () => {
    const renderTree = renderWithTheme(
      <KlearNowPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
