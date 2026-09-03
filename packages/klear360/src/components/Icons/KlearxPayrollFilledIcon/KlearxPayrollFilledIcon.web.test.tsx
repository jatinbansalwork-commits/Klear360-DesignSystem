import KlearxPayrollFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearxPayrollFilledIcon />', () => {
  it('should render KlearxPayrollFilledIcon', () => {
    const { container } = renderWithTheme(
      <KlearxPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
