import KlearxPayrollFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearxPayrollFilledIcon />', () => {
  it('should render KlearxPayrollFilledIcon', () => {
    const renderTree = renderWithTheme(
      <KlearxPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
