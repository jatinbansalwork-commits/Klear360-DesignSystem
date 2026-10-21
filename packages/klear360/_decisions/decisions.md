# Package build output

This covers `@klear/klear360` as a whole: what module format(s) it ships, and why.

## ESM-only: intentional

`@klear/klear360` publishes ESM only (`rollup.config.mjs`'s `getWebConfig`/`getNativeConfig` both emit `format: 'es'`; the package's `exports` map has no `"require"` condition). This is a deliberate decision, not an oversight, revisited most recently as part of the P3 "CJS dual-package support" remediation item (see `scripts/verifyPublishInterop.mjs`, which asserts `require()` fails with the expected `ERR_REQUIRE_ESM`/"Cannot use import statement" shape rather than silently treating it as a pass).

### Why a real CJS build isn't being pursued

Rollup can already emit a CJS bundle trivially — `getKlear360CoverageConfig` in `rollup.config.mjs` does exactly that for `utils/klear360Coverage.ts` (format: `'cjs'`, same plugin pipeline) because Playwright's coverage API needs it. So producing a second, CJS, build target for `components`/`tokens`/`utils` is mechanically easy.

The blocker is downstream, not in this package's own build. Like most of this package's dependencies, `klear360` leaves its `dependencies` external at build time (`externalDependencies` in `rollup.config.mjs`, via `rollup-plugin-peer-deps-external` + `depsExternalPlugin`) rather than bundling them — standard practice for a library, but it means a CJS build of klear360 would still contain bare `require('some-dependency')` calls for every dependency. Several dependencies that are reachable from the public entry points are themselves **ESM-only with no CommonJS entry at all** (`"type": "module"`, no `main`, no `require` condition in `exports`):

- `@table-library/react-table-library` (used by `Table`)
- `react-markdown` and its transitive dependency `unist-util-visit-parents` (used by `MessageViewer`/Klear AI UI)
- `@formatjs/intl-displaynames`, `@formatjs/intl-locale` (used by the i18n utilities)

A CJS build of klear360 calling `require('@table-library/react-table-library')` fails immediately with `ERR_REQUIRE_ESM` regardless of what format *our own* code is compiled to — these packages ship no CJS artifact to require. The same deep-import-style resolution is also used by bundlers (webpack <5, Metro, older Jest configs) that don't yet support Node's `require(esm)` interop, so a nominal "dual-package" build would still break for a meaningful slice of real `require()` consumers the moment they touch `Table` or `MessageViewer`.

Dual-publishing a CJS entry point that works for some import paths and throws for others is worse than being honestly ESM-only: it would pass naive smoke tests (`require('@klear/klear360/tokens')` works fine, since `tokens` has no ESM-only deps) while failing unpredictably for consumers depending on which component tree got pulled in. That's a worse support/debugging story than today's single, consistent "this package is ESM" message.

### What a CJS-only consumer should do instead

- Prefer importing via a bundler (webpack 5+, Vite, Metro, Jest with ESM support) — all of these already resolve klear360's `exports` map correctly and are what every existing consumer uses.
- If stuck in a plain Node CommonJS script, use a dynamic `const klear360 = await import('@klear/klear360/components')` instead of `require()`. This works today in any Node version that can run klear360's own peer deps (React 18+, Node >=22 per this package's `engines` field).
- Node's native `require(esm)` support (stable from Node 22/23 onward) will transparently handle klear360's own ESM output in `require()` once the *dependency* ecosystem above also drops CJS entry points or Node's interop subsumes it — this is intentionally left as "works where the whole chain is Node and new enough" rather than something klear360 needs to special-case.

### Re-evaluate when

- `@table-library/react-table-library`, `react-markdown`/`unist-util-visit-parents`, or the `@formatjs/intl-*` packages ship a CJS build or dual ESM+CJS `exports`, **or**
- These dependencies are replaced/removed, **or**
- Node's `require(esm)` interop becomes the de facto standard across the bundlers this package's consumers actually use (webpack, Metro, Jest), not just plain Node.

Until then, `verify:interop`'s CJS checks are expected to report the "known limitation"/"expected: ESM-only build" outcomes, not failures.

# `on*Change` callback argument shape

This covers a cross-cutting P3 architecture-audit finding: whether single-value `on*Change` callbacks across the whole package consistently pass the new value bare, or wrap it in an object (`{ value }`).

## Found: genuinely inconsistent, not just `onOpenChange`

