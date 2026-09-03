import KlearNowPayrollFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearNowPayrollFilledIcon />', () => {
  it('should render KlearNowPayrollFilledIcon', () => {
    const { container } = renderWithTheme(
      <KlearNowPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
