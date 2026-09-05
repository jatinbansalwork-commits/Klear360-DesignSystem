import KlearAgentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearAgentIcon />', () => {
  it('should render KlearAgentIcon', () => {
    const { container } = renderWithTheme(
      <KlearAgentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
