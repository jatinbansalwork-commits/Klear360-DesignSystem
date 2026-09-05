import KlearLogoIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearLogoIcon />', () => {
  it('should render KlearLogoIcon', () => {
    const { container } = renderWithTheme(
      <KlearLogoIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
