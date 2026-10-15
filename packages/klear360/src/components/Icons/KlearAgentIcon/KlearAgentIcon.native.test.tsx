import KlearAgentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearAgentIcon />', () => {
  it('should render KlearAgentIcon', () => {
    const renderTree = renderWithTheme(
      <KlearAgentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
