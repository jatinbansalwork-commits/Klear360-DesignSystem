import React from 'react';
import { Tag } from './Tag';
import type { AnimatedTagProps } from './types';
import { getAnimatedTagContainerClass } from './getTagModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/Klear360Provider';
import { makeMotionTime } from '~utils';

const AnimatedTag = ({
  children,
  currentTagIndex,
  isDisabled,
  activeTagIndex,
  onDismiss,
  size = 'medium',
}: AnimatedTagProps): React.ReactElement => {
  const { theme } = useTheme();
  const [isTagVisible, setIsTagVisible] = React.useState(true);
  const [hasCompletedShowAnimation, setHasCompletedShowAnimation] = React.useState(false);
  const dismissCompletedRef = React.useRef(false);

  const completeDismiss = React.useCallback((): void => {
    if (dismissCompletedRef.current) {
      return;
    }
    dismissCompletedRef.current = true;
    onDismiss({ tagIndex: currentTagIndex, tagName: children });
  }, [children, currentTagIndex, onDismiss]);

  React.useEffect(() => {
    if (!isTagVisible) {
      const durationMs = Number.parseFloat(makeMotionTime(theme.motion.duration.xquick));
      const id = window.setTimeout(completeDismiss, Number.isFinite(durationMs) ? durationMs : 150);
      return () => window.clearTimeout(id);
    }
    dismissCompletedRef.current = false;
    return undefined;
  }, [completeDismiss, isTagVisible, theme.motion]);

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
          completeDismiss();
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
