import React from 'react';
import type { SegmentedControlItemProps } from './types';
import { useSegmentedControlContext } from './SegmentedControlContext';
import { textSizeMap, iconSizeMap, itemHeight } from './segmentedControlTokens';
import { getSegmentedControlItemClasses } from './getSegmentedControlModuleClasses';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const SegmentedControlItem = ({
  children,
  value,
  leading: Leading,
  isDisabled: isItemDisabled = false,
  accessibilityLabel,
  testID,
  ...rest
}: SegmentedControlItemProps): React.ReactElement => {
  const {
    selectedValue,
    setSelectedValue,
    size,
    isDisabled: isGroupDisabled,
    baseId,
    totalItems,
    firstEnabledValue,
    itemRefs,
  } = useSegmentedControlContext();

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const isSelected = selectedValue === value;
  const isDisabled = isGroupDisabled || isItemDisabled;

  const shouldReceiveFocus =
    (!isDisabled && isSelected) ||
    (selectedValue === undefined && !isDisabled && value === firstEnabledValue);

  React.useEffect(() => {
    if (!itemRefs) return undefined;
    const map = itemRefs.current;
    const node = buttonRef.current;
    if (node) map.set(value, node);
    return () => {
      map.delete(value);
    };
  }, [value, itemRefs]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const container = buttonRef.current?.closest('[role="radiogroup"]');
      if (!container) return;

      const buttons = Array.from(
        container.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'),
      );
      const currentIndex = buttons.indexOf(buttonRef.current!);
      let nextIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % buttons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = buttons.length - 1;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        const nextEl = buttons[nextIndex];
        nextEl.focus();
        setSelectedValue(() => nextEl.dataset.value ?? '');
      }
    },
    [setSelectedValue],
  );

  const textColor = isDisabled
    ? 'interactive.text.gray.disabled'
    : isSelected
    ? 'interactive.text.gray.normal'
    : 'interactive.text.gray.muted';
  const iconColor = isDisabled
    ? 'interactive.icon.gray.disabled'
    : isSelected
    ? 'interactive.icon.gray.normal'
    : 'interactive.icon.gray.muted';

  return (
    <button
      ref={buttonRef}
      type="button"
      id={`${baseId}-${value}-item`}
      data-value={value}
      tabIndex={shouldReceiveFocus ? 0 : -1}
      className={getSegmentedControlItemClasses({ size, isSelected })}
      style={{ height: makeSpace(itemHeight[size]) }}
      disabled={isDisabled}
      onClick={() => {
        setSelectedValue(() => value);
      }}
      onKeyDown={handleKeyDown}
      {...makeAccessible({
        role: 'radio',
        checked: isSelected,
        label: accessibilityLabel,
        setSize: totalItems,
      })}
      {...metaAttribute({ name: MetaConstants.SegmentedControlItem, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {Leading ? <Leading size={iconSizeMap[size]} color={iconColor} /> : null}
      {children ? (
        <Text as="span" color={textColor} size={textSizeMap[size]} weight="medium">
          {children}
        </Text>
      ) : null}
    </button>
  );
};

export { SegmentedControlItem };
