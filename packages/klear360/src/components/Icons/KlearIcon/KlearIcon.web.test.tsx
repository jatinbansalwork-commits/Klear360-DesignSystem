import KlearIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearIcon />', () => {
  it('should render KlearIcon', () => {
    const { container } = renderWithTheme(
      <KlearIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
