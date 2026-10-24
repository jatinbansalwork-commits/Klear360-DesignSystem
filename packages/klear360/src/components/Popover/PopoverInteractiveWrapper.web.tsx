import React from 'react';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles.web';
import { useTheme } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { DataAnalyticsAttribute } from '~utils/types';

type PopoverInteractiveWrapper = {
  /**
   * A label for screen readers to announce when the popover is opened.
   */
  accessibilityLabel?: string;
  /**
   * The content of the PopoverInteractiveWrapper.
   */
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
} & Omit<BaseBoxProps, 'as'> &
  DataAnalyticsAttribute;

const PopoverInteractiveWrapper = React.forwardRef<HTMLButtonElement, PopoverInteractiveWrapper>(
  (
    { accessibilityLabel, className, children, display, onClick, onKeyDown, ...boxProps },
    ref,
  ) => {
    usePopoverContext();
    const { theme } = useTheme();
    const inlineStyle = useMemoizedStyles({
      display: display || 'inline-block',
      theme,
      ...boxProps,
    });

    return (
      <button
        ref={ref}
        type="button"
        className={[styles.interactiveWrapper, className].filter(Boolean).join(' ')}
        style={inlineStyle}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...makeAnalyticsAttribute(boxProps)}
        {...metaAttribute({
          testID: 'popover-interactive-wrapper',
          name: MetaConstants.PopoverInteractiveWrapper,
        })}
        {...makeAccessible({
          label: accessibilityLabel,
        })}
      >
        {children}
      </button>
    );
  },
);

PopoverInteractiveWrapper.displayName = 'PopoverInteractiveWrapper';

export { PopoverInteractiveWrapper };