`Dropdown`'s own `_decisions/decisions.md` already documents and **resolved** a narrower version of this: `onOpenChange`'s *signature* (bare boolean vs. `{ isOpen }`) was inconsistent across overlay components, and `Dropdown` was aligned to the object-wrapped shape used by `DatePicker`/`Popover`/`Tooltip`/`Menu`/`TimePicker`/`SpotlightPopoverTour` as a breaking change with a codemod (see that file's "resolved" section). But auditing every other `on*Change` callback in the package shows wrapping-vs-bare is still inconsistent everywhere else — there has never been a package-wide convention for whether a single scalar value gets wrapped, `onOpenChange` was just the one instance anyone had looked at closely.

**Wrapped in an object**, even though the callback only ever carries one value:

- `Table.onPageChange`/`onPageSizeChange`, `Pagination.onPageSizeChange`/`onSelectedPageChange` — `({ page })`/`({ pageSize })`
- `LightBox.onIndexChange` — `(value: { index })` (note: param itself is named `value`, not destructured, unlike the others)
- `SideNav.onVisibleLevelChange` — `({ visibleLevel })`
- `ChatInput.onFileChange` — `({ fileList })` (wraps a single field for no apparent reason — `fileList` could be passed directly)
- `Accordion.onExpandChange` — `({ expandedIndex })`; `SideNav.onExpandChange` — `({ isExpanded })`; `TreeView.onExpandChange` — `(event: { isExpanded })` (three different components with the same prop name, all wrapping, but `TreeView` additionally names the parameter `event` instead of destructuring like the other two — a second, smaller inconsistency nested inside this one)

**Passed bare** (no wrapping):

- `ResizableSplit.onWidthChange(width)`, `TimePicker.onActiveIndexChange(index)`/`onTimeValueChange(timeValue)`, `ListView.onShowQuickFiltersChange(showQuickFilters)`/`onShowFiltersChange(showFilters)`, `DatePicker.onPickerChange(picker)`/`onVisibleMonthChange(date)`, `SpotlightPopoverTour.onStepChange(step)`, `Table.onGlobalFilterValueChange(value)`, `Preview.onZoomChange(newZoom)`

**Not actually an inconsistency** — these wrap because the value is genuinely multi-field, which is the correct thing to do: `ListView.onSearchChange({ name, value })`, `Preview.onDragChange({ x, y })`, `SideNav.onLinkActiveChange(args: OnLinkActiveChangeArgs)` (5 fields), `Table.onColumnFilterValuesChange(values: Record<...>)`/`onExpandedRowIdsChange(ids: Identifier[])` (the value itself is a collection, not a wrapped scalar).

## Why not fixed inline

Changing either direction (wrap-to-bare or bare-to-wrap) is a breaking change to a public prop's call signature for whichever components move, same reasoning as the resolved `onOpenChange` case. Given how widespread this is (well over a dozen callbacks across 9+ components on one side or the other, several very high-traffic — `Table`, `DatePicker`), this needs a single coordinated breaking-change pass with its own codemod and major-version bump (following the `migrate-dropdown-open-change`/`upgrade-v13` precedent), not a string of one-off breaking patches done component by component. Tracked as a separate follow-up task, scoped to *all* of the callbacks listed above at once so the package settles on one convention in a single breaking release rather than repeating the `onOpenChange` exercise piecemeal for each prop.

# Circular dependencies

This covers a P0 architecture-audit check (from the second "React Library Development Best Practices" pass): whether `src/` has circular module dependencies.

## Found: hundreds of cycles, all compile-time-only, zero runtime risk

`npx madge --circular --extensions ts,tsx src` reports 482 cycles. That number looks alarming but is not a real problem - every single one checked resolves to the same safe shape: **at least one edge in each cycle is a TypeScript `import type`, which is fully erased at compile time and produces zero runtime circular-require risk** (no "cannot access X before initialization" class of bug, since the type doesn't exist in the emitted JS at all).

The large majority (390+) are one specific, repeated pattern: every icon's own file does `import type { IconComponent } from '..'` to pull a shared type back from the `components/Icons/index.ts` barrel it's re-exported from - e.g. `components/Icons/index.ts > components/Icons/SourceToPayIcon/index.ts > components/Icons/SourceToPayIcon/SourceToPayIcon.tsx`, closed by a type-only import back to `..`. This is the same pattern on every icon, not 390 separate problems.

The remaining ~15 are the same pattern in other components, individually verified by reading both directions of each cycle's imports:

- `BaseInput.tsx` ↔ `BaseInputVisuals.tsx` (value import one way, `import type { BaseInputProps } from './BaseInput'` the other)
- `BaseInputWrapper.tsx`/`baseInputStyles.ts` ↔ `types.ts` (`types.ts` has zero value-level imports of its own - it's a pure type file, so anything cycling through it is automatically runtime-safe)
- `Klear360Provider/index.ts` ↔ `useTheme.ts` (index re-exports `useTheme` as a value; `useTheme.ts` only does `import type { Theme } from './'`)
- `List.tsx` ↔ `ListContext.ts`/`ListItem.tsx` (value import one way, `import type { ListProps } from './List'` the other; the `List`↔`ListItem` pair is type-only in *both* directions, so it isn't even a runtime cycle)
- `RadioGroup.tsx` ↔ `RadioContext.tsx`/`useRadioGroup.ts` (value import one way, type-only the other)
- `Radio.tsx` ↔ `RadioIcon.tsx` (value import one way, `import type { RadioProps } from '../Radio'` the other)
- `utils/platform/index.ts` ↔ `castUtils.ts` (index re-exports via `export * from './castUtils'`; `castUtils.ts` only does `import type { Platform } from '.'`)
- `Spark/KlearGlass/types.ts` ↔ `presets.ts` (type-only in both directions)

## Why not "fixed"

There's nothing to fix - this is the normal, idiomatic way to share a component's prop-type definitions with its own sub-files without duplicating the type or hoisting it to a third shared file for no reason. Breaking these cycles (e.g. by moving every shared type to a separate `*.types-only.ts` file with no other imports) would add a layer of indirection across dozens of components to avoid a category of bug (runtime circular-require) that `import type` already fully prevents. Re-run `npx madge --circular --extensions ts,tsx src` if this needs re-verifying after a large refactor - the check itself takes well under a minute and needs no project setup beyond `npx`.

## Independent confirmation: already guarded by existing lint config

This repo's root `.eslintrc.js` already has `'import/no-cycle': ['error', { maxDepth: 4, ignoreExternal: false }]` - a *second*, independent cycle detector, already enforced in CI's lint job, that would fail the build on a genuinely problematic cycle. Running it directly against `SourceToPayIcon.tsx` (`npx eslint ... --resolve-plugins-relative-to . --no-ignore`, bypassing only the default ignore patterns, not the rule itself) produced zero errors despite the type-only cycle `madge` flagged at the same file - confirming `import/no-cycle`, under the TypeScript parser used here, already treats `import type` edges as non-cycle-forming. In other words: this package already has an automated guard against real circular-dependency regressions, and this audit's 482-cycle `madge` output is exactly the set of cycles that guard correctly lets through. No new CI check is needed.

# Context-triggered re-renders

This covers a P2 architecture-audit check: whether any `React.createContext` provider besides `TreeView`'s (see `TreeView/_decisions/decisions.md`'s "React.memo evaluation" section) passes an unmemoized context value to many sibling consumers, causing the same "every sibling re-renders on any one item's state change" problem `TreeView` had before its `useSyncExternalStore`-based fix.

## Swept every `createContext` provider with a list-of-siblings consumption pattern

Checked every component where a context's consumers are rendered in a list/loop (the shape that made `TreeView`'s bug expensive - O(list size) re-renders per interaction, not O(1)):

- **Already correctly memoized**: `SideNav` (`React.useMemo` with a deliberate, commented `exhaustive-deps` override), `Tabs`, `Carousel`, `Radio`'s `useRadioGroup` (`contextValue` built via `React.useMemo`).
- **`Table`**: row selection is owned and re-rendered by `@table-library/react-table-library`'s own internal state/theme engine, not a `React.createContext` this package defines - out of scope for a fix here even if it had the same issue, since it isn't this package's code.
- **`QuickFilterGroup`**: `QuickFilterGroupProvider value={{ selectionType, selectedQuickFilters, onSelect }}` is a fresh, unmemoized object literal every render of `QuickFilterGroup.tsx`, so every `QuickFilterItem` re-renders on any one filter's selection change - genuinely the same category of issue as `TreeView`, just not fixed. Not worth fixing: quick-filter groups are a small, bounded list (a handful of filter chips, not rows/nodes that can scale into the hundreds), so the practical cost of this is negligible - exactly the `TreeView` finding's own point that `React.memo`/selector patterns have a real complexity cost and are only worth paying when the re-render blast radius is actually large.
- **`ListViewFiltersContext.web.tsx`**: not a re-render risk at all, for a different reason - `useListViewFilterContext` has **zero consumers** anywhere in `src/components/ListView` outside its own test file. The context is provided (`ListViewFilters.web.tsx`) but nothing reads it, so there's nothing to re-render. This looks like dead/unused infrastructure rather than a performance bug - worth a separate look, not something this re-render audit should "fix" by adding memoization to code nothing uses.

# Code-splitting large, optional exports

This covers a P3 architecture-audit check: using the bundle-size data already tracked in CI (`baseBundleSizeStats.json`, kept current by the `Update Bundle Size Baseline` CI job), identify genuinely large, optional components not currently code-split that would benefit from it.

## Found one clear outlier: GenUI

`GenUIProvider`/`GenUISchemaRenderer` measures ~290KB, by a wide margin the largest single export in the package - over 2x the next largest (`DatePicker`, ~141KB) and more than double every other export in the top 20. GenUI is also inherently optional in a way most of this package's other large exports aren't: it's a full generative-UI rendering SDK (markdown, a component registry, streaming support), realistically only needed by whichever specific view in a consumer's app renders AI-generated content (a chat panel, an assistant sidebar), not something most pages in a typical app would use at all.

## Not wrapped in `React.lazy` inside this package

A library should not unilaterally wrap its own exported components in `React.lazy`: a lazy-wrapped component can only be rendered inside a `<Suspense>` boundary, so doing this inside `@klear/klear360` itself would force every existing consumer of `GenUIProvider`/`GenUISchemaRenderer` to add a `Suspense` wrapper they don't currently need - a breaking change to how the components are used, not a transparent performance win. Code-splitting is fundamentally a decision about *where in a consuming app's route/panel structure* a chunk should load, which only the consuming app can decide - the library's job is just to make that decision possible and cheap, which it already is: `@klear/klear360`'s ESM output and verified `sideEffects` tree-shaking (see "Package build output" above) mean a consumer's own `React.lazy(() => import('@klear/klear360').then(m => ({ default: m.GenUIProvider })))` works cleanly today with zero changes needed on this package's side.

## What was actually missing: documentation

Nothing told consumers this was possible or worth doing, despite GenUI's size making it the single best code-splitting candidate in the package by a wide margin. Added a "Bundle Size & Code-Splitting" section to `docs/guides/GenUI.mdx` (the consumer-facing GenUI guide) with the size comparison and a concrete `React.lazy`/`Suspense` example scoped to a chat-panel-style use case. No other export's size/optionality profile comes close to justifying the same callout - `DatePicker`/`Table`/`TimePicker` (the next-largest group) are common, frequently-needed form/data primitives most consumer apps already load on first render anyway, not optional feature modules.

## Conclusion

`TreeView` was a genuine, isolated outlier - not a systemic pattern. No other list-of-siblings context in the package has both (a) an unmemoized value and (b) a consumer count large enough for it to matter in practice. Nothing fixed here.

# Dependency audit

This covers a P0 check (from the second "React Library Development Best Practices" gap-analysis pass): is every runtime dependency actually needed, and minimal/up to date where it matters.

## `@emotion/react` looked unused - it isn't. Don't remove it.

All 26 packages in `dependencies` were checked for real usage (`grep` across `src/` for both `from '<pkg>'` imports and bare side-effect `import '<pkg>'`s). 25 had clear direct usage. `@emotion/react` had **zero** - no import anywhere in `src/`, and `yarn why @emotion/react` showed nothing else in the tree requiring it either, which looked like a textbook dead dependency.

It is not one. `@table-library/react-table-library` (which backs `Table`) declares `@emotion/react` as a `peerDependency` (`>= 11`) that it needs internally for its own styling, but doesn't bundle or re-declare as a regular dependency. `klear360` satisfies that peer on every consumer's behalf by carrying `@emotion/react` as its own regular dependency - a legitimate, common pattern for a library wrapping another library with peer deps, not a leftover.

This was caught, not guessed: removing it locally and running `yarn verify:interop` immediately failed with `Cannot find package '@emotion/react' imported from .../node_modules/@table-library/react-table-library/styles-*.js`. Re-added before anything was committed. If this dependency is ever reconsidered, check `@table-library/react-table-library`'s own `peerDependencies` first, and re-run `verify:interop` after removing it locally - don't trust a `grep`/`yarn why` pass alone, exactly the mistake this entry documents.

## Security: 2 critical vulnerabilities found and patched, 84 lower-severity ones deferred

`yarn audit` found 89 vulnerabilities (3 low, 46 moderate, 38 high, 2 critical) across the whole monorepo's dependency tree. Both critical ones were fixed via `resolutions` pins to already-published patched versions (see the `fix(deps)` PR for this item) - `proxy-addr` (IP-spoofing, transitive via `klear360-mcp`'s MCP SDK dependency) and `shell-quote` (command injection, transitive via `npm-run-all`; an existing resolution for a different, older CVE wasn't high enough to cover this one).

The 38 high and 46 moderate findings were deliberately **not** attempted in the same pass - they're mostly several layers deep in devDependency tooling chains (build/test infrastructure, not `packages/klear360`'s own published runtime bundle), and the volume means a careful, dedicated pass is needed to confirm each fix doesn't break the chain of tooling it sits in, rather than a batch of blind `resolutions` pins. Tracked as a separate follow-up task.

# Publish verification: a real external install, not just build output

This covers the second P1 check (from the latest gap-analysis pass): actually `npm pack`-ing the built package and installing it fresh in a separate consumer app, outside this monorepo's own `node_modules`/workspace resolution - not just pointing a bundler at `build/` directly (the earlier tree-shaking verification) or running `verify:interop` from inside the repo (which still resolves `@klear/i18n`/`@klear/i18n-react` via the workspace, masking exactly the failure mode a true external consumer would hit).

## Fixed: several React Native peer dependencies weren't marked optional

A plain `npm install` of the packed tarball (no `--legacy-peer-deps`) failed with `ERESOLVE` for a web-only consumer, even though `react-native`, `react-native-reanimated`, and `react-native-safe-area-context` were already correctly marked `optional: true` in `peerDependenciesMeta`. The cause: `@floating-ui/react-native`, `@gorhom/bottom-sheet`, `@gorhom/portal`, `react-native-gesture-handler`, `react-native-pager-view`, and `react-native-svg` are just as RN-only, but weren't marked optional - inconsistent with the existing precedent. Added the missing entries. Confirmed the fix is real by re-running the same `npm install`: those six now correctly show up as `peerOptional` in npm's own resolution trace, where before they were hard failures.

## Documented, not "fixed": npm's strict peer resolution still isn't fully clean

Marking a peer optional stops npm from treating its *absence* as an error, but doesn't stop npm from still trying to find a version that satisfies that peer's *own* transitive peer requirements during resolution. Concretely: `@floating-ui/react-native` (even though optional) has its own peer requirement on `react-native@>=0.64.0`, and npm's resolver tries to reconcile that against `klear360`'s own `react-native@^0.72` peer range before giving up - a real-world example of the npm 7+ strict peer-resolution algorithm not fully respecting `optional: true` the way an "ignore this peer entirely" setting would. A plain `npm install` can still fail; `--legacy-peer-deps` (or `yarn`, which doesn't enforce peer ranges this strictly by default - consistent with this repo's own consumers like `engine-dashboard` already using it) remains the practical workaround. This is a known, industry-wide limitation of npm's peer resolution for cross-platform libraries with several interdependent optional peers, not something fixable from `klear360`'s side alone.

## Confirmed working correctly

- The packed tarball, installed fresh (outside the monorepo, via `npm install <tarball>` + `--legacy-peer-deps`), bundles and **actually renders** with real `styled-components`-generated class names (`StyledBaseButtonweb__StyledBaseButton-...`) and correct content - the first time this was verified against a genuinely separate `node_modules` tree rather than the build output in place.
- `fonts.css` and every referenced `.woff2` font file are present in the installed package and match what `docs/guides/Installation.mdx` already documents as the way to include them (`import '@klear/klear360/fonts.css'`), with a corresponding `./fonts.css` entry in the `exports` map.
- Confirmed (again, this time from a true external install) that importing from the single `@klear/klear360/components` barrel - as opposed to tree-shaking at the bundler level - requires every one of its non-optional peers (including `@klear/i18n`/`@klear/i18n-react`, which aren't published to public npm) to be physically resolvable for *any* plain `require()`/`import()` that isn't passed through a tree-shaking-capable bundler. This is the same underlying architecture already documented in this file's "Package build output" section (ESM-only, bundler-required) and the GenUI code-splitting guide - not a new problem, just confirmed from the external-consumer side this time.
