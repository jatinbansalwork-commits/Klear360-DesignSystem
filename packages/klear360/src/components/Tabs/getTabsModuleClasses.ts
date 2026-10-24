import type { TabsProps } from './types';
import { needsStackingContext } from './tabTokens';
import styles from './Tabs.module.scss';

type TabSize = NonNullable<TabsProps['size']>;
type TabVariant = NonNullable<TabsProps['variant']>;

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const normalizeVariant = (variant: TabVariant): 'bordered' | 'filled' =>
  variant === 'borderless' ? 'bordered' : variant;

type TabListInnerClassProps = {
  variant: TabVariant;
  isVertical: boolean;
  size: TabSize;
};

export const getTabListScrollableClass = (): string => styles.scrollableArea;

export const getTabListInnerClasses = ({
  variant,
  isVertical,
  size,
}: TabListInnerClassProps): string => {
  const v = normalizeVariant(variant);
  const isFilled = v === 'filled';
  const isCompact = size === 'small' && !isVertical;

  return [
    styles.tabListInner,
    isVertical ? styles.tabListVertical : styles.tabListHorizontal,
    isFilled ? styles.tabListFilled : styles.tabListBordered,
    isFilled && isCompact ? styles.tabListFilledCompact : undefined,
    isFilled && isVertical ? styles.tabListFilledVertical : undefined,
    !isFilled && isVertical ? styles.tabListBorderedVertical : undefined,
  ]
    .filter(Boolean)
    .join(' ');
};

export const getVerticalTrackClass = (): string => styles.verticalTrack;
export const getHorizontalTrackClass = (): string => styles.horizontalTrack;

type TabButtonClassProps = {
  size: TabSize;
  variant: TabVariant;
  isVertical: boolean;
  isSelected: boolean;
  isFullWidthTabItem?: boolean;
  isDisabled?: boolean;
  href?: string;
  isIntenseSelected?: boolean;
};

export const getTabButtonClasses = ({
  size,
  variant,
  isVertical,
  isSelected,
  isFullWidthTabItem,
  isDisabled,
  href,
  isIntenseSelected,
}: TabButtonClassProps): string => {
  const v = normalizeVariant(variant);
  const orientation = isVertical ? 'vertical' : 'horizontal';
  const isFilled = v === 'filled';

  const paddingKey =
    v === 'bordered'
      ? `tabBordered${orientation === 'horizontal' ? 'Horiz' : 'Vert'}${capitalize(size)}`
      : `tabFilled${orientation === 'horizontal' ? 'Horiz' : 'Vert'}${capitalize(size)}`;

  const focusRadiusKey =
    size === 'small' || (isFilled && !isVertical)
      ? styles.tabFocusRadiusSmall
      : styles.tabFocusRadiusMedium;

  let radiusClass: string | undefined;
  if (isFilled && !isVertical && size === 'small') {
    radiusClass = styles.tabRadiusFilledHorizSmall;
  } else if (isFilled) {
    radiusClass = styles.tabRadiusSmall;
  } else {
    radiusClass = styles.tabRadiusNone;
  }

  return [
    styles.tabButton,
    isVertical ? styles.tabButtonVertical : styles.tabButtonHorizontal,
    isFullWidthTabItem || isFilled ? styles.tabButtonFullWidth : undefined,
    styles[paddingKey as keyof typeof styles],
    v === 'bordered'
      ? isVertical
        ? styles.tabBorderedBorderLeft
        : styles.tabBorderedBorderBottom
      : undefined,
    radiusClass,
    focusRadiusKey,
    styles.tabBgTransparent,
    isSelected && isFilled && isVertical ? styles.tabBgFilledSelectedVertical : undefined,
    isSelected ? styles.tabSelected : undefined,
    isFilled && !isSelected ? styles.tabFilledUnselected : undefined,
    needsStackingContext[v][orientation] ? styles.tabStackingContext : undefined,
    isDisabled && href ? styles.tabDisabledLink : undefined,
    isIntenseSelected ? styles.tabButtonIntense : undefined,
  ]
    .filter(Boolean)
    .join(' ');
};

type TabIndicatorClassProps = {
  variant: TabVariant;
  isVertical: boolean;
  size: TabSize;
  selectedEmphasis?: TabsProps['selectedEmphasis'];
};

export const getTabIndicatorClasses = ({
  variant,
  isVertical,
  size,
  selectedEmphasis,
}: TabIndicatorClassProps): string => {
  const v = normalizeVariant(variant);
  const isSmallHorizontal = size === 'small' && !isVertical;

  if (isVertical && v !== 'filled') {
    return [styles.tabIndicator, styles.indicatorVerticalBordered].join(' ');
  }

  if (v === 'filled') {
    return [
      styles.tabIndicator,
      styles.indicatorFilled,
      selectedEmphasis === 'intense' ? styles.tabIndicatorIntense : undefined,
      isSmallHorizontal
        ? styles.indicatorRadiusFilledHorizSmall
        : styles.indicatorRadiusSmall,
    ]
      .filter(Boolean)
      .join(' ');
  }

  return [styles.tabIndicator, styles.indicatorHorizontalBordered].join(' ');
};
