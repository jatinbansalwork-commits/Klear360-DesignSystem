import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { ResizableSplit, ResizableSplitPane } from '../ResizableSplit.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * jsdom has no real layout engine, so `getBoundingClientRect`/`ResizeObserver` can't report a
 * real container width (confirmed elsewhere in this package - see Table's virtualization tests).
 * This fakes `ResizeObserver` to immediately report a fixed, deterministic container width, so
 * clamping/keyboard/ARIA behavior can be tested without needing a real browser. Drag itself
 * (`setPointerCapture`-based) is NOT exercised here for the same reason - it needs a real browser,
 * same as Table's virtualization behavior; see the Storybook story + its play function instead.
 */
const CONTAINER_WIDTH = 1000;

class FakeResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    this.callback(
      [
        {
          target,
          contentRect: { width: CONTAINER_WIDTH } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ],
      (this as unknown) as ResizeObserver,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- intentional no-op test double for ResizeObserver
  unobserve(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- intentional no-op test double for ResizeObserver
  disconnect(): void {}
}

beforeEach(() => {
  ((window as unknown) as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
  ((global as unknown) as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
});

const renderSplit = (
  props: Partial<React.ComponentProps<typeof ResizableSplit>> = {},
): ReturnType<typeof renderWithTheme> & { onWidthChange: jest.Mock } => {
  const onWidthChange = jest.fn();
  const result = renderWithTheme(
    <ResizableSplit
      width={null}
      onWidthChange={onWidthChange}
      accessibilityLabel="Resize panels"
      {...props}
    >
      <ResizableSplitPane>
        <div>Start pane content</div>
      </ResizableSplitPane>
      <ResizableSplitPane>
        <div>End pane content</div>
      </ResizableSplitPane>
    </ResizableSplit>,
  );
  return { ...result, onWidthChange };
};

describe('<ResizableSplit />', () => {
  it('renders both panes', () => {
    renderSplit();
    expect(screen.getByText('Start pane content')).toBeInTheDocument();
    expect(screen.getByText('End pane content')).toBeInTheDocument();
  });

  it('renders the handle with role="separator" and the required ARIA attributes', () => {
    renderSplit();
    const handle = screen.getByRole('separator');
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    expect(handle).toHaveAttribute('aria-valuemin', '0');
    expect(handle).toHaveAttribute('aria-valuemax', '100');
    expect(handle).toHaveAttribute('aria-valuenow');
    expect(handle).toHaveAttribute('aria-valuetext');
    expect(handle).toHaveAttribute('aria-label', 'Resize panels');
  });

  it('clamps an explicit width to minEndWidth when it is below the minimum', () => {
    const onWidthChange = jest.fn();
    renderWithTheme(
      <ResizableSplit
        width={10}
        onWidthChange={onWidthChange}
        accessibilityLabel="Resize panels"
        minStartWidth={320}
        minEndWidth={320}
        handleWidth={12}
      >
        <ResizableSplitPane>
          <div>Start</div>
        </ResizableSplitPane>
        <ResizableSplitPane>
          <div>End</div>
        </ResizableSplitPane>
      </ResizableSplit>,
    );
    // maxEndWidth = 1000 - 320 - 12 = 668; minEndWidth = 320 - an explicit 10px request clamps up
    // to 320, reflected in the ARIA value text (the pixel-space value, not the 0-100 ARIA scale).
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuetext', '320px');
  });

  it('clamps an explicit width to maxEndWidth when it exceeds the available space', () => {
    renderWithTheme(
      <ResizableSplit
        width={2000}
        onWidthChange={jest.fn()}
        accessibilityLabel="Resize panels"
        minStartWidth={320}
        minEndWidth={320}
        handleWidth={12}
      >
        <ResizableSplitPane>
          <div>Start</div>
        </ResizableSplitPane>
        <ResizableSplitPane>
          <div>End</div>
        </ResizableSplitPane>
      </ResizableSplit>,
    );
    // maxEndWidth = 1000 - 320 - 12 = 668.
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuetext', '668px');
  });

  it('ArrowRight grows the end pane by `step`, ArrowLeft shrinks it', () => {
    const { onWidthChange } = renderSplit({ width: 400, step: 16 });
    const handle = screen.getByRole('separator');

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onWidthChange).toHaveBeenLastCalledWith(416);

    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onWidthChange).toHaveBeenLastCalledWith(384);
  });

  it('Home gives the end pane its largest width (the start/primary pane its smallest)', () => {
    const { onWidthChange } = renderSplit({
      width: 400,
      minStartWidth: 320,
      minEndWidth: 320,
      handleWidth: 12,
    });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'Home' });
    // maxEndWidth = 1000 - 320 - 12 = 668.
    expect(onWidthChange).toHaveBeenLastCalledWith(668);
  });

  it('End gives the end pane its smallest width (the start/primary pane its largest)', () => {
    const { onWidthChange } = renderSplit({
      width: 400,
      minStartWidth: 320,
      minEndWidth: 320,
    });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'End' });
    expect(onWidthChange).toHaveBeenLastCalledWith(320);
  });

  it('double-click resets by calling onWidthChange(null)', () => {
    const { onWidthChange } = renderSplit({ width: 500 });
    fireEvent.doubleClick(screen.getByRole('separator'));
    expect(onWidthChange).toHaveBeenCalledWith(null);
  });

  it('Enter resets by calling onWidthChange(null), same as double-click', () => {
    const { onWidthChange } = renderSplit({ width: 500 });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'Enter' });
    expect(onWidthChange).toHaveBeenCalledWith(null);
  });

  it('calls onResizeEnd once per keyboard step, with the final clamped width', () => {
    const onResizeEnd = jest.fn();
    renderSplit({ width: 400, step: 16, onResizeEnd });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });
    expect(onResizeEnd).toHaveBeenCalledTimes(1);
    expect(onResizeEnd).toHaveBeenCalledWith(416);
  });

  it('falls back to computeDefaultWidth when width is null', () => {
    renderSplit({
      width: null,
      computeDefaultWidth: (containerWidth) => containerWidth * 0.5,
    });
    // 1000 * 0.5 = 500.
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuetext', '500px');
  });

  it('aria-valuenow reflects a 0-100 position within the allowed range, not raw pixels', () => {
    renderSplit({
      width: 400,
      minStartWidth: 320,
      minEndWidth: 320,
      handleWidth: 12,
    });
    // range = maxEndWidth(668) - minEndWidth(320) = 348; (400-320)/348*100 ≈ 23.
    const handle = screen.getByRole('separator');
    const valueNow = Number(handle.getAttribute('aria-valuenow'));
    expect(valueNow).toBeGreaterThan(0);
    expect(valueNow).toBeLessThan(100);
  });
});
