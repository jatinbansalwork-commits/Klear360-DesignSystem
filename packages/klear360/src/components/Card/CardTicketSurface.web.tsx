import React, { useMemo, useRef, useState } from 'react';
import { CARD_TICKET_DISABLED_STROKE_DASHARRAY } from '~utils/cardTicketOutline';
import {
  getCardTicketClipContentClass,
  getCardTicketOutlineClass,
  getCardTicketSectionClasses,
  getCardTicketWrapperClass,
} from './getCardTicketModuleClasses';
import BaseBox from '~components/Box/BaseBox';
import type { Theme } from '~components/Klear360Provider';
import { useTheme } from '~utils';
import {
  buildTicketShellPath,
  CARD_TICKET_OUTLINE_STROKE_WIDTH,
} from '~utils/cardTicketOutline';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

type TicketStateProps = {
  isSelected?: boolean;
  isDisabled?: boolean;
};

const getTicketBorderColor = (
  theme: Theme,
  { isSelected, isDisabled }: TicketStateProps,
): string => {
  if (isSelected && !isDisabled) {
    return theme.colors.surface.border.primary.normal;
  }
  return theme.colors.surface.border.gray.subtle;
};

type CardTicketSurfaceProps = {
  top: React.ReactNode;
  bottom: React.ReactNode;
  children?: React.ReactNode;
} & TicketStateProps;

const CardTicketSurface = ({
  top,
  bottom,
  children,
  isSelected,
  isDisabled,
}: CardTicketSurfaceProps): React.ReactElement => {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, tearLineY: 0 });

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const topSection = topSectionRef.current;

    if (!wrapper || !topSection) {
      return () => undefined;
    }

    const updateDimensions = (): void => {
      setDimensions((previousDimensions) => {
        const nextDimensions = {
          width: wrapper.offsetWidth,
          height: wrapper.offsetHeight,
          tearLineY: topSection.offsetHeight,
        };

        if (
          previousDimensions.width === nextDimensions.width &&
          previousDimensions.height === nextDimensions.height &&
          previousDimensions.tearLineY === nextDimensions.tearLineY
        ) {
          return previousDimensions;
        }

        return nextDimensions;
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(topSection);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const shellPath = useMemo(() => buildTicketShellPath(dimensions), [dimensions]);

  const strokeColor = getTicketBorderColor(theme, { isSelected, isDisabled });
  const strokeDasharray = isDisabled ? CARD_TICKET_DISABLED_STROKE_DASHARRAY : undefined;

  const strokePadding = CARD_TICKET_OUTLINE_STROKE_WIDTH / 2;
  const svgViewBox = shellPath
    ? `${-strokePadding} ${-strokePadding} ${dimensions.width + CARD_TICKET_OUTLINE_STROKE_WIDTH} ${
        dimensions.height + CARD_TICKET_OUTLINE_STROKE_WIDTH
      }`
    : '0 0 0 0';

  return (
    <BaseBox ref={wrapperRef} className={getCardTicketWrapperClass()}>
      <BaseBox
        className={getCardTicketClipContentClass()}
        style={shellPath ? { clipPath: `path('${shellPath}')` } : undefined}
      >
        <BaseBox
          ref={topSectionRef}
          className={getCardTicketSectionClasses('top')}
          paddingTop="spacing.4"
          paddingBottom="spacing.4"
          paddingLeft="spacing.4"
          paddingRight="spacing.4"
        >
          {top}
        </BaseBox>
        <BaseBox
          className={getCardTicketSectionClasses('bottom')}
          paddingTop="spacing.4"
          paddingBottom="spacing.4"
          paddingLeft="spacing.4"
          paddingRight="spacing.4"
        >
          {bottom}
        </BaseBox>
      </BaseBox>

      {shellPath ? (
        <svg
          className={getCardTicketOutlineClass()}
          viewBox={svgViewBox}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={shellPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={CARD_TICKET_OUTLINE_STROKE_WIDTH}
            strokeDasharray={strokeDasharray}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}

      {children}
    </BaseBox>
  );
};

export { CardTicketSurface };
