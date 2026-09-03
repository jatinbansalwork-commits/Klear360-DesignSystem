import dedent from 'dedent';

export const topNavFullExample = {
  'App.tsx': dedent`import React from 'react';
  import { BrowserRouter } from 'react-router-dom';
  import { TopNavExample } from './TopNavExample';

  const App = () => {
    return (
      <BrowserRouter>
        <TopNavExample />
      </BrowserRouter>
    );
  };

  export default App;
  `,
  'TopNavExample.tsx': dedent`import React from "react";
  import styled from "styled-components";
  import { Link, useLocation, useNavigate } from "react-router-dom";
  import { SideNavExample } from "./SideNavExample";
  import { isItemActive, KlearLogo } from "./utils";
  import {
    Box,
    Text,
    Heading,
    TopNav,
    TopNavBrand,
    TopNavContent,
    TopNavActions,
    TabNav,
    TabNavItem,
    TabNavItems,
    Menu,
    MenuItem,
    MenuOverlay,
    MenuHeader,
    MenuFooter,
    Badge,
    useTheme,
    HomeIcon,
    Button,
    Link as Klear360Link,
    SearchInput,
    Avatar,
    Tooltip,
    ActivityIcon,
    AnnouncementIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    KlearxPayrollIcon,
    List,
    ListItem,
    AcceptPaymentsIcon,
    MagicCheckoutIcon,
    AwardIcon,
    SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
    SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  } from "@klear/klear360/components";
  import { makeSize } from "@klear/klear360/utils";


  const TabNavItemLink = React.forwardRef((props, ref) => {
    const location = useLocation();
    return (
      <TabNavItem
        ref={ref}
        {...props}
        as={Link}
        isActive={isItemActive(location, {
          href: props.href,
          activeOnLinks: props.activeOnLinks,
        })}
      />
    );
  });

  const ExploreItem = ({
    icon: Icon,
    title,
    description,
  }) => {
    return (
      <Box display="flex" gap="spacing.4">
        <Box
          borderRadius="medium"
          padding="spacing.5"
          backgroundColor="surface.background.gray.subtle"
        >
          <Icon color="interactive.icon.neutral.subtle" size="medium" />
        </Box>
        <Box>
          <Text color="surface.text.gray.subtle" size="medium" weight="semibold">
            {title}
          </Text>
          <Text size="small" color="surface.text.gray.muted">
            {description}
          </Text>
        </Box>
      </Box>
    );
  };

  const DashboardBackground = styled.div(() => {
    return {
      height: "100vh",
      background:
        "radial-gradient(94.74% 64.44% at 29.03% 15.17%, #FFFFFF 0%, #90A5BB 100%)",
    };
  });

  const TopNavExample = () => {
    const { platform } = useTheme();
    const navigate = useNavigate();
    const isMobile = platform === "onMobile";
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(
      null
    );

    const activeUrl = useLocation().pathname;
    React.useEffect(() => {
      setSelectedProduct(activeUrl);
    }, [activeUrl]);

    return (
      <DashboardBackground>
        <Box backgroundColor="surface.background.gray.subtle">
          <TopNav>
            {isMobile ? (
              <>
                <Klear360Link icon={HomeIcon} size="medium" href="/home">
                  Home
                </Klear360Link>
                <Heading textAlign="center" size="small" weight="semibold">
                  Payments
                </Heading>
                <Menu openInteraction="click">
                  <Avatar size="medium" name="Maya Chen" />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box
                      display="flex"
                      gap="spacing.4"
                      padding="spacing.4"
                      alignItems="center"
                    >
                      <Avatar size="medium" name="John Doe" />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          John Doe
                        </Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          Klear Trusted Merchant
                        </Text>
                      </Box>
                    </Box>
                    <MenuItem>
                      <Text color="surface.text.gray.subtle">Settings</Text>
                    </MenuItem>
                    <MenuItem color="negative">
                      <Text color="feedback.text.negative.intense">Logout</Text>
                    </MenuItem>
                  </MenuOverlay>
                </Menu>
              </>
            ) : (
              <>
                <TopNavBrand>
                  <KlearLogo />
                </TopNavBrand>
                <TopNavContent>
                  <TabNav
                    items={[
                      { title: "Home", href: "/home", icon: HomeIcon },
                      {
                        href: "/payroll",
                        title: "Payroll",
                        icon: KlearxPayrollIcon,
                        description: "Automate payroll with ease.",
                      },
                      {
                        href: "/payments",
                        title: "Payments",
                        icon: AcceptPaymentsIcon,
                        description: "Manage payments effortlessly.",
                      },
                      {
                        href: "/magic-checkout",
                        title: "Express Checkout",
                        icon: MagicCheckoutIcon,
                        description: "Fast, one-click checkout.",
                      },
                      {
                        href: "/rize",
                        title: "Rize",
                        icon: AwardIcon,
                        isAlwaysOverflowing: true,
                        description: "Boost your business growth.",
                      },
                    ]}
                  >
                    {({ items, overflowingItems }) => {
                      const activeProduct = overflowingItems.find(
                        (item) => item.href === selectedProduct
                      );
                      return (
                        <>
                          <TabNavItems>
                            {items.map((item) => {
                              return (
                                <TabNavItemLink
                                  key={item.title}
                                  title={item.title}
                                  href={item.href}
                                  icon={item.icon}
                                />
                              );
                            })}
                          </TabNavItems>
                          {overflowingItems.length ? (
                            <Menu openInteraction="hover">
                              <TabNavItem
                                title={
                                  activeProduct
                                    ? \`More: $\{activeProduct.title}\`
                                    : "More"
                                }
                                trailing={<ChevronDownIcon />}
                                isActive={Boolean(activeProduct)}
                              />
                              <MenuOverlay>
                                <MenuHeader
                                  title="Products for you"
                                  trailing={
                                    <Badge emphasis="subtle" color="notice">
                                      Recommended
                                    </Badge>
                                  }
                                />
                                {overflowingItems.map((item) => {
                                  return (
                                    <MenuItem
                                      key={item.href}
                                      onClick={() => {
                                        navigate(item.href);
                                        setSelectedProduct(item.href);
                                      }}
                                    >
                                      <ExploreItem
                                        icon={item.icon}
                                        title={item.title}
                                        description={item.description}
                                      />
                                    </MenuItem>
                                  );
                                })}
                                <MenuFooter>
                                  <Klear360Link
                                    href=""
                                    icon={ChevronRightIcon}
                                    iconPosition="right"
                                  >
                                    View all products
                                  </Klear360Link>
                                </MenuFooter>
                              </MenuOverlay>
                            </Menu>
                          ) : null}
                        </>
                      );
                    }}
                  </TabNav>
                </TopNavContent>
                <TopNavActions>
                  <SearchInput
                    placeholder="Search in payments"
                    accessibilityLabel="Search Across Klear"
                  />
                  <Tooltip content="View Ecosystem Health">
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="tertiary"
                      icon={ActivityIcon}
                    />
                  </Tooltip>
                  <Tooltip content="View Announcements">
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="tertiary"
                      icon={AnnouncementIcon}
                    />
                  </Tooltip>
                  <Menu openInteraction="click">
                    <Avatar size="medium" name="Maya Chen" />
                    <MenuOverlay>
                      <MenuHeader title="Profile" />
                      <Box
                        display="flex"
                        gap="spacing.4"
                        padding="spacing.4"
                        alignItems="center"
                      >
                        <Avatar size="medium" name="John Doe" />
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap="spacing.2"
                        >
                          <Text size="medium" weight="semibold">
                            John Doe
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            Klear Trusted Merchant
                          </Text>
                        </Box>
                      </Box>
                      <MenuItem>
                        <Text color="surface.text.gray.subtle">Settings</Text>
                      </MenuItem>
                      <MenuItem color="negative">
                        <Text color="feedback.text.negative.intense">Logout</Text>
                      </MenuItem>
                    </MenuOverlay>
                  </Menu>
                </TopNavActions>
              </>
            )}
          </TopNav>
          <Box
            overflow="hidden"
            position="relative"
            borderRadius="large"
            borderTopRightRadius="none"
            borderBottomLeftRadius="none"
            borderBottomRightRadius="none"
            height="100%"
            marginX={{ base: "spacing.0", m: "spacing.3" }}
          >
            <SideNavExample
              isOpen={isSideBarOpen}
              onDismiss={() => {
                setIsSideBarOpen(false);
              }}
            />
            <Box
              marginLeft={{
                base: "100%",
                m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
                xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
              }}
              // 100vh - (topnav height [56px] + border [2px])
              height="calc(100vh - 58px)"
            >
              <Box
                height="100vh"
                padding="spacing.5"
                overflowY="scroll"
                backgroundColor="surface.background.gray.moderate"
              >
                <Box width={{ base: "max-content", m: "100%" }} height="200vh">
                  <Text marginBottom="spacing.4">This demo integrates:</Text>
                  <List>
                    <ListItem>SideNav</ListItem>
                    <ListItem>Menu (Explore Tab)</ListItem>
                    <ListItem>ReactRouter</ListItem>
                    <ListItem>Mobile Responsiveness</ListItem>
                    <ListItem>One Dashboard Layout</ListItem>
                  </List>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DashboardBackground>
    );
  };

  export { TopNavExample };
  `,
  'SideNavExample.tsx': dedent`import React from "react";
  import { Link, useLocation } from "react-router-dom";
  import { isItemActive } from "./utils";
  import {
    SideNav,
    SideNavBody,
    SideNavLevel,
    SideNavLink,
    SideNavSection,
    HomeIcon,
    LayoutIcon,
    PaymentButtonIcon,
    PaymentGatewayIcon,
    PaymentLinkIcon,
    PaymentPagesIcon,
  } from "@klear/klear360/components";

  const NavLink = (
    props
  ) => {
    const location = useLocation();

    return (
      <SideNavLink
        {...props}
        as={Link}
        isActive={isItemActive(location, {
          href: props.href,
          activeOnLinks: props.activeOnLinks,
        })}
      />
    );
  };

  const SideNavExample = ({
    isOpen,
    onDismiss,
  }) => {
    return (
      <SideNav isOpen={isOpen} onDismiss={onDismiss} position="absolute">
        <SideNavBody>
          <NavLink icon={HomeIcon} title="Home" href="/home" />
          <NavLink
            icon={LayoutIcon}
            title="L2 Trigger"
            href="/l2-item"
            activeOnLinks={["/l2-item", "/l2-item-2", "/l3-item", "/l3-item-2"]}
          >
            <SideNavLevel>
              <NavLink title="L2 Item" href="/l2-item" />
              <NavLink title="L2 Item 2" href="/l2-item-2" />
              <NavLink
                title="L3 Trigger"
                activeOnLinks={["/l3-item", "/l3-item-2"]}
              >
                <SideNavLevel>
                  <NavLink title="L3 Item" href="/l3-item" />
                  <NavLink title="L3 Item 2" href="/l3-item-2" />
                </SideNavLevel>
              </NavLink>
            </SideNavLevel>
          </NavLink>

          <SideNavSection title="Products" maxVisibleItems={2}>
            <NavLink icon={PaymentGatewayIcon} title="Gateway" href="/gateway" />
            <NavLink icon={PaymentLinkIcon} title="Links" href="/links" />
            <NavLink icon={PaymentPagesIcon} title="Pages" href="/pages" />
            <NavLink icon={PaymentButtonIcon} title="Button" href="/button" />
          </SideNavSection>
        </SideNavBody>
      </SideNav>
    );
  };

  export { SideNavExample };
`,
  'utils.tsx': dedent`import React from 'react';
  import { matchPath } from "react-router-dom";

  const isItemActive = (
    location,
    { href, activeOnLinks }
  ) => {
    const isCurrentPathActive = Boolean(matchPath(location.pathname, href));

    const isSubItemActive = Boolean(
      activeOnLinks?.find((href) => matchPath(location.pathname, href))
    );

    return isCurrentPathActive || isSubItemActive;
  };

  const KlearLogo = () => {
    return (
      <svg
        width="116"
        height="24"
        viewBox="0 0 116 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="logo">
          <rect x="0" y="2" width="20" height="20" rx="5" fill="#003F5B" />
          <path
            d="M5.6 6.8H8V11.6L12.4 6.8H15.5L10.6 12L15.8 17.2H12.7L8 12.4V17.2H5.6V6.8Z"
            fill="#FFFFFF"
          />
          <text
            x="27"
            y="17"
            fill="#192839"
            fontFamily="Inter, Roboto, sans-serif"
            fontSize="17"
            fontWeight="600"
            letterSpacing="-0.3"
          >
            Klear
          </text>
        </g>
      </svg>
    );
  };

  export { isItemActive, KlearLogo };
`,
};

