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

# `useEffect` necessity audit

This covers the second P0 check (from the latest gap-analysis pass): a re-read of every `useEffect` usage asking a different question than the earlier P1 cleanup sweep did - not "does this clean up correctly," but "does this need to be an effect at all, or could it just be computed during render?"

## Heuristic-flagged candidates mostly turned out to be legitimate, not bugs

Wrote a quick script to flag `useEffect` blocks with a single `setX(...)` call and no listener/timer/DOM/ref access - the textbook shape of "this should just be a derived `const`, not state + an effect." It flagged 46 candidates across `src/components`. Investigated a representative sample across unrelated components rather than reading all 46, since the first few samples already converged on the same answer:

- **`TextInput.tsx`'s `shouldShowClearButton`**: looked like a pure derivation (`Boolean(showClearButton && (defaultValue ?? inputValue))`) stored in state via an effect - converting it to a plain `const` seemed safe and was attempted. It isn't safe: the same setter is **also** called imperatively from the `onChange` handler and the clear button's own click handler, for optimistic UI feedback ahead of a controlled `value` prop's round-trip back from the consumer. The effect is the reconciliation fallback that keeps the optimistic state converged with the real derived truth, not a redundant copy of it. The attempted conversion was caught immediately by checking all call sites, and reverted before being committed.
- **`TextInput.tsx`'s leading/trailing dropdown mutual-exclusion** (`useEffect` closing one dropdown's open state when the other becomes open): the two setters involved are injected into the rendered `Dropdown` elements' own `onOpenChange`, so they're called from inside `Dropdown`'s internal trigger/escape-key/click-outside logic, not from one single toggle handler in `TextInput`. An effect enforcing "only one open at a time" across every possible external trigger is the correct centralization point here, not a bypassable shortcut.
- **`BottomSheetHeader.web.tsx`'s `isHeaderEmpty`**: computed locally as a plain derived boolean, then pushed into state via an effect - but that state setter comes from `BottomSheetContext` and actually lives in the *parent* `BottomSheet.web.tsx` (which needs it for its own `isHeaderFloating` calculation). A child can't set a parent's state directly during its own render without triggering React's "cannot update a component while rendering a different component" warning; an effect that fires after the child commits is the standard, correct way to lift a child-computed value up to a parent.
- **`RollingText.web.tsx`'s index-reset effect** and **`SegmentedControlIndicator.web.tsx`'s post-paint animation-enable effect**: both already have explicit comments justifying why they're effects (resetting cycling state only when content genuinely changes vs. every new array reference; deferring animation until a dimension is actually committed to the DOM after paint) - correctly timed effects, not accidental ones.

## Conclusion

Zero genuine "should be computed at render instead" bugs found in the sample. The heuristic's false-positive rate was high enough (3 clear false positives out of 5 investigated, the other 2 deliberate and commented) that reading the remaining ~41 candidates one by one isn't expected to be a good use of time - the pattern in this codebase is consistently "an effect reconciling optimistic local state, enforcing a cross-component invariant from externally-triggered setters, or lifting a value to a parent," not sloppy one-off derivations. Nothing fixed here. Worth re-running the same heuristic script after a large batch of new component work, in case a genuine instance does show up later.

## Follow-up pass: 82 of the 84 deferred findings fixed, batched by tool chain

**Reverted, then re-applied - the revert's root-cause diagnosis was wrong.** This batch originally merged as #159, then was reverted via #163 on the belief that one of its `resolutions` entries (suspected: `**/eslint-plugin-storybook/brace-expansion` or `**/glob/brace-expansion`, both pinned to `5.0.12`) broke `Lint`/`Test (web)` CI repo-wide. That diagnosis didn't hold up: CI's own logs showed the `Lint` failures were 100% in two packages this batch never touched (`plugin-figma-token-publisher`, `widget-figma-dev-handoff-checklist` - neither is a yarn workspace member, so root `yarn lint`'s `packages` glob swept them in anyway), and the same `Lint`/`Test (web)` failures were already present on `main` at the commit immediately before #159 merged. Confirmed conclusively: CI was **still failing** on `main` *after* #163's revert merged - the revert fixed nothing, since the real cause was unrelated (a missing `.eslintignore` entry for the two non-workspace packages above, plus `klear360-i18n`/`klear360-i18n-react`'s compiled `lib/` output never being excluded from the lint glob - both pre-existing since the repo's initial commit, fixed separately in the `fix(lint)` PR that excludes `lib/` and extends the exclusion to both non-workspace packages). Once that unrelated breakage was actually fixed and `Lint` confirmed green on `main` again, this batch was re-applied as-is (cherry-picked, no changes) rather than redone from scratch - every finding and fix below is unchanged from the original pass.

