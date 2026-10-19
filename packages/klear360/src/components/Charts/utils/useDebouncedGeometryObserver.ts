import { useLayoutEffect } from 'react';
import type { DependencyList, RefObject } from 'react';

type UseDebouncedGeometryObserverOptions = {
  /** Recomputes the derived geometry (bridge paths, band paths, ...) from the current DOM. */
  recompute: () => void;
  /**
   * Mutations whose target is inside an element matching this CSS class are ignored — this is
   * the component's own overlay layer (e.g. the null-bridge or reference-band `<g>`), and
   * observing it would otherwise cause a re-entrant recompute on every one of its own updates.
   */
  ignoreMutationsFrom: string;
  /**
   * Whether there is anything to observe. When `false` this hook is a no-op (no initial
   * `recompute` call, no observers) — callers are expected to reset their own derived state (e.g.
   * back to empty) separately when they have nothing to compute.
   */
  enabled: boolean;
  /** Dependencies that should trigger a fresh `recompute` + re-subscription, mirroring a raw effect's dependency list. */
  deps: DependencyList;
};

/**
 * Recomputes geometry derived from Recharts' own rendered SVG (bridge paths, reference bands,
 * ...) whenever the chart's DOM changes or the container resizes. Recharts v3 doesn't expose its
 * axis scales to `<Customized>`, so these derived layers read pixel geometry back out of the
 * rendered `d` attributes instead — see `nullBridgeUtils`/`referenceBandUtils` and the per-caller
 * `useLayoutEffect`s this hook replaces.
 *
 * Mutations are debounced onto a single `requestAnimationFrame` so that hover-triggered DOM churn
 * (tooltip, active dot, crosshair) coalesces into one recompute instead of one per mutation, and
 * mutations originating from the overlay layer itself (`ignoreMutationsFrom`) are filtered out to
 * avoid a re-entrant loop.
 */
const useDebouncedGeometryObserver = (
  containerRef: RefObject<HTMLDivElement | null>,
  { recompute, ignoreMutationsFrom, enabled, deps }: UseDebouncedGeometryObserverOptions,
): void => {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return undefined;

    recompute();

    const cleanups: Array<() => void> = [];
    if (typeof MutationObserver !== 'undefined') {
      let rafId: number | null = null;
      const mutationObserver = new MutationObserver((mutations) => {
        const isSelfMutation = mutations.some(
          (m) => m.target instanceof Element && m.target.closest(`.${ignoreMutationsFrom}`),
        );
        if (isSelfMutation) return;
        // Debounce: coalesce multiple mutations in a single animation frame so that hover-related
        // DOM changes (tooltips, active dots, crosshair) don't each trigger a separate computation.
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = null;
          recompute();
        });
      });
      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['d'],
      });
      cleanups.push(() => {
        mutationObserver.disconnect();
        if (rafId !== null) cancelAnimationFrame(rafId);
      });
    }
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => recompute());
      resizeObserver.observe(container);
      cleanups.push(() => resizeObserver.disconnect());
    }
    return () => cleanups.forEach((cleanup) => cleanup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export { useDebouncedGeometryObserver };