export const tabNavExample = {
  'App.tsx': dedent`import React from 'react';
  import {
    Box,
    TabNav,
    TabNavItem,
    TabNavItems,
    Text,
    HomeIcon,
    KlearxPayrollIcon,
    AcceptPaymentsIcon,
    MagicCheckoutIcon,
    AwardIcon,
    ChevronDownIcon,
    Menu,
    MenuItem,
    MenuOverlay,
  } from '@klear/klear360/components';

  const App = () => {
    return (
      <Box padding="spacing.4">
        <TabNav
          items={[
            { title: 'Home', href: '/home', icon: HomeIcon },
            {
              href: '/payroll',
              title: 'Payroll',
              icon: KlearxPayrollIcon,
              description: 'Automate payroll with ease.',
            },
            {
              href: '/payments',
              title: 'Payments',
              icon: AcceptPaymentsIcon,
              description: 'Manage payments effortlessly.',
            },
            {
              href: '/magic-checkout',
              title: 'Express Checkout',
              icon: MagicCheckoutIcon,
              description: 'Fast, one-click checkout.',
            },
            {
              href: '/rize',
              title: 'Rize',
              icon: AwardIcon,
              isAlwaysOverflowing: true,
              description: 'Boost your business growth.',
            },
          ]}
        >
          {({ items, overflowingItems }) => {
            return (
              <>
                <TabNavItems>
                  {items.map((item) => {
                    return (
                      <TabNavItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        icon={item.icon}
                        isActive={item.isActive}
                        trailing={item.trailing}
                      />
                    );
                  })}
                </TabNavItems>
                {overflowingItems.length ? (
                  <Menu openInteraction="hover">
                    <TabNavItem title="More" trailing={<ChevronDownIcon />} />
                    <MenuOverlay>
                      {overflowingItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <MenuItem
                            key={item.href}
                            onClick={() => {
                              console.log('clicked', item.title);
                            }}
                          >
                            <Box padding="spacing.2">
                              <Box display="flex" gap="spacing.2">
                                {Icon && <Icon />}
                                <Text weight="semibold">{item.title}</Text>
                              </Box>
                              <Text
                                marginTop="spacing.2"
                                size="small"
                                color="surface.text.gray.subtle"
                              >
                                {item.description}
                              </Text>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </MenuOverlay>
                  </Menu>
                ) : null}
              </>
            );
          }}
        </TabNav>
      </Box>
    );
  };

  export default App;
  `,
};
