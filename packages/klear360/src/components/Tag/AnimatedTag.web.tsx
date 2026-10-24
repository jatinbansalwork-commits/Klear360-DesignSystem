import React from 'react';
import { Tag } from './Tag';
import type { AnimatedTagProps } from './types';
import { getAnimatedTagContainerClass } from './getTagModuleClasses';
import BaseBox from '~components/Box/BaseBox';

const AnimatedTag = ({
  children,
  currentTagIndex,
  isDisabled,
  activeTagIndex,
  onDismiss,
  size = 'medium',
}: AnimatedTagProps): React.ReactElement => {
  const [isTagVisible, setIsTagVisible] = React.useState(true);
  const [hasCompletedShowAnimation, setHasCompletedShowAnimation] = React.useState(false);

  return (
    <BaseBox
      className={getAnimatedTagContainerClass({
        isVisible: isTagVisible,
        isAnimatingShow: isTagVisible && !hasCompletedShowAnimation,
        isAnimatingDismiss: !isTagVisible,
      })}
      onAnimationEnd={() => {
        if (isTagVisible && !hasCompletedShowAnimation) {
          setHasCompletedShowAnimation(true);
        }
        if (!isTagVisible) {
          onDismiss({ tagIndex: currentTagIndex, tagName: children });
        }
      }}
    >
      <Tag
        _isVirtuallyFocused={currentTagIndex === activeTagIndex}
        _isTagInsideInput={true}
        onDismiss={() => {
          setIsTagVisible(false);
        }}
        marginRight="spacing.3"
        marginY="spacing.2"
        isDisabled={isDisabled}
        size={size}
      >
        {children}
      </Tag>
    </BaseBox>
  );
};

export { AnimatedTag };
