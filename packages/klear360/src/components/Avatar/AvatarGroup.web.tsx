import React from 'react';
import type { AvatarGroupProps, AvatarGroupContextType } from './types';
import { StyledAvatarGroup } from './StyledAvatarGroup';
import { StyledAvatar } from './StyledAvatar';
import { AvatarGroupProvider } from './AvatarGroupContext';
import { avatarTextSizeMapping } from './avatarTokens';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwKlear360Error } from '~utils/logger';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _AvatarGroup = ({
  children,
  size = 'medium',
  density = 'compact',
  maxCount,
  testID,
  ...rest
}: AvatarGroupProps): React.ReactElement => {
  const contextValue: AvatarGroupContextType = {
    size,
  };
  const childrenCount = React.Children.count(children);

  return (
    <AvatarGroupProvider value={contextValue}>
      <StyledAvatarGroup
        {...metaAttribute({ name: MetaConstants.AvatarGroup, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
        role="group"
        size={size}
        density={density}
      >
        {React.Children.map(children, (child, index) => {
          if (__DEV__) {
            // throw error if child is not an Avatar
            if (!isValidAllowedChildren(child, 'Avatar')) {
              throwKlear360Error({
                moduleName: 'AvatarGroup',
                message: `Only "Avatar" component is allowed as a children.`,
              });
            }
          }

          if (maxCount && maxCount <= childrenCount) {
            if (index === maxCount) {
              const overflowText = `+${String(childrenCount - maxCount)}`;
              return (
                <StyledAvatar
                  {...metaAttribute({ name: MetaConstants.Avatar, testID })}
                  backgroundColor="surface.background.gray.subtle"
                  size={size}
                  variant="circle"
                >
                  <BaseBox
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="100%"
                  >
                    {size === 'xlarge' ? (
                      <Heading
                        size="small"
                        weight="semibold"
                        color="interactive.text.neutral.muted"
                        textAlign="center"
                      >
                        {overflowText}
                      </Heading>
                    ) : (
                      <Text
                        size={avatarTextSizeMapping[size]}
                        weight="semibold"
                        color="interactive.text.neutral.muted"
                        textAlign="center"
                      >
                        {overflowText}
                      </Text>
                    )}
                  </BaseBox>
                </StyledAvatar>
              );
            }

            if (index > maxCount) {
              return null;
            }
          }

          return child;
        })}
      </StyledAvatarGroup>
    </AvatarGroupProvider>
  );
};

/**
 * ### AvatarGroup Component
 *
 * The AvatarGroup component is used to group Avatars together.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
  const App = () => {
    return (
      <AvatarGroup>
        <Avatar name="Jordan Hale" />
        <Avatar name="Rama Krushna Behera" />
        <Avatar name="Riley Novak" />
        <Avatar name="Maya Chen" />
        <Avatar name="Nitin Kumar" />
      </AvatarGroup>
    );
  }
 * ```
 *
 *  ---
 *
 * Checkout {@link https://klear360.klear.com/?path=/docs/components-avatar-avatargroup AvatarGroup Documentation}
 *
 */
const AvatarGroup = assignWithoutSideEffects(_AvatarGroup, {
  displayName: 'AvatarGroup',
  componentId: 'AvatarGroup',
});

export { AvatarGroup };
export type { AvatarGroupProps };
