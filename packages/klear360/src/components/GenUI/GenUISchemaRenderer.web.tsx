/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './GenUISchemaRenderer.global.scss';
import styles from './GenUISchemaRenderer.module.scss';
import type { GenUIComponent } from './GenUIComponents';
import { useGenUI, useGenUIComponentActions, GenUIContext } from './GenUIContext';
import type { GenUIBlockLevelComponentType } from './types';
import { getGenUIComponentTopSpacing } from './GenUISpacing';
import type { AnimateOptions } from './rehypeAnimate';
import { Box } from '~components/Box';
import { useResize } from '~utils/useResize';

/**
 * Fallback component shown when a GenUI component fails to render
 */
const ComponentErrorFallback = () => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

/**
 * Block-level component types that should have the animated gradient border effect
 */
const BLOCK_LEVEL_COMPONENTS = new Set(['CARD', 'TABLE']);

/**
 * Animated gradient border wrapper for block-level components.
 * Uses CSS variables for dynamic position values with static keyframes (best perf).
 * No dynamic style injection - just pass --x-start and --x-end via inline style.
 */
const AnimatedGradientBorder: React.FC<{
  children: React.ReactNode;
  onAnimationComplete?: () => void;
  /** Ref to the content container node (excludes the gradient ring + shade overlays) */
  contentRef?: React.Ref<HTMLDivElement>;
}> = ({ children, onAnimationComplete, contentRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);
  // Initial default values to prevent animation from breaking before ResizeObserver fires
  const [cssVars, setCssVars] = useState<React.CSSProperties>({
    '--x-start': '50px',
    '--x-end': '500px',
  } as React.CSSProperties);

  useEffect(() => {
    // Trigger border fade-out after mask reveal completes (0.6s delay + 1s animation)
    const timer = setTimeout(() => {
      setShowContent(true);
      onAnimationComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // Measure container and compute CSS variable values for animation positions.
  // Ring now spans the full container (top: 0, bottom: 0), so rect.height is the ring height.
  const computePositions = useCallback((entry: ResizeObserverEntry) => {
    const { width: w, height } = entry.contentRect;
    const h = height;
    if (w <= 0 || h <= 0) return;

    const xMargin = Math.min(h * 0.5, w * 0.1);
    const xMax = w - xMargin;

    setCssVars({
      '--x-start': `${xMargin.toFixed(1)}px`,
      '--x-end': `${xMax.toFixed(1)}px`,
    } as React.CSSProperties);
  }, []);

  useResize(containerRef, computePositions);

  return (
    <div ref={containerRef} className={styles.animatedBorderContainer}>
      <div
        className={[styles.gradientBorder, showContent ? styles.gradientBorderFadeOut : undefined]
          .filter(Boolean)
          .join(' ')}
        style={cssVars}
      />
      <div ref={contentRef} className={styles.contentContainer}>
        {children}
        <div className={styles.gradientShade} />
      </div>
    </div>
  );
};

/**
 * Helper to generate a stable key for a component based on its index and type
 */
const getComponentKey = (component: GenUIComponent, index: number): string => {
  if (!component?.component) {
    return `empty-${index}`;
  }
  return `${component.component}-${index}`;
};

type ComponentRendererProps = {
  /** The component schema to render */
  component?: GenUIComponent;
  /** Index of the component in the list */
  index: number;
};

/**
 * Internal component that renders a single GenUI component based on its schema
 * Must be used within a GenUIProvider
 */
const ComponentRendererInner = memo(({ component, index }: ComponentRendererProps) => {
  const { registry, validComponentTypes } = useGenUI();
  const componentActions = useGenUIComponentActions();
  // Ref to the DOM node of the rendered component's content (excludes the gradient
  // border animation overlays). Passed to registered action slots so consumers can
  // read the component's node (e.g. for PNG capture).
  const componentRef = useRef<HTMLDivElement>(null);

  // Handle incomplete components during streaming
  if (!component?.component) {
    return null;
  }

  const componentType = component.component;
  const key = getComponentKey(component, index);

  // Look up the renderer in the registry
  const definition = registry[componentType];

  if (definition) {
    const Renderer = definition.renderer;
    const isBuiltInBlockLevel = BLOCK_LEVEL_COMPONENTS.has(componentType);
    const isGradientAnimation = definition?.animation?.name === 'gradient-ring-entry';
    const isBlockLevel = isBuiltInBlockLevel || isGradientAnimation;

    // Block-level components get the animated gradient border effect.
    // Built-in components (CARD, TABLE) carry marginY="spacing.4" so need a
    // 13px inset; custom components have no external margin so use 0.
    if (isBlockLevel) {
      // Consumer-registered action UI for this component type (render prop pattern).
      // Cast: `componentType` is a string, but the registry is keyed by the block-level
      // union ('CARD' | 'TABLE'). Non-matching keys (including custom block-level
      // component names) just resolve to undefined and no slot renders.
      const renderActionSlot = componentActions?.[componentType as GenUIBlockLevelComponentType];

      return (
        <Box key={key} display="flex" flexDirection="column" width="100%">
          <Box width="100%">
            <AnimatedGradientBorder contentRef={componentRef}>
              <Renderer {...component} index={index} />
            </AnimatedGradientBorder>
          </Box>
          {renderActionSlot
            ? renderActionSlot({
                data: component,
                componentRef,
                componentType,
              })
            : null}
        </Box>
      );
    }

    return <Renderer key={key} {...component} index={index} />;
  }

  // During streaming, we might get partial component names, ie DIV for DIVIDER or ST for STACK
  // Check if the current component name is a prefix of any valid component name
  const isPotentiallyValidComponentName = validComponentTypes.some((validName) =>
    validName.startsWith(componentType),
  );

  if (isPotentiallyValidComponentName) {
    return null;
  }

  console.warn(`[GenUI]: Unsupported component: ${componentType}`);
  return null;
});

const ComponentRenderer = memo(({ component, index }: ComponentRendererProps) => {
  return (
    <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
      <ComponentRendererInner component={component} index={index} />
    </ErrorBoundary>
  );
});

type GenUISchemaRendererProps = {
  /** The components array to render */
  components?: GenUIComponent[];
  /** Whether text animation is active (for streaming) */
  isAnimating?: boolean;
  /** Animation options for text streaming */
  animateOptions?: AnimateOptions;
};

/**
 * Renders an array of GenUI components
 * Must be used within a GenUIProvider
 *
 * @example
 * ```tsx
 * <GenUIProvider>
 *   <GenUISchemaRenderer components={[...]} isAnimating={isStreaming} />
 * </GenUIProvider>
 * ```
 */
const GenUISchemaRenderer = memo(
  ({ components, isAnimating, animateOptions }: GenUISchemaRendererProps) => {
    const parentContext = useGenUI();

    if (!components || components.length === 0) {
      return null;
    }

    // Create a new context value with animation state overrides
    const contextValue = {
      ...parentContext,
      isAnimating: isAnimating ?? parentContext.isAnimating,
      animateOptions: animateOptions ?? parentContext.animateOptions,
    };

    return (
      <GenUIContext.Provider value={contextValue}>
        <>
          {components.map((component, index) => {
            const marginTop = getGenUIComponentTopSpacing(components[index - 1], component);

            return (
              <Box key={getComponentKey(component, index)} marginTop={marginTop}>
                <ComponentRenderer component={component} index={index} />
              </Box>
            );
          })}
        </>
      </GenUIContext.Provider>
    );
  },
);

export { GenUISchemaRenderer, ComponentRenderer };
export type { GenUISchemaRendererProps };
