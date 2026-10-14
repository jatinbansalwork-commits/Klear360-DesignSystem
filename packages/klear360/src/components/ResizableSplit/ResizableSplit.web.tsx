import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ResizableSplitHandle } from './ResizableSplitHandle.web';
import { ComponentIds } from './componentIds';
import type { ResizableSplitProps, ResizableSplitPaneProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useResize } from '~utils/useResize';
import clamp from '~utils/lodashButBetter/clamp';

const DEFAULT_MIN_PANE_WIDTH = 320;
const DEFAULT_HANDLE_WIDTH = 12;
const DEFAULT_STEP = 16;

const StyledSplit = styled.div<{ $gridTemplateColumns: string }>(({ $gridTemplateColumns }) => ({
  display: 'grid',
  gridTemplateColumns: $gridTemplateColumns,
  width: '100%',
  height: '100%',
  minWidth: 0,
  minHeight: 0,
}));

const StyledPane = styled.div({
  minWidth: 0,
  minHeight: 0,
  overflow: 'auto',
});

const _ResizableSplitPane = ({
  children,
  testID,
  ...rest
}: ResizableSplitPaneProps): React.ReactElement => (
  <StyledPane
    {...metaAttribute({ name: MetaConstants.ResizableSplitPane, testID })}
    {...makeAnalyticsAttribute(rest)}
  >
    {children}
  </StyledPane>
);

const ResizableSplitPane = assignWithoutSideEffects(_ResizableSplitPane, {
  displayName: 'ResizableSplitPane',
  componentId: ComponentIds.ResizableSplitPane,
});

const defaultComputeDefaultWidth = (containerWidth: number): number => containerWidth * 0.4;

const _ResizableSplit = ({
  children,
  width,
  onWidthChange,
  onResizeEnd,
  computeDefaultWidth = defaultComputeDefaultWidth,
  minStartWidth = DEFAULT_MIN_PANE_WIDTH,
  minEndWidth = DEFAULT_MIN_PANE_WIDTH,
  handleWidth = DEFAULT_HANDLE_WIDTH,
  step = DEFAULT_STEP,
  accessibilityLabel,
  testID,
  ...rest
}: ResizableSplitProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useResize(containerRef, (entry) => {
    setContainerWidth(entry.contentRect.width);
  });

  // The end pane's largest allowed width - whatever's left after the start pane's minimum and the
  // handle's own width are reserved (the "- handleWidth" is what stops the start pane dropping
  // below its minimum purely because the handle ate the space - see the original spec).
  const maxEndWidth = Math.max(minEndWidth, containerWidth - minStartWidth - handleWidth);

  const clampEndWidth = useCallback(
    (value: number): number => clamp(value, minEndWidth, maxEndWidth),
    [minEndWidth, maxEndWidth],
  );

  const resolvedEndWidth =
    width !== null ? clampEndWidth(width) : clampEndWidth(computeDefaultWidth(containerWidth));

  const handleChange = (newWidth: number): void => {
    onWidthChange(clampEndWidth(newWidth));
  };

  const handleChangeEnd = (newWidth: number): void => {
    onResizeEnd?.(clampEndWidth(newWidth));
  };

  const handleReset = (): void => {
    onWidthChange(null);
  };

  const getContainerRightEdge = (): number => {
    return containerRef.current?.getBoundingClientRect().right ?? 0;
  };

  const [startPane, endPane] = React.Children.toArray(children);

  const gridTemplateColumns = useMemo(
    () => `minmax(${minStartWidth}px, 1fr) ${handleWidth}px ${resolvedEndWidth}px`,
    [minStartWidth, handleWidth, resolvedEndWidth],
  );

  // A decimal 0-100 position within the allowed range, per the ARIA separator pattern's
  // aria-valuenow/valuemin/valuemax convention (typically a 0-100 scale, not raw pixels) - the
  // `width`/`onWidthChange` consumer API stays in pixels; only the ARIA attributes are normalized.
  const valueRange = maxEndWidth - minEndWidth;
  const valueNow = valueRange > 0 ? ((resolvedEndWidth - minEndWidth) / valueRange) * 100 : 0;

  return (
    <StyledSplit
      ref={containerRef}
      $gridTemplateColumns={gridTemplateColumns}
      {...metaAttribute({ name: MetaConstants.ResizableSplit, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {startPane}
      <ResizableSplitHandle
        handleWidth={handleWidth}
        step={step}
        widthPx={resolvedEndWidth}
        widthMinPx={minEndWidth}
        widthMaxPx={maxEndWidth}
        ariaValueNow={Math.round(valueNow)}
        ariaValueMin={0}
        ariaValueMax={100}
        ariaValueText={`${Math.round(resolvedEndWidth)}px`}
        accessibilityLabel={accessibilityLabel}
        onChange={handleChange}
        onChangeEnd={handleChangeEnd}
        onReset={handleReset}
        getContainerRightEdge={getContainerRightEdge}
      />
      {endPane}
    </StyledSplit>
  );
};

const ResizableSplit = assignWithoutSideEffects(_ResizableSplit, {
  displayName: 'ResizableSplit',
  componentId: ComponentIds.ResizableSplit,
});

export { ResizableSplit, ResizableSplitPane };
