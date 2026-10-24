/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { CompositeItem } from '@floating-ui/react';
import type { TabItemProps } from './types';
import { useTabsContext } from './TabsContext';
import { getTabButtonClasses } from './getTabsModuleClasses';
import { iconColor, intenseSelected, textColor, textSizeMap } from './tabTokens';
import { iconSizeMap, useTabsItemPropRestriction } from './utils';
import { Text } from '~components/Typography';
import useInteraction from '~utils/useInteraction';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const TabItem = ({
  children,
  value,
  leading: Leading,
  trailing,
  isDisabled = false,
  href,
  onClick,
  ...rest
}: TabItemProps): React.ReactElement => {
  const {
    size,
    isFullWidthTabItem,
    selectedValue,
    setSelectedValue,
    baseId,
    variant,
    isVertical,
    selectedEmphasis,
    renderedPanelValues,
  } = useTabsContext();
  const { currentInteraction, setCurrentInteraction: _setCurrentInteraction, ...interactionHandlers } =
    useInteraction();
  const validatedTrailingComponent = useTabsItemPropRestriction(trailing, size!);
  const isSelected = selectedValue === value;
  const selectedState = isSelected ? 'selected' : 'unselected';
  const panelId = `${baseId}-${value}-tabpanel`;
  const tabItemId = `${baseId}-${value}-tabitem`;
  const isFilled = variant === 'filled';
  const isIntenseSelected = isSelected && isFilled && selectedEmphasis === 'intense';
  const controlsPanelId =
    !renderedPanelValues || renderedPanelValues.has(value) ? panelId : undefined;

  const interactionMap = {
    default: 'default',
    hover: 'highlighted',
    focus: 'highlighted',
    disabled: 'disabled',
  } as const;
  const interaction = isDisabled ? 'disabled' : interactionMap[currentInteraction];

  const className = getTabButtonClasses({
    size: size!,
    variant: variant!,
    isVertical,
    isSelected,
    isFullWidthTabItem: isFullWidthTabItem || isFilled,
    isDisabled,
    href,
    isIntenseSelected,
  });

  const sharedProps = {
    id: tabItemId,
    className,
    ...interactionHandlers,
    onClick: (e: React.MouseEvent) => {
      setSelectedValue?.(() => value);
      onClick?.(e);
    },
    ...makeAccessible({
      role: 'tab',
      selected: isSelected,
      controls: controlsPanelId,
    }),
    ...metaAttribute({ name: MetaConstants.TabItem }),
    ...makeAnalyticsAttribute(rest),
  };

  const tabContent = (
    <>
      {Leading ? (
        <Leading
          size={iconSizeMap[size!]}
          color={
            isIntenseSelected
              ? intenseSelected.iconColor[interaction]
              : iconColor[selectedState][interaction]
          }
        />
      ) : null}

      {children ? (
        <Text
          color={
            isIntenseSelected
              ? intenseSelected.textColor[interaction]
              : textColor[selectedState][interaction]
          }
          size={textSizeMap[size!]}
          weight="medium"
        >
          {children}
        </Text>
      ) : null}

      {validatedTrailingComponent}
    </>
  );

  return (
    <CompositeItem
      render={
        href ? (
          <a
            href={href}
            aria-disabled={isDisabled || undefined}
            {...sharedProps}
          >
            {tabContent}
          </a>
        ) : (
          <button type="button" disabled={isDisabled} {...sharedProps}>
            {tabContent}
          </button>
        )
      }
    />
  );
};

export { TabItem };
