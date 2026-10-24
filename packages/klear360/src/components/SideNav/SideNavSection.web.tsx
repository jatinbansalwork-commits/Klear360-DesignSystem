import React from 'react';
import styles from './SideNav.module.scss';
import type { SideNavSectionProps } from './types';
import { classes } from './tokens';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Collapsible, CollapsibleBody } from '~components/Collapsible';
import BaseBox from '~components/Box/BaseBox';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { BaseLink } from '~components/Link/BaseLink';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const SideNavTitleDivider = (): React.ReactElement => (
  <BaseBox className={styles.titleDivider} />
);

const ShowMoreLink = ({
  collapsedItemsCount,
}: {
  collapsedItemsCount: number;
}): React.ReactElement => {
  const { isExpanded, onExpandChange } = useCollapsible();
  const toggleCollapse = (): void => onExpandChange(!isExpanded);
  const linkProps = {
    size: 'small',
    color: 'neutral',
    variant: 'button',
    onClick: toggleCollapse,
    marginY: 'spacing.2',
    className: styles.fullWidthLink,
  } as const;

  return (
    <>
      <BaseBox className={classes.SHOW_WHEN_COLLAPSED} width="100%" justifyContent="center">
        <BaseLink
          {...linkProps}
          marginX="spacing.4"
          icon={isExpanded ? ChevronUpIcon : undefined}
          iconPosition="right"
        >
          {isExpanded ? `` : `+${collapsedItemsCount}`}
        </BaseLink>
      </BaseBox>
      <BaseBox className={classes.HIDE_WHEN_COLLAPSED} width="100%">
        <BaseLink
          {...linkProps}
          marginX="spacing.4"
          icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          iconPosition="right"
        >
          {isExpanded ? 'Show Less' : `+${collapsedItemsCount} More`}
        </BaseLink>
      </BaseBox>
    </>
  );
};

const SideNavSection = ({
  children,
  title,
  defaultIsExpanded,
  maxVisibleItems,
  onExpandChange,
  ...rest
}: SideNavSectionProps): React.ReactElement => {
  const totalItemsCount = React.Children.count(children);
  const collapsedItemsCount = maxVisibleItems ? totalItemsCount - maxVisibleItems : undefined;

  return (
    <Box paddingBottom="spacing.5" {...makeAnalyticsAttribute(rest)}>
      {title ? (
        <BaseBox
          className={styles.sectionTitleContainer}
          position="relative"
          padding={['spacing.2', 'spacing.4']}
        >
          <Text
            size="xsmall"
            weight="medium"
            truncateAfterLines={1}
            color="surface.text.gray.muted"
          >
            {title}
          </Text>
          <BaseBox
            className={classes.SHOW_WHEN_COLLAPSED}
            position="absolute"
            top="50%"
            margin="auto"
            left="spacing.0"
            right="spacing.0"
            transform="translateY(-50%)"
          >
            <SideNavTitleDivider />
          </BaseBox>
        </BaseBox>
      ) : null}

      <Box>{maxVisibleItems ? children.slice(0, maxVisibleItems) : children}</Box>
      {maxVisibleItems ? (
        <Collapsible
          direction="top"
          _dangerouslyDisableValidations={true}
          _shouldApplyWidthRestrictions={false}
          onExpandChange={onExpandChange}
          defaultIsExpanded={defaultIsExpanded}
        >
          <ShowMoreLink collapsedItemsCount={collapsedItemsCount!} />
          <CollapsibleBody width="100%" _hasMargin={false}>
            {children.slice(maxVisibleItems)}
          </CollapsibleBody>
        </Collapsible>
      ) : null}
    </Box>
  );
};

export { SideNavSection };
