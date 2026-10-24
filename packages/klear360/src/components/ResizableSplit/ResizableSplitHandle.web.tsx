import React, { useRef, useState } from 'react';
import {
  getResizableSplitHandleContainerClass,
  getResizableSplitHandleDataAttributes,
  getResizableSplitHandleGripClass,
  getResizableSplitHandleTrackClass,
} from './getResizableSplitModuleClasses';
import { ComponentIds } from './componentIds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import DragHandleIcon from '~components/Icons/DragHandleIcon';

type ResizableSplitHandleProps = {
  handleWidth: number;
  step: number;
  /** Current end-pane width in pixels - used for keyboard math (step/Home/End), NOT the ARIA
   * attributes below (which are a separate, normalized 0-100 scale per the ARIA separator
   * pattern's convention). */
  widthPx: number;
  widthMinPx: number;
  widthMaxPx: number;
  /** ARIA `aria-valuenow`/`valuemin`/`valuemax` - a 0-100 percentage of the allowed range, already
   * computed by the caller. Display/announcement only; never used for drag/keyboard math. */
  ariaValueNow: number;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueText: string;
  accessibilityLabel: string;
  /** Called with the end pane's new width (px), already clamped, on every drag move/keyboard step. */
  onChange: (width: number) => void;
  /** Called once when a drag or keyboard interaction ends - the consumer's persistence point. */
  onChangeEnd: (width: number) => void;
  /** Resets to the responsive default (double-click / Enter). */
  onReset: () => void;
  /** Reads the split container's current right edge, to compute a drag's new width from the
   * pointer's absolute position (not a delta) - see the spec note in `onPointerMove`. */
  getContainerRightEdge: () => number;
};

/**
 * The draggable handle between the two panes. Pointer-driven via `setPointerCapture` (see
 * `ColorPicker.tsx`'s precedent in `Spark/docs` - the only existing pointer-drag code in this
 * package), which unifies mouse and touch dragging in one code path and keeps `pointermove` firing
 * even if the pointer leaves the handle's own bounds mid-drag - unlike the `window`-level
 * `pointermove`/`pointerup` listeners this replaces.
 */
const _ResizableSplitHandle = ({
  handleWidth,
  step,
  widthPx,
  widthMinPx,
  widthMaxPx,
  ariaValueNow,
  ariaValueMin,
  ariaValueMax,
  ariaValueText,
  accessibilityLabel,
  onChange,
  onChangeEnd,
  onReset,
  getContainerRightEdge,
}: ResizableSplitHandleProps): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  // The width at drag-start, used only to report a final value to `onChangeEnd` on pointer-up -
  // the live value during the drag itself is always derived fresh from the pointer position, not
  // a delta off this ref (see the spec: "new width is computed as (container's right edge) -
  // (pointer clientX)", not a running delta).
  const latestWidthRef = useRef(widthPx);
  latestWidthRef.current = widthPx;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0) return; // left-button only
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    // e.buttons (not e.currentTarget.hasPointerCapture) is the reliable cross-browser guard for
    // "button still held" - hasPointerCapture can read false inside some embedded/iframe contexts
    // (e.g. Storybook's preview iframe) even while capture is genuinely active.
    if (e.buttons === 0) return;
    const newWidth = getContainerRightEdge() - e.clientX;
    onChange(newWidth);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    onChangeEnd(latestWidthRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    // Left/Right move the splitter itself (APG Window Splitter pattern, "vertical splitter" -
    // i.e. a side-by-side split - Left/Right arrows). Left moves the splitter left, which shrinks
    // the end pane (whose width `widthPx` tracks); Right grows it.
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = widthPx - step;
      onChange(next);
      onChangeEnd(next);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = widthPx + step;
      onChange(next);
      onChangeEnd(next);
    } else if (e.key === 'Home') {
      // Gives the primary pane (the start pane - see ResizableSplitProps.minStartWidth) its
      // smallest size, i.e. the end pane its largest.
      e.preventDefault();
      onChange(widthMaxPx);
      onChangeEnd(widthMaxPx);
    } else if (e.key === 'End') {
      // Gives the primary (start) pane its largest size, i.e. the end pane its smallest.
      e.preventDefault();
      onChange(widthMinPx);
      onChangeEnd(widthMinPx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onReset();
    }
  };

  return (
    <div
      {...metaAttribute({ name: MetaConstants.ResizableSplitHandle })}
      className={getResizableSplitHandleContainerClass()}
      style={
        {
          '--resizable-split-handle-width': `${handleWidth}px`,
        } as React.CSSProperties
      }
      {...getResizableSplitHandleDataAttributes({ isDragging, isFocusVisible })}
      role="separator"
      tabIndex={0}
      aria-label={accessibilityLabel}
      aria-orientation="horizontal"
      aria-valuenow={ariaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuetext={ariaValueText}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onReset}
      onKeyDown={handleKeyDown}
      onFocus={(e) => setIsFocusVisible(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setIsFocusVisible(false)}
    >
      <div className={getResizableSplitHandleTrackClass()} />
      <div className={getResizableSplitHandleGripClass()}>
        <DragHandleIcon size="small" />
      </div>
    </div>
  );
};

const ResizableSplitHandle = assignWithoutSideEffects(_ResizableSplitHandle, {
  displayName: 'ResizableSplitHandle',
  componentId: ComponentIds.ResizableSplitHandle,
});

export { ResizableSplitHandle };
