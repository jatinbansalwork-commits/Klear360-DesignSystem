import KlearxPayrollIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearxPayrollIcon />', () => {
  it('should render KlearxPayrollIcon', () => {
    const renderTree = renderWithTheme(
      <KlearxPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
