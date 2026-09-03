import KlearXIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearXIcon />', () => {
  it('should render KlearXIcon', () => {
    const { container } = renderWithTheme(
      <KlearXIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
