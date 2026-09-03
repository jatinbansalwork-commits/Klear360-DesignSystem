import KlearNowPayrollIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearNowPayrollIcon />', () => {
  it('should render KlearNowPayrollIcon', () => {
    const { container } = renderWithTheme(
      <KlearNowPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
