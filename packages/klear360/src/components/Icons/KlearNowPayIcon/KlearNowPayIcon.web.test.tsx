import KlearNowPayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearNowPayIcon />', () => {
  it('should render KlearNowPayIcon', () => {
    const { container } = renderWithTheme(
      <KlearNowPayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
