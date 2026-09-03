import type { StoryFn, Meta } from '@storybook/react-vite';
import { Avatar as AvatarComponent } from '../Avatar';
import type { AvatarGroupProps } from '../AvatarGroup';
import { AvatarGroup as AvatarGroupComponent } from '../AvatarGroup';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AvatarGroup"
      componentDescription="The AvatarGroup component is used to group Avatars together."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Klear360-DSL?node-id=88229-1519025&m=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { Avatar, AvatarGroup } from '@klear/klear360/components';

        function App() {
          return (
            <AvatarGroup>
              <Avatar color="primary" name="Jordan Hale" />
              <Avatar color="positive" name="Rama Krushna Behera" />
              <Avatar color="negative" name="Riley Novak" />
              <Avatar color="notice" name="Maya Chen" />
              <Avatar color="information" name="Nitin Kumar" />
            </AvatarGroup>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Avatar/AvatarGroup',
  component: AvatarGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<AvatarGroupProps>;

const AvatarGroupTemplate: StoryFn<typeof AvatarGroupComponent> = (args) => {
  const names = [
    'Maya Chen',
    'Jordan Hale',
    'Rama Krushna Behera',
    'Nitin Kumar',
    'Riley Novak',
  ] as const;
  const colors = ['primary', 'positive', 'negative', 'information', 'notice'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <AvatarGroupComponent {...args}>
        {names.map((name, index) => (
          <AvatarComponent key={name} name={name} color={colors[index]} />
        ))}
      </AvatarGroupComponent>
    </Box>
  );
};

export const Default = AvatarGroupTemplate.bind({});
Default.storyName = 'Default';

export const MaxCount = AvatarGroupTemplate.bind({});
MaxCount.storyName = 'Max Count';
MaxCount.args = {
  maxCount: 3,
  size: 'medium',
};

const AvatarGroupSizesTemplate: StoryFn<typeof AvatarGroupComponent> = (args) => {
  const names = [
    'Maya Chen',
    'Jordan Hale',
    'Rama Krushna Behera',
    'Nitin Kumar',
    'Riley Novak',
  ] as const;
  const colors = ['primary', 'positive', 'negative', 'information', 'notice'] as const;
  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {sizes.map((size) => (
        <Box
          key={size}
          display="flex"
          flex="1 1 auto"
          alignItems="center"
          justifyItems="center"
          alignContent="center"
          gap="spacing.5"
          flexWrap="nowrap"
          width="250px"
        >
          <Box width="50px">
            <Heading>{size}</Heading>
          </Box>
          <Box display="flex" flex="1 1 auto" justifyContent="center">
            <AvatarGroupComponent {...args} size={size}>
              {names.map((name, index) => (
                <AvatarComponent key={name} name={name} color={colors[index]} />
              ))}
            </AvatarGroupComponent>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const AllSizes = AvatarGroupSizesTemplate.bind({});
AllSizes.storyName = 'All Sizes';
