/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import { useTopNavContext } from '../TopNavContext';
import type { TabNavItemProps, TabNavIconProp } from './types';
import { useTabNavContext } from './TabNavContext';
import styles from './TabNav.module.scss';
import {
  getTabNavItemStyles,
  getTabNavItemWrapperStyles,
} from './getTabNavItemStyles';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useTheme } from '~components/Klear360Provider';
import type { Theme } from '~components/Klear360Provider';
import type { IconComponent } from '~components/Icons';
import { KlearAgentIcon } from '~components/Icons';

const isIconObjectProp = (
  icon: TabNavIconProp,
): icon is { default: IconComponent; selected: IconComponent } => {
  return typeof icon === 'object' && icon !== null && 'default' in icon;
};

const isKlearAgentIcon = (icon?: TabNavIconProp): boolean => {
  if (!icon) return false;
  const defaultIcon = isIconObjectProp(icon) ? icon.default : icon;
  return defaultIcon === KlearAgentIcon;
};

const getGlowColor = ({
  icon,
  isPrimaryVariant,
  theme,
}: {
  icon?: TabNavIconProp;
  isPrimaryVariant: boolean;
  theme: Theme;
}): string => {
  if (isKlearAgentIcon(icon) && !isPrimaryVariant) return theme.colors.surface.icon.onSea.onSubtle;
  if (isPrimaryVariant) return theme.colors.surface.icon.staticWhite.normal;
  return theme.colors.surface.background.primary.intense;
};

const getForegroundColors = (
  isPrimaryVariant: boolean,
  theme: Theme,
): {
  normal: string;
  subtle: string;
  hover: string;
} => {
  if (isPrimaryVariant) {
    return {
      normal: theme.colors.interactive.text.onPrimary.normal,
      subtle: theme.colors.interactive.text.onPrimary.muted,
      hover: theme.colors.interactive.text.onPrimary.normal,
    };
  }
  return {
    normal: theme.colors.surface.text.staticWhite.normal,
    subtle: theme.colors.surface.text.staticWhite.subtle,
    hover: theme.colors.interactive.text.staticWhite.normal,
  };
};

const getIconColor = (isPrimaryVariant: boolean, isActive: boolean | undefined) => {
  if (isPrimaryVariant) {
    return isActive ? 'interactive.icon.onPrimary.normal' : 'interactive.icon.onPrimary.muted';
  }
  return isActive ? 'surface.icon.staticWhite.normal' : 'surface.icon.staticWhite.subtle';
};

const _TabNavItem: React.ForwardRefRenderFunction<HTMLAnchorElement, TabNavItemProps> = (
  {
    as,
    title,
    isActive,
    icon,
    trailing,
    titleSuffix,
    accessibilityLabel,
    href,
    target,
    // @ts-expect-error - This prop is only used internally
    __isInsideTabNavItems,
    // @ts-expect-error - This prop is only used internally
    __index,
    ...props
  },
  ref,
): React.ReactElement => {
  const { setControlledItems } = useTabNavContext();
  const { theme } = useTheme();
  const topNavContext = useTopNavContext();
  const bodyRef = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!bodyRef.current) return;
    if (!__isInsideTabNavItems) return;
    setControlledItems((prev) => {
      return prev.map((item, index) => {
        if (index !== __index) return item;
        const bounds = bodyRef?.current?.getBoundingClientRect()!;
        const tabWidth = bounds.width;
        const offsetX = bounds.right;
        return {
          ...item,
          tabWidth,
          offsetX,
        };
      });
    });
  }, [__isInsideTabNavItems, __index, setControlledItems]);

  let ResolvedIcon: IconComponent | undefined;
  if (icon) {
    if (isIconObjectProp(icon)) {
      ResolvedIcon = isActive ? icon.selected : icon.default;
    } else {
      ResolvedIcon = icon;
    }
  }

  const isPrimaryVariant = topNavContext?.variant === 'primary';
  const foregroundColors = getForegroundColors(isPrimaryVariant, theme);
  const glowColor = getGlowColor({ icon, isPrimaryVariant, theme });
  const iconColor = getIconColor(isPrimaryVariant, isActive);
  const Component = (as ?? (href ? 'a' : 'button')) as React.ElementType;

  return (
    <BaseBox
      ref={bodyRef}
      className={styles.itemWrapper}
      style={
        {
          ...getTabNavItemWrapperStyles({ theme, isActive }),
          ['--tab-nav-item-hover-color' as string]: foregroundColors.hover,
        } as React.CSSProperties
      }
      data-active={isActive ? 'true' : 'false'}
      data-glow-color={glowColor}
      {...metaAttribute({ name: MetaConstants.TabNavItem })}
    >
      <Component
        ref={ref as never}
        className={styles.itemLink}
        style={getTabNavItemStyles({ theme, isActive, foregroundColors })}
        {...(href && !as ? { href } : {})}
        {...(href && as ? { to: href } : {})}
        target={target}
        data-active={isActive ? 'true' : 'false'}
        {...props}
        {...metaAttribute({ name: MetaConstants.TabNavItemLink })}
        {...makeAccessible({ label: accessibilityLabel, current: isActive })}
      >
        {ResolvedIcon ? <ResolvedIcon size="medium" color={iconColor} /> : null}
        {title}
        {titleSuffix ? titleSuffix : null}
        {trailing ? trailing : null}
      </Component>
    </BaseBox>
  );
};

const TabNavItem = assignWithoutSideEffects(React.memo(React.forwardRef(_TabNavItem)), {
  displayName: 'TabNavItem',
});

export { TabNavItem };
