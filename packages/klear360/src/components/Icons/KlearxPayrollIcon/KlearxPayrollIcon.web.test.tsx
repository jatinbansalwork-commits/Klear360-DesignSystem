import KlearxPayrollIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearxPayrollIcon />', () => {
  it('should render KlearxPayrollIcon', () => {
    const { container } = renderWithTheme(
      <KlearxPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
