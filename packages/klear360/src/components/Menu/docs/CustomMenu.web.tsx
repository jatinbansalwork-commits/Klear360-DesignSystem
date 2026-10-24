import React from 'react';
import { MenuItem } from '../';
import { Box } from '~components/Box';
import {
  BusinessBankingIcon,
  CurrentAccountIcon,
  KlearNowPayIcon,
  PaymentButtonIcon,
  ConnectionIcon,
  PaymentLinksIcon,
  PaymentPagesIcon,
} from '~components/Icons';
import type { IconComponent } from '~components/Icons';
import { Text } from '~components/Typography';
import styles from './CustomMenu.module.scss';

type CustomMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isTransparent?: boolean;
};

const CustomMenuTrigger = React.forwardRef<HTMLButtonElement, CustomMenuTriggerProps>(
  ({ isTransparent, className, ...props }, ref): React.ReactElement => (
    <button
      ref={ref}
      type="button"
      className={`${isTransparent ? styles.triggerTransparent : styles.trigger}${className ? ` ${className}` : ''}`}
      {...props}
    />
  ),
);

CustomMenuTrigger.displayName = 'CustomMenuTrigger';

const MenuTrigger = React.forwardRef<HTMLButtonElement, { children: string; className?: string }>(
  ({ children, ...props }, ref): React.ReactElement => {
    return (
      <CustomMenuTrigger ref={ref} {...props} isTransparent>
        <Text color="currentColor" weight="semibold">
          {children}
        </Text>
      </CustomMenuTrigger>
    );
  },
);

MenuTrigger.displayName = 'MenuTrigger';

const navMenuItems = {
  payments: [
    {
      icon: ConnectionIcon,
      name: 'Connections',
      description: 'Payments on your Website & App',
      href: '/connections',
    },
    {
      icon: PaymentLinksIcon,
      name: 'Payment Links',
      description: 'Payments Links for you',
      href: '/payment-links',
    },
    {
      icon: PaymentButtonIcon,
      name: 'Payment Button',
      description: 'Payments Buttons for your site',
      href: '/payment-button',
    },
    {
      icon: PaymentPagesIcon,
      name: 'Payment Pages',
      description: 'Payments Page for your Business',
      href: '/payment-pages',
    },
  ],
  banking: [
    {
      icon: KlearNowPayIcon,
      name: 'KlearNow Pay',
      description: 'Business banking supercharged',
      href: '/klearnow-pay',
    },
    {
      icon: CurrentAccountIcon,
      name: 'Current Account',
      description: 'Payments Links for you',
      href: '/current-account',
    },
    {
      icon: BusinessBankingIcon,
      name: 'Klear Capital',
      description: 'Payments Buttons for your site',
      href: '/capital',
    },
  ],
};

const CustomMenuItem = ({
  icon: Icon,
  name,
  description,
  href,
}: {
  icon: IconComponent;
  name: string;
  description: string;
  href: string;
}): React.ReactElement => {
  return (
    <MenuItem href={href}>
      <Box display="flex" alignItems="center" gap="spacing.4">
        <Box display="flex" alignItems="center">
          <Box
            borderRadius="round"
            backgroundColor="surface.background.primary.intense"
            padding="spacing.3"
            height="36px"
            width="36px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon color="surface.icon.staticWhite.normal" />
          </Box>
        </Box>
        <Box>
          <Text weight="semibold" size="large">
            {name}
          </Text>
          <Text color="surface.text.gray.muted">{description}</Text>
        </Box>
      </Box>
    </MenuItem>
  );
};

export { MenuTrigger, navMenuItems, CustomMenuItem, CustomMenuTrigger };
