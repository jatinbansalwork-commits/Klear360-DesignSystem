import KlearNowPayrollIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearNowPayrollIcon />', () => {
  it('should render KlearNowPayrollIcon', () => {
    const renderTree = renderWithTheme(
      <KlearNowPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
