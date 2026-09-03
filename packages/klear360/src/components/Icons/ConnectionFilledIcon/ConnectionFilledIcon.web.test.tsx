import ConnectionFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ConnectionFilledIcon />', () => {
  it('should render ConnectionFilledIcon', () => {
    const { container } = renderWithTheme(
      <ConnectionFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
