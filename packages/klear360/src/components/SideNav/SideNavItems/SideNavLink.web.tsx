import React from 'react';
import { FloatingFocusManager, FloatingPortal, useFloating } from '@floating-ui/react';
import { NavLinkContext, useNavLink, useSideNav } from '../SideNavContext';
import { classes } from '../tokens';
import type { SideNavLinkProps } from '../types';
import linkStyles from './SideNavLink.module.scss';
import { getCurvedVerticalLineStyle, getNavLinkShellStyle } from './getSideNavLinkStyles';
import { makeAccessible } from '~utils/makeAccessible';
import { throwKlear360Error } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';
import { useFirstRender } from '~utils/useFirstRender';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useTruncationTitle } from '~utils/useTruncationTitle';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Collapsible, CollapsibleBody } from '~components/Collapsible';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '~components/Icons';
import { BaseText } from '~components/Typography/BaseText';
import { Text } from '~components/Typography';
import { useTheme } from '~components/Klear360Provider';

const { SHOW_ON_LINK_HOVER, HIDE_WHEN_COLLAPSED, STYLED_NAV_LINK } = classes;

const NavLinkIconTitle = ({
  icon: Icon,
  title,
  description,
  titleSuffix,
  isActive,
  trailing,
  isL1Item,
}: Pick<
  SideNavLinkProps,
  'title' | 'isActive' | 'trailing' | 'description' | 'icon' | 'titleSuffix'
> & {
  isL1Item: boolean;
}): React.ReactElement => {
  const { containerRef, textRef } = useTruncationTitle({ content: title });

  return (
    <Box width="100%" textAlign="left">
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
          {Icon ? (
            <BaseBox display="flex" flexDirection="row" alignItems="center">
              <Icon size="medium" color="currentColor" />
            </BaseBox>
          ) : null}
          <Box ref={containerRef as never} flex="1" minWidth="spacing.0">
            <BaseText
              ref={textRef as never}
              truncateAfterLines={1}
              color="currentColor"
              fontWeight={isActive ? 'semibold' : 'regular'}
              fontSize={100}
              lineHeight={100}
              as="p"
              className={isL1Item ? HIDE_WHEN_COLLAPSED : ''}
            >
              {title}
            </BaseText>
          </Box>
          {titleSuffix ? (
            <BaseBox display="flex" alignItems="center">
              {titleSuffix}
            </BaseBox>
          ) : null}
        </Box>
        <Box display="flex" alignItems="center">
          {trailing}
        </Box>
      </Box>
      {!isL1Item && description ? (
        <Text
          size="small"
          marginLeft="spacing.7"
          textAlign="left"
          weight="medium"
          color={isActive ? 'interactive.text.gray.subtle' : 'interactive.text.gray.muted'}
          truncateAfterLines={1}
        >
          {description}
        </Text>
      ) : null}
    </Box>
  );
};

const L3Trigger = ({
  title,
  description,
  icon,
  as,
  href,
  target,
  titleSuffix,
  tooltip,
  onClick,
}: Pick<
  SideNavLinkProps,
  | 'title'
  | 'description'
  | 'icon'
  | 'as'
  | 'href'
  | 'titleSuffix'
  | 'tooltip'
  | 'target'
  | 'onClick'
>): React.ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();
  const { theme } = useTheme();

  const toggleCollapse = (e: React.MouseEvent): void => {
    onClick?.(e);
    onExpandChange(!isExpanded);
  };
  const iconProps = {
    size: 'medium',
    color: 'currentColor',
  } as const;

  return (
    <TooltipifyComponent tooltip={tooltip}>
      <BaseBox
        className={linkStyles.navLinkContainer}
        style={getNavLinkShellStyle({ theme, hasDescription: Boolean(description) })}
      >
        <BaseBox
          className={STYLED_NAV_LINK}
          as={href ? as : 'button'}
          {...(href ? { to: href } : {})}
          target={target}
          onClick={(e: React.MouseEvent) => toggleCollapse(e)}
          {...makeAccessible({ expanded: isExpanded, controls: collapsibleBodyId })}
        >
          <NavLinkIconTitle
            title={title}
            description={description}
            icon={icon}
            isL1Item={false}
            titleSuffix={titleSuffix}
            trailing={
              isExpanded ? <ChevronUpIcon {...iconProps} /> : <ChevronDownIcon {...iconProps} />
            }
          />
        </BaseBox>
      </BaseBox>
    </TooltipifyComponent>
  );
};

