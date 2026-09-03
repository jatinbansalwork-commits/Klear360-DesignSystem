import ConnectionIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ConnectionIcon />', () => {
  it('should render ConnectionIcon', () => {
    const { container } = renderWithTheme(
      <ConnectionIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
