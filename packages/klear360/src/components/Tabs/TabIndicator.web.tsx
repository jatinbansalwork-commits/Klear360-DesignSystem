/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import { useTabsContext } from './TabsContext';
import { getTabIndicatorClasses } from './getTabsModuleClasses';
import { intenseSelected } from './tabTokens';
import getIn from '~utils/lodashButBetter/get';
import { castWebType, makeMotionTime } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useTheme } from '~components/Klear360Provider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useResize } from '~utils/useResize';
import BaseBox from '~components/Box/BaseBox';

const TabIndicator = ({
  tabListContainerRef,
}: {
  tabListContainerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement => {
  const { theme } = useTheme();
  const { selectedValue, baseId, variant, isVertical, size, selectedEmphasis } = useTabsContext();
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0, x: 0, y: 0 });

  const updateDimensions = React.useCallback(() => {
    const activeTabItem = document.getElementById(`${baseId}-${selectedValue}-tabitem`);
    if (!activeTabItem || activeTabItem.offsetWidth === 0) return;

    const v = variant === 'borderless' ? 'bordered' : variant;

    setDimensions({
      width: activeTabItem.offsetWidth,
      height: activeTabItem.offsetHeight,
      x: activeTabItem.offsetLeft,
      y:
        v === 'filled' || isVertical
          ? activeTabItem.offsetTop
          : activeTabItem.offsetTop + activeTabItem.offsetHeight - 1.5,
    });

    setShouldAnimate((prev) => {
      if (!prev) requestAnimationFrame(() => setShouldAnimate(true));
      return prev;
    });
  }, [baseId, selectedValue, variant, isVertical]);

  useIsomorphicLayoutEffect(() => {
    if (!selectedValue) return;
    updateDimensions();
  }, [baseId, selectedValue, updateDimensions]);

  React.useEffect(() => {
    if ('fonts' in document) {
      try {
        void document.fonts.ready.then(() => {
          updateDimensions();
        });
      } catch (err: unknown) {
        /* empty */
      }
    }
  }, [updateDimensions]);

  useResize(tabListContainerRef, updateDimensions);

  const transitionProps = {
    transitionProperty: 'transform, width, height, background-color',
    transitionDuration: shouldAnimate
      ? castWebType(makeMotionTime(theme.motion.duration.moderate))
      : '0ms',
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
  };

  const indicatorClass = getTabIndicatorClasses({
    variant: variant!,
    isVertical,
    size: size!,
    selectedEmphasis,
  });

  const isSmallHorizontal = size === 'small' && !isVertical && variant === 'filled';

  const borderedIndicatorColor = theme.colors.interactive.border.neutral.highlighted;
  const filledIndicatorColor =
    selectedEmphasis === 'intense'
      ? getIn(theme.colors, intenseSelected.indicatorBackgroundColor)
      : theme.colors.surface.background.gray.intense;

  if (isVertical && variant !== 'filled') {
    return (
      <BaseBox
        pointerEvents="none"
        className={indicatorClass}
        style={{
          ...transitionProps,
          height: `${dimensions.height}px`,
          transform: `translateY(${dimensions.y}px)`,
          backgroundColor: borderedIndicatorColor,
        }}
        {...metaAttribute({ name: MetaConstants.TabIndicator })}
      />
    );
  }

  if (variant === 'filled') {
    return (
      <BaseBox
        pointerEvents="none"
        className={indicatorClass}
        style={{
          ...transitionProps,
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
          backgroundColor: filledIndicatorColor,
          ...(isSmallHorizontal ? { borderRadius: 6 } : {}),
        }}
        {...metaAttribute({ name: MetaConstants.TabIndicator })}
      />
    );
  }

  return (
    <BaseBox
      pointerEvents="none"
      className={indicatorClass}
      style={{
        ...transitionProps,
        width: `${dimensions.width}px`,
        transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
        backgroundColor: borderedIndicatorColor,
      }}
      {...metaAttribute({ name: MetaConstants.TabIndicator })}
    />
  );
};

export { TabIndicator };
