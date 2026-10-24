import React from 'react';
import { Composite } from '@floating-ui/react';
import { useTabsContext } from './TabsContext';
import { TabIndicator } from './TabIndicator';
import { trackColor } from './tabTokens';
import {
  getHorizontalTrackClass,
  getTabListInnerClasses,
  getTabListScrollableClass,
  getVerticalTrackClass,
} from './getTabsModuleClasses';
import styles from './Tabs.module.scss';
import BaseBox from '~components/Box/BaseBox';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { DataAnalyticsAttribute } from '~utils/types';

const TabList = ({
  children,
  ...rest
}: { children: React.ReactNode } & StyledPropsKlear360 &
  DataAnalyticsAttribute): React.ReactElement => {
  const { setSelectedValue, selectedValue, variant, isVertical, size } = useTabsContext();
  const tabListContainerRef = React.useRef<HTMLDivElement>(null);
  const isBordered = variant === 'bordered';
  const isFilled = variant === 'filled';

  useIsomorphicLayoutEffect(() => {
    if (selectedValue) return;
    const first = React.Children.toArray(children)[0];
    if (React.isValidElement(first)) {
      setSelectedValue?.(() => first.props.value, true);
    }
  }, [children, selectedValue, setSelectedValue]);

  const outerClass = [
    styles.tabListOuter,
    isVertical ? styles.tabListOuterVertical : styles.tabListOuterHorizontal,
  ].join(' ');

  return (
    <BaseBox
      {...getStyledProps(rest)}
      {...metaAttribute({ name: MetaConstants.TabList })}
      {...makeAnalyticsAttribute(rest)}
      className={outerClass}
    >
      <BaseBox
        className={getTabListScrollableClass()}
        position="relative"
        whiteSpace="nowrap"
        flex="1 1 auto"
        width="100%"
        overflow="auto hidden"
      >
        <Composite
          render={(htmlProps) => {
            return (
              <BaseBox flexDirection="row" display="flex" className={styles.tabListScrollRow}>
                {isVertical && isBordered ? (
                  <BaseBox
                    className={getVerticalTrackClass()}
                    width="0px"
                    height="auto"
                    flexGrow={1}
                    flexShrink={0}
                    borderColor={trackColor}
                    borderWidth="thin"
                  />
                ) : null}
                <div
                  {...htmlProps}
                  ref={tabListContainerRef}
                  role="tablist"
                  className={getTabListInnerClasses({
                    variant: variant!,
                    isVertical,
                    size: size!,
                  })}
                  style={{ flexGrow: 1, width: '100%' }}
                >
                  {children}
                </div>
              </BaseBox>
            );
          }}
        />
        {!(isVertical && isFilled) ? (
          <TabIndicator tabListContainerRef={tabListContainerRef} />
        ) : null}
      </BaseBox>
      {!isVertical && isBordered ? (
        <BaseBox className={getHorizontalTrackClass()} borderBottomColor={trackColor} />
      ) : null}
    </BaseBox>
  );
};

export { TabList };
