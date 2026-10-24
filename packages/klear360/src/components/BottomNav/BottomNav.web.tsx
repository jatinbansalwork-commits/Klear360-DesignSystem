import React from 'react';
import styles from './BottomNav.module.scss';
import type { BottomNavItemProps, BottomNavProps } from './types';
import { useTheme } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { throwKlear360Error } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { Klear360ElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { colors as globalColors } from '~tokens/global';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { componentZIndices } from '~utils/componentZIndices';

/**
 * ### BottomNav component
 *
 * Bottom navigation component is a persistent user interface element at the bottom of a mobile app screen, providing quick access to core functionalities through icons and labels.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * import { NavLink } from 'react-router-dom';
 *
 * <BottomNav>
 *   <BottomNavItem
 *     as={NavLink}
 *     isActive={true}
 *     title="Payments"
 *     icon={WalletIcon}
 *     href="/payments"
 *   />
 *   <BottomNavItem
 *     as={NavLink}
 *     title="Transactions"
 *     icon={TransactionsIcon}
 *     href="/transactions"
 *   />
 *   <BottomNavItem
 *     title="More"
 *     icon={MoreIcon}
 *     onClick={() => {
 *       // This can be used to open SideNav drawer
 *       setIsSideNavOpen(true)
 *     }}
 *   />
 * </BottomNav>
 * ```
 *
 * Checkout {@link https://klear360.klear.com/??path=/docs/components-bottomnav--doc BottomNav Documentation}

 */
const _BottomNav = (
  { children, zIndex = componentZIndices.bottomNav, testID, ...rest }: BottomNavProps,
  ref: React.Ref<Klear360ElementRef>,
): React.ReactElement => {
  const { colorScheme } = useTheme();

  if (__DEV__) {
    const childrenCount = React.Children.count(children);
    if (childrenCount > 5 && childrenCount < 2) {
      throwKlear360Error({
        moduleName: 'BottomNav',
        message: 'children cannot be less than 2 and more than 5',
      });
    }
  }

  const boxShadowColor =
    colorScheme === 'light'
      ? globalColors.neutral.blueGrayLight.a912
      : globalColors.neutral.black[100];

  return (
    <BaseBox
      ref={ref as never}
      role="navigation"
      position="fixed"
      bottom="spacing.0"
      left="spacing.0"
      width="100%"
      backgroundColor="surface.background.gray.intense"
      borderTopWidth="thin"
      borderTopColor="surface.border.gray.muted"
      paddingX="spacing.2"
      display="flex"
      flexDirection="row"
      style={{ boxShadow: `0px -8px 24px 0px ${boxShadowColor}` }}
      {...getStyledProps(rest)}
      zIndex={zIndex}
      {...metaAttribute({
        testID,
        name: MetaConstants.BottomNav,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

const BottomNavItem = ({
  title,
  href,
  rel,
  target,
  as,
  isActive,
  onClick,
  icon: Icon,
  testID,
  ...rest
}: BottomNavItemProps): React.ReactElement => {
  const isRouterLink = as && href;
  const defaultRenderElement = href ? 'a' : 'button';
  const defaultRel = target === '_blank' ? 'noreferrer noopener' : undefined;

  return (
    <BaseBox
      as={isRouterLink ? as : defaultRenderElement}
      href={as ? undefined : href}
      to={href} // for react router
      rel={rel ?? defaultRel}
      target={target}
      paddingTop="spacing.5"
      paddingBottom="spacing.4"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      flex="1"
      cursor="pointer"
      onClick={onClick}
      gap="spacing.1"
      className={styles.bottomNavItem}
      {...makeAccessible({
        current: isActive ? 'page' : undefined,
      })}
      {...metaAttribute({
        name: MetaConstants.BottomNavItem,
        testID,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      <Icon color="currentColor" size="large" />
      <Text truncateAfterLines={1} color="currentColor" size="xsmall" weight="semibold">
        {title}
      </Text>
    </BaseBox>
  );
};

const BottomNav = React.forwardRef(_BottomNav);

export { BottomNav, BottomNavItem };