The deferred 38 high + 46 moderate findings were worked through in six batches, each verified independently (`npx tsc -p tsconfig-typecheck.web.json`, `yarn verify:interop`, `yarn build`, and a representative `yarn test:react` run) before moving to the next:

- **MCP SDK chain** (`@modelcontextprotocol/sdk`, `hono`, `@hono/node-server`, `ip-address`): all transitive via `klear360-mcp`'s MCP SDK dependency. `@modelcontextprotocol/sdk` bumped as a direct dependency (1.26.0 → 1.32.1, within its own declared `hono`/`@hono/node-server`/`express-rate-limit` ranges); `hono`/`@hono/node-server`/`ip-address` pinned via root `resolutions`/`overrides` to the latest patched version within their existing major line (no major bump needed for any of these).
- **glob / brace-expansion chain**: root `glob` devDependency bumped in place (10.4.5 → 10.5.0, same major). `brace-expansion` existed at three different major lines simultaneously in the tree (1.1.18, 2.1.4, 5.0.9, one per consumer chain - eslint/minimatch, jest/rollup, ts-morph/storybook respectively). Scoped `resolutions` entries were added per parent chain (e.g. `**/minimatch/brace-expansion`, `**/@ts-morph/common/brace-expansion`) aiming to bump each major line to its own minimum patched version; yarn's resolver collapsed all of them to a single shared `1.1.21` install regardless (a known yarn-classic `resolutions` quirk when multiple patterns target the same leaf package name) - verified this is still a valid fix, since `1.1.21` falls outside every vulnerable range in all three advisories, and the package's public API has been a single stable string-expansion function since v1.
- **postcss / postcss-selector-parser / fast-uri chain** (stylelint/webpack tooling): `postcss` and `postcss-selector-parser` pinned to their latest patched versions via `resolutions`. One `postcss@7.0.39` instance (via `resolve-url-loader`, itself only reachable through the `react-scripts` devDependency) stayed vulnerable with no same-major fix available; confirmed `react-scripts` is dead weight - not referenced by any script in `packages/klear360/package.json` - so this path is never executed, and bumping it was skipped as unnecessary risk rather than forced to `resolve-url-loader@5` (which needs `postcss@^8` and would otherwise have been the fix). `fast-uri` scoped to its `ajv`-nested usage only (`**/ajv/fast-uri`); a separate, already-safe `fast-uri@2.4.6` elsewhere in the tree was left alone since it predates the vulnerable `>=3.0.0` range entirely.
- **changesets/nyc chain**: `uuid` (8.3.2 → 11.1.1, forced past `istanbul-lib-processinfo`'s own `^8.3.2` range via `resolutions` - safe because `nyc` has no script invoking it anywhere in the repo, and uuid's `v4`/`v5` API plus dual CJS/ESM `exports` map have been stable since v3) and `sprintf-js` (see "not fixed" below).
- **husky chain**: `semver-regex` (2.0.0 → 4.0.5 via `resolutions`, forced past `find-versions`' own `^2.0.0` range - its entire public API is a single regex-builder function, unchanged across majors).
- **`ts-deepmerge`** (direct runtime dependency of `packages/klear360` and `packages/klear360-core`, not a devDependency): bumped 6.2.0 → 8.0.0. This one **did** break something real: v8 removed the package's `default` export (it now only exports a named `merge`), but `tsc` didn't catch it because `export { default } from 'ts-deepmerge'` type-checks fine under `esModuleInterop`'s synthetic-default handling even with no declared `default` in the `.d.ts`. At runtime the re-exported `default` silently became the whole module object (`{ merge: fn }`) instead of the callable function, which would have broken `overrideTheme.ts` (the only non-test consumer) the moment it ran, not at compile time. Caught by manually inspecting `node_modules/ts-deepmerge`'s exports after the bump, not by typecheck or the existing test suite (there's no dedicated test for the `lodashButBetter/merge` wrapper itself - `overrideTheme.test.ts` exercises it indirectly and would have failed, but only at runtime). Fixed by changing both packages' `src/utils/lodashButBetter/merge.ts` to `export { merge as default } from 'ts-deepmerge'`. **Lesson**: a major-version bump of any dependency re-exported via `export { default } from '<pkg>'` needs its actual runtime export shape checked directly (e.g. `node -e "console.log(Object.keys(require('<pkg>')))"`), not just a clean `tsc` run - this interop pattern can type-check cleanly while being broken at runtime.

### Not fixed: `braces` and `sprintf-js` have no patched version published

Two findings remain with no available remediation:

- **`braces`** (high, stack-exhaustion DoS via deeply nested patterns, transitive via `@changesets/cli`'s and `lint-staged`'s `micromatch` chain) - `yarn audit`'s advisory lists `patched_versions: <0.0.0`, meaning no fixed release exists at all; the latest published version (`3.0.3`) is still the vulnerable one.
- **`sprintf-js`** (moderate, unbounded-precision-specifier DoS, transitive via `@changesets/cli`'s and `nyc`'s `js-yaml`/`argparse` chain) - same situation, `patched_versions: <0.0.0`; latest (`1.1.3`) is still vulnerable.

Both are devDependency-only (changesets/lint-staged/nyc tooling, never shipped in `packages/klear360`'s published bundle) and neither accepts untrusted input in this repo's usage (fixed, repo-internal glob patterns and YAML config, not user-controlled data), so the practical exposure is low. Re-run `yarn audit --level moderate` periodically to check whether upstream ships a fix; if either library goes unmaintained, replacing the dependent (`micromatch`'s consumer, or `js-yaml`'s consumer) is the longer-term option, not something to force via `resolutions` without a real patched version to pin to.

# Component size & responsibility audit

This covers a P2 check (from the latest gap-analysis pass): are oversized components actually doing one job, or several that should be split apart?

## Sampled the 10 largest component files - one genuine violation found

Sorted every `.tsx` component file by line count. The top 10 (897-1897 lines) were read structurally (top-level `const`/`function` definitions, not full read-throughs) to judge whether each file's size comes from **one** component that's internally complex, or from **several unrelated** components sharing a file:

- **`LineChart.native.tsx`** (1897 lines, the single largest file), **`AreaChart.native.tsx`** (1619), **`SankeyChart.native.tsx`** (1254): each is one component (plus one tightly-coupled sub-piece, e.g. `LineSeries`) doing from-scratch SVG geometry, axis/tick calculation, tooltip positioning, and gesture handling with no charting library on the native side (unlike web, which uses `recharts`). Long because the single task is genuinely large, not because unrelated things are mixed in.
- **`BaseInput.tsx`** (1340), **`BaseButton.tsx`** (913), **`Table.web.tsx`** (1157): each is one component (`_BaseInput`/`_BaseButton`/`_Table`) whose own function body is long because it handles every state/variant of a widely-shared base component or a feature-rich component (Table: sort, filter, paginate, select, virtualize, inline-edit). These already have well-factored sibling files (`TableHeader.web.tsx`, `TableBody.web.tsx`, `TablePagination.web.tsx`, etc.) for the parts that *do* split out naturally - the orchestrating file itself is expected to be large.
- **`Carousel.web.tsx`** (670): `Controls`, `CarouselContainer`, `CarouselBody`, and `Carousel` - a small number of tightly-coupled, carousel-specific sub-parts in one file. Normal composition, not a violation.
- **`GenUIComponents.web.tsx`** (1764 lines) - **a genuine violation**. This file bundles two completely unrelated things: a full markdown-rendering subsystem (list/heading/blockquote/code-block styled components, a copy-to-clipboard hook, markdown-specific renderers - roughly 700 lines) and a registry of 15 independent `Render*Component` functions, one per GenUI schema type (`RenderTextComponent`, `RenderChartComponent`, `RenderTableComponent`, `RenderCardComponent`, `RenderBadgeComponent`, `RenderSpacerComponent`, `RenderDividerComponent`, `RenderStackComponent`, `RenderGridComponent`, `RenderInfoGroupComponent`, `RenderButtonComponent`, `RenderLinkComponent`, `RenderAlertComponent`, `RenderAmountComponent`, plus `ComponentErrorFallback`/`ChartSkeletonLoader`). Unlike every other file sampled, these have no structural relationship to each other beyond "GenUI schema building block" - `RenderTableComponent` and `RenderBadgeComponent` share nothing.

## Not split here, but it's a safe refactor - scoped and spun off

Checked the blast radius first: only 4 files import from `GenUIComponents.web.tsx` (`index.ts`, `GenUI.stories.tsx`, `GenUISchemaRenderer.web.tsx`, `GenUIProvider.web.tsx`), all internal to the `GenUI` feature - no public API changes needed, this is a pure file reorganization (move code, keep the same exports re-exported from the same barrel). That makes it lower-risk than most "spin off" candidates in this audit series, but splitting ~20 components across several new files correctly (keeping shared helpers like `useCopyToClipboard`/`COPIED_FEEDBACK_DURATION_MS` and the markdown-specific styled components wired to the right new homes) is still substantial, deliberate work that deserves its own dedicated pass with full test verification, not a rushed split at the tail end of an audit. Proposed split: a `markdown/` subfolder for the markdown-rendering subsystem, and a `renderers/` subfolder with one file per schema-component family (grouping closely related ones like `RenderSpacerComponent`/`RenderDividerComponent` together is fine; `RenderTableComponent` likely deserves its own file given its own sub-helpers like `RenderTableCellContent`/`TableRowHoverActions`). Tracked as a separate follow-up task.

## Follow-up: the split landed

The spun-off task completed the proposed split (`GenUIComponents.web.tsx` is now 82 lines - a registry/barrel only). `markdown/MarkdownRenderers.tsx` holds the markdown-rendering subsystem; `renderers/Render*Component.tsx` holds one file per schema-component family, matching the grouping proposed above. Re-sampled the 15 largest non-test/non-story files in the package after the split - no other file in that list shows the same "several unrelated things sharing a file" shape; the rest (chart native renderers, theme token files, `componentStatusData.ts`, `BaseInput.tsx`, `Table.web.tsx`, `KlearGlassMount.ts`/`klearGlassShader.ts`) are each confirmed single-purpose, same reasoning as above (one genuinely large task, not several). Component-size/SRP audit is closed out - no further action.

# Circular-dependency and unnecessary-abstraction audit

Covers the one remaining unchecked item from the "Component Architecture and Reusability" section: "Avoid circular dependencies and unnecessary abstractions."

## Circular dependencies: 519 flagged by `madge`, all confirmed type-only (not a real finding)

Ran `npx madge --circular --extensions ts,tsx --ts-config tsconfig.json src/components`: 519 cycles reported. Before assuming these are real, grouped them by their first node to find the distinct underlying clusters rather than treating 519 as 519 separate problems - most are the same handful of cycles showing up as multiple overlapping sub-paths:

- **453 of 519** are the auto-generated `Icons/` barrel: every icon file does `import type { IconComponent } from '..'` (the `Icons/index.ts` barrel that re-exports every icon). The file header literally says `// This file is auto generated - Modify at klear360/plop/icon/iconReexports.ts.hbs`.
- The rest cluster around `tokens/theme/theme.ts` / `tokens/global/index.ts` (8+8), `Input/BaseInput` (7), `List` (3), and one-off pairs: `Klear360Provider`, `Checkbox`/`CheckboxGroup`, `Radio`/`RadioGroup`, `Counter`, `Badge`, `Button`/`IconButton`, `Dropdown`, `Chip`, `GenUI`.

Checked every distinct cluster's actual import statements (not just trusting madge's chain display) to see whether the cycle closes with a real runtime (value) import or a type-only one. Every single cluster sampled - the Icons barrel, theme/tokens, `BaseInput`↔`CounterInputContext`, `List`↔`ListItem`, `Dropdown`↔`useDropdown`, `Chip`↔`chipTokens`, `GenUIComponents`↔`GenUISchemaRenderer` (which does have one real value-level edge, but the edge that closes the loop back to `GenUIComponents` is `import type`) - closes the loop with `import type`, never a plain `import`. TypeScript erases `import type` entirely at compile time, so none of these exist as circular `require`/`import` calls at runtime; there's no module-initialization-order risk, which is the actual hazard circular dependencies cause. This is the standard, idiomatic pattern for a component and its own prop-type file referencing each other (parent needs the child's prop type, child needs the parent's prop type for context) and for a barrel re-exporting a type its own members also import - not a code smell, and not worth restructuring (the Icons case would mean changing the codegen template for zero runtime benefit).

**No fix applied - none needed.** If `madge` or an eslint rule (`import/no-cycle`) is ever added to CI, configure it to ignore type-only edges (`import/no-cycle` has a `disableTypeOnlyImports`-style option for exactly this) so it doesn't flag this same pattern as a false positive repo-wide.

## Unnecessary abstractions: none found

Looked for the classic smells - a wrapper component/hook with exactly one call site that adds no behavior, or an indirection layer with nothing underneath it - across the handful of single-use-looking `use*` hooks and HOC-style wrappers turned up by the circular-dependency pass above (`useCheckboxGroup`, `useRadioGroup`, `useDropdown`, `useCheckbox`). Each one holds real, non-trivial state/logic specific to its owning component (not a pass-through), and each is already the established pattern this codebase uses consistently for every form-control component (`Checkbox`, `Radio`, `Switch`, etc. all have their own `use<Component>` hook) - removing any one of them would be inconsistent with its siblings, not a simplification. No genuine unnecessary abstraction found; nothing fixed.

# Performance audit (P3)

Covers the "Performance Optimization" checklist section: `React.memo`, `useMemo`, `useCallback`, `React.lazy`/`Suspense`, state colocation, stable list keys, bundle size/tree-shaking, and profiling-before-optimizing. Per the checklist's own stated principle ("apply memoization ... when they provide a real benefit ... profile before applying optimizations"), this pass looks for genuine, verified cases rather than blanket-applying `memo`/`useMemo`/`useCallback` across the board.

## Stable list keys: 24 production files use index-based keys; 2 fixed, 22 verified as correct as-is

Searched every `.map(`/`React.Children.map` call in `src/components` for `key={index}`/`key={i}`/`key={idx}` (290 hits total, but 266 of those are in `.stories.tsx`/`.test.tsx`/`__tests__`/`docs/` files, which don't ship and aren't part of this audit). Read the surrounding code for each of the 24 production hits to judge whether the backing list can actually be reordered/filtered/have items inserted in the middle at runtime - that's the only case where index-as-key causes a real bug (wrong component identity/state reuse on reorder), not a performance issue per se.

**Fixed (stable identifier already computed, free to swap in):**
- `Pagination/Pagination.web.tsx` - `pageSizeOptions.map((item, index) => ... key={index} ...)`. Each `item` is already used as the unique `value`/`title` (`item.toString()`) one line later, so it's already proven unique; changed `key={index}` to `key={item}`.
- `DatePicker/QuickSelection/PresetSideBar.web.tsx` (both renders) - `presetStates.map(({ preset }, index) => ...)`. `preset.label` is already used as the `onChange` lookup key elsewhere in the same file (proving it's expected to be unique) and as the `value`/children; changed both to `key={preset.label}`.

**Verified correct as-is (22 files) - no fix applied:**
- **Fixed-length/static/never-reordered arrays**: calendar weekdays (`Calendar.native.tsx`), carousel indicator dots (`Indicators.web/.native.tsx`), table loading-skeleton placeholder cells (`Table.web.tsx` - `Array.from({ length: columnCount })`, there's no real data yet), date-input segments from react-aria's own segment state (`TimeInput.web.tsx`), chart label word-wrap lines (`CommonChartComponents.web.tsx`), step indicators (`StepGroup/StepLine.native.tsx`).
- **`React.Children.map`/raw-children-wrapping idiom**: `RadioGroup.tsx`, `CheckboxGroup.tsx`, `Breadcrumb.web.tsx`, `List/ListItem.tsx`, `ActionList/ActionListBox.web.tsx`. These wrap arbitrary `React.ReactNode` children (strings or elements) that have no inherent stable id to use instead - this is the standard, idiomatic pattern React itself uses internally for the same job.
- **AI/schema-driven content with no stable id in the data**: the `GenUI/renderers/*` files (content comes from a model-generated schema with no id field) and `ChatMessage/ReasoningTraces.web/.native.tsx` (steps are either streamed/appended or rendered upfront as a whole, never reordered or spliced in the middle; `ReasoningTrace` only has a `label`, which isn't guaranteed unique).
- **`Charts/DonutChart/DonutChart.web.tsx`** - looked the closest at this one since `filteredData` genuinely changes when a user toggles a legend item (a real "list can be filtered" case). Read the full context: the author already solved the real problem here - color consistency across filtering is handled via a separate `filteredToOriginalIndexMap` (original-index -> color lookup), and the React `key` is deliberately the post-filter `filteredIndex`. That's correct, not an oversight: `RechartsCell` is a stateless, prop-driven rendering primitive with no local state to corrupt, so keying by post-filter position (so cells fill positions 0..N-1 contiguously) is the right behavior, not a bug.
- **`LightBox/LightBoxThumbnailStrip.web.tsx` / `LightBoxMainView.web.tsx`** - `items` could use `src`/`thumbnail` as a marginally more "correct" key, but the gallery array is passed once as a fixed list of children and never reordered/filtered at runtime in this component's actual usage pattern - no real benefit to changing it, left as-is per the "profile/verify a real benefit first" principle rather than changing it on general principle alone.

Verified with `npx tsc -p tsconfig-typecheck.web.json` (clean) and the targeted test suites for the two changed components after the fix.

## `React.memo` / `useMemo` / `useCallback` / state colocation: already substantially done, verified rather than re-audited from scratch

Before assuming these were unaudited, checked whether prior work already covered them - `CONTRIBUTING.md` has its own "Performance & Profiling" section (real-DevTools-Profiler-first methodology, a documented fallback for non-interactive repros using `<Profiler>`, and an instruction to record findings in the component's own `_decisions/decisions.md`). Following that trail turned up substantial, already-shipped, already-verified work on exactly this topic across the three heaviest list-rendering components, all merged to `main`:

- **`TreeView`** (`TreeView/_decisions/decisions.md`, "React.memo evaluation"): a P2 audit found `React.memo(TreeViewItem)` was a complete no-op - every row read `selectedValuesSet`/`expandedValues`/`tabbableValue` straight off context, so any selection or expansion anywhere re-rendered every row regardless of memo. Measured with a reproducible jest harness (a real `<Profiler>`-based measurement, since an interactive browser wasn't available): **110/110 rows re-rendered on a single leaf selection or branch collapse, before the fix**. Fixed with a `useSyncExternalStore`-based selector hook so each row reads only its own slice of the shared state; `TreeViewItem`/`TreeViewLoadMore` now actually benefit from their `React.memo` wrapper. SSR-safe (`getServerSnapshot` handled), verified via a dedicated `TreeViewItem.renderScope.web.test.tsx` plus the full existing suite. Shipped in merged PR #117 (audit) and #119 (fix).
- **`ActionList`/`Dropdown`** (`ActionList/_decisions/decisions.md`, "React.memo evaluation"): the `TreeView` audit above explicitly flagged `ActionListItem` as having the identical bug (reads `activeIndex`/`selectedIndices`/`filteredValues`/`isKeydownPressed` off `useDropdown()` context). Before the fix: every arrow-key press, filter keystroke, or selection re-rendered every `ActionListItem` in the list - measured and tabulated (before/after render counts). Fixed the same way (selector-based subscription via `useSyncExternalStore`), with the extra care of moving `onOptionClick` off a context-closure onto a ref-backed stable callback so a non-re-rendering item doesn't click with stale captured state. Verified via `ActionListItem.renderScope.web.test.tsx` plus the full `Dropdown`/`TreeView`/`Menu`/`AutoComplete`/`FilterChip*` suites. Shipped in merged PR #144 (audit) and #158 (fix).
- **`Table`** (`Table/_decisions/decisions.md`, "Re-render architecture"): `TableContext` was split into `TableRowContext` (selection/appearance, read by the N-instance `TableRow`/`TableCell`/`TableEditableCell`/`TableFooterCell`) and `TableDataContext` (sort/filter/pagination, read only by single-instance toolbar/header/pagination pieces) - previously one shared context meant any sort/filter/page change force-rendered every mounted row. `TableRow`/`TableCell`/`TableHeaderCell` wrapped in `React.memo` now that it's effective. **Honestly documented remaining gap**: a row-selection click still re-renders every *currently mounted* row (not the full dataset) because `@table-library/react-table-library`'s own `Row`/`Cell` primitives are themselves unmemoized consumers of that library's internal context - true per-row isolation would need replacing those primitives' own selection wiring, called out explicitly as out of scope rather than silently left incomplete.

These three cover the actual hot paths - every component in the library that renders a user-supplied, potentially-large, frequently-interacted-with list. Re-doing this investigation from scratch across all 1071 production source files would contradict the checklist's own stated principle ("profile before applying optimizations" - not blanket-apply `memo`/`useMemo`/`useCallback` everywhere); the right action here was to verify this existing work is real (read the actual before/after measurements and the actual diffs, not just trust the write-ups) and confirm it's merged, which it is.

**`useMemo`/`useCallback` general usage**: already used in 85 and 67 production files respectively, including the non-trivial cases spot-checked directly - `DonutChart.web.tsx`'s `filteredData`/`filteredToOriginalIndexMap` (an actually-expensive per-render filter+index-remap, correctly memoized on `[data, nameKey, selectedDataKeys]`), and the stable-callback-identity work in the `TreeView`/`ActionList` fixes above (`React.useCallback(..., [])` reading current state through a ref, specifically to give context callbacks a stable identity across renders). No further sweep needed beyond what the targeted investigations above already covered.

**State colocation**: the context-splitting described above (`Table`'s two-context split, `TreeView`/`Dropdown`'s external-store-plus-structural-context split) *is* the state-colocation fix for this codebase's actual problem shape - large shared context objects were the thing causing state to affect more components than needed, not state sitting one level too high in a component tree. No further instance of that found.

## `React.lazy`/`Suspense`: not applicable to this package, not a gap

Zero usages anywhere in production source. Checked whether this is a gap or a non-issue: `React.lazy`/`Suspense`-based code-splitting is a decision about *when a consuming application* loads a chunk (typically at a route boundary), not something a component *library* applies to its own exports - `@klear/klear360` ships plain, synchronous components for the consumer's own bundler/router to decide how to split, the same way every comparable React component library (MUI, Chakra, etc.) does. A consumer that wants to lazy-load a heavy `klear360` component (e.g. a `Charts` component) already can, via their own `React.lazy(() => import('@klear/klear360/components').then(m => ({ default: m.LineChart })))` - that capability doesn't depend on anything inside this package changing. Not a finding; nothing to fix.

## Bundle size monitoring and tree-shaking: already done, verified via CI config and CONTRIBUTING.md

The P1 publish-verification audit's "tree-shaking" finding (single-barrel-file forces a plain `require()` to eagerly resolve every peer) was about *raw CJS* resolution with no bundler - that's still true and still documented. Checked separately whether tree-shaking works for the realistic case (a consumer using a real bundler), and whether bundle size is actually monitored, rather than leaving both as "partial":

- **Monitored in CI, not just locally**: `.github/workflows/ci.yml` runs `pregenerate-bundle-size-info`/`generate-bundle-size-info` on every CI run (both the main `ci.yml` job and the release workflow). `CONTRIBUTING.md`'s "Bundle size" section confirms a `Bundle Size` CI job comments the per-component size diff on every PR against a baseline branch (`bundle-size-stats`), and a separate job refreshes that baseline on `main`.
- **Tree-shaking verified against a real bundler**: `CONTRIBUTING.md`'s "Tree-shaking" section documents the actual measurement - importing a single component (`Button`) via `esbuild` against the built package output produces a 320KB bundle, versus 7.5MB for `import * as AllComponents` from the full barrel, with esbuild's own output confirming every unused component is excluded as "having no side effects" (the package's `sideEffects` field is what makes this possible). This is the realistic consumer path (bundler + ESM), distinct from the raw-CJS-`require()` case the P1 audit flagged - the two findings don't contradict each other, they're about different consumption paths.

Both sub-items move from "partial" to done - genuinely monitored and genuinely verified, not just configured and assumed to work.

# Hooks & State Management audit: the two remaining unchecked items

Covers "Use `useReducer` when state transitions become complex" and "Use Context carefully to avoid unnecessary re-renders" from the "React Hooks and State Management" checklist section.

## Context re-render audit: one real bug found and fixed, matching the already-fixed Table/TreeView/ActionList shape

Surveyed all 49 `React.createContext` usages in production source for the same anti-pattern already found and fixed in `Table`/`TreeView`/`Dropdown` (see the Performance audit above): an inline, unmemoized `<Context.Provider value={{ ... }}>` object literal that bundles a frequently-changing field in with ones that are read far more broadly, forcing every consumer to re-render on every change regardless of what they actually read. Grepped for `Context.Provider value={{` specifically (14 hits) rather than eyeballing all 49, since a context whose value is already memoized or only ever holds a stable primitive isn't a candidate.

**Found and fixed: `TopNav/TabNav`'s `TabNavContext`.** `TabNavContext.Provider` bundled `containerRef`, `controlledItems`, and `setControlledItems` into one object, recreated on every `TabNav` render. Checked every actual consumer of `useTabNavContext()` (there's exactly one, `TabNavItem`) and found it only ever destructures `setControlledItems` - `controlledItems` is read by nobody via the context (a separate internal `TabNavIndicator` component has its own `containerRef` prop from a *different* ref, unrelated to the one in this context value, which turned out to be entirely dead). Since `controlledItems` is recomputed on every resize-driven overflow recalculation (see `TabNav.web.tsx`'s `resizeCallback`), every resize event was forcing every mounted `TabNavItem` to re-render for a field none of them read. Fixed by:
- Dropping the unused `containerRef` field and the never-consumed-via-context `controlledItems` field from `TabNavContextProps` entirely - the context now only carries the one thing anything actually reads (`setControlledItems`, already a referentially-stable `useState` setter).
- Wrapping the remaining `{ setControlledItems }` value in `useMemo` for correctness against any other reason `TabNav` might re-render.
- Adding the `React.memo` wrap `TabNavItem` was missing, now that it can actually be effective: the Provider value is stable, and `React.memo`'s shallow prop comparison bails out correctly even though `TabNavItems`' `React.cloneElement` wrapping produces a structurally new props object every render, since the actual prop *values* (title strings, booleans, numbers) stay the same.

**3 free wins**: hoisted three other `Context.Provider` values that were always-static object literals (recreated every render for no reason, just not on anything that fans out to many consumers) to module-level constants - `GenUI/markdown/MarkdownRenderers.web.tsx`'s `ol`/`ul` renderers (`{ ordered: true }`/`{ ordered: false }`, directly alongside the file's own pre-existing `markdownComponents` stable-reference pattern for exactly this "prevent re-renders during streaming" reason), `AnimateInteractions.web.tsx`'s `{ isInsideAnimateInteractionsContainer: true }`, and `Table/TableEditableCell.web.tsx`'s `{ isInsideTableEditableCell: true }`.

**The remaining 7 of 14 reviewed, left as-is - genuinely low-risk:** `AppBar`/`TopNav`'s `{ colorScheme, themeTokens, variant }` and `SankeyChart`'s `{ chartName, dataColorMapping }` are each a single provider instance per page/chart wrapping one subtree, with values that only change on a theme switch or new chart data (not per-interaction) - not the N-instance-list-reading-shared-volatile-state shape that caused the Table/TreeView/TabNav bugs. `SideNavLink`'s `NavLinkContext` is correctly structured already (each nav link creates its *own* provider for its *own* children, not one shared provider fanning out to siblings) - same safe pattern as `BaseMenuItem`'s per-item context.

Verified with `npx tsc -p tsconfig-typecheck.web.json` (clean).

## `useReducer`: one genuine candidate found, deliberately not touched

Checked every production file with 5+ `useState` calls for the specific trigger React's own docs give for reaching for `useReducer` - multiple pieces of state updated together, in the same handler, in response to one interaction (not just "many state variables," which is often correctly idiomatic as separate `useState` calls for unrelated concerns).

- **`Dropdown.tsx`** (8 `useState` calls) and **`BottomSheet.web.tsx`** (8): each state variable is read/written by a *different* consumer for a *different*, independent reason (keyboard state, controlled-mode detection, autocomplete presence, three independently-measured DOM heights via separate `ResizeObserver`s, etc.) - never coordinated together in one handler. Correctly modeled as separate state; a reducer here would bundle unrelated concerns into one dispatch surface for no benefit.
- **`Carousel.web.tsx`**: similarly independent, scroll-position-derived flags.
- **`SideNav.web.tsx`** - **the one genuine candidate**. `onLinkActiveChange`'s L1-collapse branch coordinates `isL1Collapsed`/`isTransitioning`/`isL1Hovered`/`isHoverAgainEnabled` together in one handler (collapse L1, start the transition animation, suppress hover-to-reexpand for a timed window to avoid a UI flicker bug) - exactly the "multiple pieces of state change together for one interaction" shape `useReducer` exists for. Deliberately **not refactored**: this logic is delicately tuned (multiple `setTimeout`s tracked in `timeoutIdsRef`, comments explicitly calling out specific flicker bugs each piece prevents) and currently working correctly - converting it to a reducer here is a real, nontrivial rewrite of animation-timing-sensitive code with no existing defect driving it, not a drive-by cleanup. Flagging it as the one place in the codebase where the pattern genuinely fits, for whoever next touches `SideNav`'s collapse/transition logic substantially enough to justify the rewrite risk, rather than forcing it into this audit pass.
- The one existing `useReducer` call in the codebase (`BaseDatePicker.web.tsx`) is the `useReducer((x) => x + 1, 0)` force-rerender idiom, not a state-machine use - unrelated to this checklist item, not evidence either way.

No code changes from this half of the audit - the real work was in the Context re-render findings above.

# Documentation closeout: accessibility behavior and known limitations

Covers "Document accessibility behavior and known limitations" from the "Documentation and Versioning" checklist section, tracked as "partial" - a11y behavior itself is well-covered (axe-core testing, keyboard-interaction tests, a shared `makeAccessible` utility - see the Testing closeout above), but there was no centralized documentation of any of it.

Checked what's actually there before writing anything, rather than documenting an idealized architecture: the `accessibilityLabel` prop convention (already established, consistent across every component), the `makeAccessible`/`accessibilityMap` cross-platform utility (one shared prop vocabulary mapped to `aria-*` on web and React Native accessibility props on native), the `jsx-a11y`/`react-native-a11y` ESLint plugins enforced on every PR (and the *specific, real* reasons three of their rules are turned off - two are tooling false-positives against `makeAccessible`'s dynamic role-setting and against web files being misflagged by a native-only rule, one is a deliberate judgment call on `accessibilityHint`), and the `jest-axe`-based `assertAccessible()` helper's actual coverage.

Added `docs/guides/Accessibility.mdx` - a new Storybook guide page (`Guides/Accessibility`) consolidating all of the above into one place, with an honest "Known limitations" section (coverage is targeted at genuinely-interactive components, not spread evenly across all ~90; this guide documents the shared architecture, not a full per-component ARIA reference - that stays in each component's own Storybook docs page). Didn't attempt to retrofit an "Accessibility" section into every individual component's docs - with ~90 components, that's a much larger undertaking than this one gap justifies, and the per-component API docs (prop tables showing `accessibilityLabel`, etc.) already cover the per-component level reasonably.
