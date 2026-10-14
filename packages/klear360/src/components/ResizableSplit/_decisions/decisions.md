# ResizableSplit

A draggable two-pane split layout - a document viewer next to an editable form panel, a preview
next to a settings panel, etc. Built to replace two independently hand-rolled copies of the same
mechanics in KlearNow's Ops Hub (`IntakePage.tsx`'s viewer + form split, and
`IngestionPipelinePage.tsx`'s viewer + workspace/extraction panel split), which had already drifted
from each other (`FORM_MIN=320`/`VIEWER_MIN=360` vs `PANEL_MIN=360`/`VIEWER_MIN=280`) despite being
the same feature copy-pasted twice.

## Discovery findings

- **No existing resize/split primitive** anywhere in Klear360 before this - confirmed by an
  exhaustive search of `src/components`/`src/utils`. Two pieces were already there as if
  anticipating this, though: `DragHandleIcon`/`ResizerIcon` in the Icons library (unused by any
  component until now), and `useResize` (`~utils/useResize`), a thin `ResizeObserver` wrapper
  reused here for measuring the split container's width.
- **No pointer-drag precedent in any shipped component.** The only real (down → move → up,
  continuous value) pointer-drag code anywhere in the package is `Spark/docs/ColorPicker.tsx` (a
  dev-tool, not exported) - its `onPointerDown` + `setPointerCapture` + `e.buttons`-guarded
  `onPointerMove` pattern is what this component's handle is modeled on, in place of the original
  hand-rolled version's `window`-level `pointermove`/`pointerup` listeners. `setPointerCapture`
  keeps the drag tracking even if the pointer leaves the handle's bounds mid-drag, and unifies
  mouse + touch into one code path (satisfying the "touch drag, not just mouse" acceptance
  criterion without separate touch-event handling).
- **Compound subcomponents, not generic slot props.** Every existing multi-region Klear360
  component (`Drawer`, `BottomSheet`) composes via `children` with named subcomponents, never
  generic `start`/`end` or `leftPane`/`rightPane` props. `ResizableSplit` follows that: exactly two
  `ResizableSplitPane` children, order-significant (first = start/flex pane, second = end pane -
  the one `width` controls).
- **`aria-orientation` - the hand-rolled original had this backwards.** The W3C APG Window
  Splitter pattern's own prose calls a side-by-side split a "vertical splitter," but that describes
  the divider *line's* visual angle, not the `aria-orientation` *attribute*. The core ARIA spec
  defines `aria-orientation` generically across every role that uses it (slider, scrollbar,
  toolbar, tablist) as the *movement/value axis* - a horizontal slider's value increases left-to-
  right. `separator`'s own implicit default is `horizontal`. `react-resizable-panels` (a current,
  widely-used library) confirms the same convention: its `orientation` prop "determines... the
  direction [panels] can be resized in," and a side-by-side, horizontally-draggable split is
  `orientation="horizontal"` there. **This component sets `aria-orientation="horizontal"`**
  (explicitly, even though it's the spec default, to self-document the fix) - the opposite of what
  the hand-rolled original set.
- **`aria-valuemin`/`aria-valuemax` are a normalized 0-100 scale**, per the APG pattern's own
  convention ("typically 0"/"typically 100"), not raw pixels. The `width`/`onWidthChange` consumer
  API stays in pixels (matching the original behavior spec); only the ARIA attributes are
  normalized internally.
- **RTL has zero guidance in the spec.** Explicitly out of scope for this version, per the original
  task's own allowance - "ArrowLeft grows the pane" is direction-dependent and unaddressed here.

## API

- **Controlled width, not self-persisting.** `width: number | null` + `onWidthChange` - the
  consumer owns storing the value (e.g. `localStorage`), matching the original behavior ("the
  resized width is written to localStorage... but only on pointer-up and on each keyboard step").
  `onResizeEnd` is the dedicated "persist now" callback, fired once per drag or keyboard
  interaction (not on every `pointermove`), distinct from `onWidthChange` (which fires continuously
  during a drag so the pane visually tracks the pointer).
- **`width: null` means "use the responsive default."** `computeDefaultWidth(containerWidth)`
  mirrors the original "wider containers give the right pane more of the space" ratio behavior,
  with a flat 40% fallback if omitted. Double-click or Enter on the handle calls
  `onWidthChange(null)` directly (not through `onResizeEnd` - there's nothing to persist when the
  consumer's own answer to "what does null mean" might be "clear localStorage").
- **Clamping**: `clamp(width, minEndWidth, containerWidth - minStartWidth - handleWidth)` - same
  shape as the original (`clamp(FORM_MIN, totalWidth - VIEWER_MIN - 12, value)`), reserving the
  handle's own width so the start pane never drops below its minimum purely because the handle ate
  the space.
- **Keyboard**: ArrowLeft/ArrowRight step by `step` (default 16px) in pixel space; Home gives the
  *start* pane (treated as the separator's "primary" pane) its smallest size (i.e. the end pane its
  largest); End gives the start pane its largest size. This primary-pane choice is a judgment call,
  not dictated by the spec (which just says "primary pane" without defining which one that is for
  a two-unlabeled-pane API) - made on the assumption that the start/left pane is normally the main
  content (a document viewer) and the end/right pane the auxiliary adjustable one, matching
  KlearNow's actual use case. Flag this if a future consumer's primary content is the *end* pane.

## Known scope limitations

- **Native has no drag/resize interaction.** The web implementation's `setPointerCapture`-based
  drag has no established gesture-library (`PanResponder`/`react-native-gesture-handler`)
  equivalent anywhere else in this codebase - building one is net-new, non-trivial work, tracked
  separately rather than attempted here. Native currently just stacks both panes vertically,
  non-resizably - a reasonable fallback given two side-by-side panes rarely fit a phone screen
  anyway, but a real limitation if a future use case needs native resizing.
- **Vertical (top/bottom) orientation isn't implemented.** Both of KlearNow's current uses are
  horizontal/side-by-side only. The API (`width`, `minStartWidth`/`minEndWidth`, `handleWidth`) is
  written in orientation-neutral terms (no literal "left"/"right" in the public prop names) so
  adding a vertical variant later shouldn't need a breaking change, but this hasn't been verified by
  actually building one.
- **Row-height-style off-by-one bugs don't apply here** (unlike `Table`'s virtualization) since
  this component doesn't virtualize anything - noted only because it was a relevant lesson from a
  concurrent task in this same session: verify spec-derived assumptions (like "vertical splitter"
  terminology) against the actual spec text and real library precedent, rather than trusting a
  plausible-sounding default.
- **Migration of KlearNow's two call sites is guidance only, not a diff.** `apps/ops-hub` (the
  Dashboard app) isn't in this repo, so the drifted `FORM_MIN`/`VIEWER_MIN`/`PANEL_MIN` constants
  couldn't be inspected directly to decide which value (320/360, 360/280, or a third) is actually
  correct for each page - that decision needs the actual call sites in front of whoever migrates
  them. The new component's `minStartWidth`/`minEndWidth` props accept whatever values that
  decision lands on.

## Out of scope (confirmed, not just deferred)

- **`useFillViewport`** - the viewport-fill-height hook duplicated in both KlearNow call sites has
  no Klear360 equivalent today either; tracked as its own, separate component candidate, not rolled
  into this change.
- Vertical split orientation (see above).
- Full migration of `apps/ops-hub`'s two call sites (see above) - this repo ships the component;
  migrating the app is out of this repo's reach.