const SideNavLink = ({
  title,
  description,
  href,
  children,
  titleSuffix,
  trailing,
  isActive,
  icon,
  tooltip,
  as,
  target,
  onClick,
  ...rest
}: SideNavLinkProps): React.ReactElement => {
  const { theme } = useTheme();
  const {
    l2PortalContainerRef,
    onLinkActiveChange,
    closeMobileNav,
    isL1Collapsed,
    isSideNavCollapsed,
    setIsL1Collapsed,
  } = useSideNav();
  const { level: _prevLevel } = useNavLink();
  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  const isL2Trigger = Boolean(children) && currentLevel === 1;
  const isL3Trigger = Boolean(children) && currentLevel === 2;

  if (__DEV__) {
    if (Boolean(children) && currentLevel >= 3) {
      throwKlear360Error({
        message:
          'SideNav only supports nesting upto L3 but L4 nesting was found. Check the nesting of your SideNavLevel items',
        moduleName: 'SideNavLink',
      });
    }

    if (currentLevel === 1 && Boolean(description)) {
      throwKlear360Error({
        message: 'Description is not supported for L1 items',
        moduleName: 'SideNavLink',
      });
    }
  }

  const isFirstRender = useFirstRender();

  const { refs, context } = useFloating({
    open: isActive,
  });

  useIsomorphicLayoutEffect(() => {
    onLinkActiveChange?.({
      level: currentLevel,
      title,
      isActive: Boolean(isActive),
      isL2Trigger,
      isFirstRender,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const shouldHideL1Item = currentLevel === 1 && !icon && isSideNavCollapsed;
  const hasDescription = currentLevel !== 1 && Boolean(description);

  return (
    <NavLinkContext.Provider value={{ level: currentLevel, title }}>
      {isL3Trigger ? (
        <Collapsible
          defaultIsExpanded={isActive}
          _dangerouslyDisableValidations={true}
          _shouldApplyWidthRestrictions={false}
        >
          <L3Trigger
            title={title}
            description={description}
            icon={icon}
            as={as}
            href={href}
            titleSuffix={titleSuffix}
            onClick={onClick}
          />
          <CollapsibleBody width="100%" _hasMargin={false}>
            <Box position="relative">{children}</Box>
          </CollapsibleBody>
        </Collapsible>
      ) : (
        <>
          <BaseBox
            className={linkStyles.navLinkContainer}
            style={getNavLinkShellStyle({ theme, hasDescription })}
            position="relative"
          >
            <TooltipifyComponent tooltip={tooltip}>
              <BaseBox
                className={`${STYLED_NAV_LINK} ${shouldHideL1Item ? HIDE_WHEN_COLLAPSED : ''}`}
                as={as ?? 'a'}
                {...(href ? { to: href } : {})}
                {...(as ? {} : { href })}
                target={target}
                ref={refs.setReference}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  if (!isL2Trigger) {
                    closeMobileNav?.();
                  }

                  if (isActive) {
                    onLinkActiveChange?.({
                      level: currentLevel,
                      title,
                      isActive: Boolean(isActive),
                      isL2Trigger,
                      isFirstRender: false,
                    });
                  }

                  onClick?.(e);
                }}
                onFocus={(e: React.FocusEvent<HTMLElement>) => {
                  const hasFocusRing = e.target instanceof HTMLElement && e.target.matches(':focus-visible');
                  if (isL1Collapsed && !isSideNavCollapsed && currentLevel === 1 && hasFocusRing) {
                    setIsL1Collapsed?.(false);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                data-level={currentLevel}
                data-l2trigger={isL2Trigger}
                {...makeAnalyticsAttribute(rest)}
              >
                <NavLinkIconTitle
                  icon={icon}
                  title={title}
                  description={description}
                  isActive={isActive}
                  isL1Item={currentLevel === 1}
                  titleSuffix={titleSuffix}
                />
                {isL2Trigger ? (
                  <BaseBox className={HIDE_WHEN_COLLAPSED} display="flex" alignItems="center">
                    <ChevronRightIcon size="medium" color="currentColor" />
                  </BaseBox>
                ) : null}
              </BaseBox>
            </TooltipifyComponent>
            {trailing && !isL2Trigger ? (
              <BaseBox
                position="absolute"
                top="spacing.0"
                right="spacing.2"
                height="100%"
                display="flex"
                alignItems="center"
                className={`${HIDE_WHEN_COLLAPSED} ${SHOW_ON_LINK_HOVER}`}
              >
                {trailing}
              </BaseBox>
            ) : null}
            {currentLevel === 3 && isActive ? (
              <BaseBox
                className={linkStyles.curvedVerticalLine}
                style={getCurvedVerticalLineStyle(theme)}
              />
            ) : null}
          </BaseBox>
          {children ? (
            <FloatingPortal root={l2PortalContainerRef}>
              {isActive && isL1Collapsed ? (
                <FloatingFocusManager modal={false} context={context} initialFocus={-1} returnFocus>
                  <BaseBox ref={refs.setFloating} height="100%">
                    {children}
                  </BaseBox>
                </FloatingFocusManager>
              ) : null}
            </FloatingPortal>
          ) : null}
        </>
      )}
    </NavLinkContext.Provider>
  );
};

export { SideNavLink };
