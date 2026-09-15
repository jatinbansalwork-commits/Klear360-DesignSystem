# TypeScript → JavaScript+JSDoc migration guide

House style for converting `packages/klear360/src` components from `.ts`/`.tsx` to `.js`/`.jsx`,
established while converting the first pattern-setting component (`AnnouncementBanner`). Read this
before starting a new conversion PR.

## Prerequisites (already done, don't redo)

Root `tsconfig.json` has `allowJs`/`checkJs` on. Jest, the two `tsconfig-generate-types*.json` and
`tsconfig-typecheck.*.json` configs, the shared `.eslintrc.js` override, and Storybook's `reactDocgen`
are all already updated to handle `.js`/`.jsx`. You shouldn't need to touch any of those files again
for an individual component conversion — if you find yourself needing to, that's a sign of a gap in
the tooling, not something to work around locally.

## File extensions

- `.js` for a file with no JSX (styled-component definitions, style/token functions, `index.js` barrels).
- `.jsx` for a file that returns JSX (the component itself, tests that render JSX).
- Delete the old `.ts`/`.tsx` file in the same change — never leave both versions side by side.

## Props types: `@typedef`

Replace a `type FooProps = {...}` with a file-level `@typedef` block. Intersections with imported
shared types (`TestID`, `StyledPropsKlear360`, `DataAnalyticsAttribute`, etc.) work fine inside the
typedef body using `import('path').TypeName`:

```js
/**
 * @typedef {{
 *   children: import('react').ReactNode,
 *   alignment?: 'center' | 'left',
 *   icon?: import('~components/Icons').IconComponent,
 * } & import('~utils/types').TestID
 *   & import('~components/Box/styledProps').StyledPropsKlear360} FooProps
 */
```

Put per-prop documentation as a plain bullet list under the typedef rather than one `@property` per
line with a trailing description — easier to read, and `@property` doesn't gain you anything here
since the shape is already fully declared in the typedef body.

A file with only typedefs (no runtime exports) needs `export {};` at the bottom so it's treated as a
module. Keep this in its own `types.js` file exactly like the original `types.ts` — don't fold it into
the component file, so other files can still do `import('./types').FooProps` the same way they did
`import('./types')` before.

## Re-exporting a type from a converted file

If the original file did `export type { FooProps }` alongside the component (so consumers could
`import type { FooProps } from '~components/Foo'`), add a local re-declaring typedef at the top of the
`.jsx` file:

```js
/** @typedef {import('./types').FooProps} FooProps */
```

This makes `FooProps` resolvable via `import('~components/Foo').FooProps` for downstream consumers,
matching the old re-export.

## `forwardRef` components

```js
/**
 * @param {FooProps} props
 * @param {React.Ref<import('~utils/types').Klear360ElementRef>} ref
 * @returns {React.ReactElement}
 */
const _Foo = ({ children, ...rest }, ref) => { ... };

const Foo = assignWithoutSideEffects(React.forwardRef(_Foo), { displayName: 'Foo' });
```

No behavior change from the TS version — `assignWithoutSideEffects` stays exactly as-is.

## styled-components with custom (non-DOM) props

This was the trickiest part of the first conversion. The TS original applies a generic to
`.withConfig(...)`:

```ts
export const StyledFoo = styled(BaseBox).withConfig({...})<StyledFooProps>(getCommonStyles);
```

There's no JS syntax for that generic call. Cast the exported binding instead with a `@type` above the
declaration:

```js
/**
 * @type {import('styled-components').StyledComponent<
 *   typeof BaseBox,
 *   import('~components/Klear360Provider').Theme,
 *   import('./types').StyledFooProps
 * >}
 */
export const StyledFoo = styled(BaseBox).withConfig({...})(getCommonStyles);
```

This fixes the type of the *exported* component (so `<StyledFoo isDark={...}>` typechecks at call
sites) but does **not** flow inward as a contextual type for `shouldForwardProp`'s own parameters —
that callback still needs to be widened by hand, exactly like the original TS code already did with
`as string`/`as never` casts. Mirror that with inline JSDoc casts rather than trying to retype the
callback's signature (retyping it correctly runs into contravariance errors — not worth it):

```js
shouldForwardProp: (prop, defaultValidatorFn) =>
  /** @type {string} */ (prop) !== 'isDark' &&
  omitPropsFromHTML(/** @type {never} */ (prop), /** @type {never} */ (defaultValidatorFn)),
```

## `React.cloneElement` with extra props

TS 5.9.3's inference for `React.cloneElement(child, { extraProp })` improved enough that several
existing `@ts-expect-error` comments around this pattern became genuinely unused (caught by
`checkJs` as `TS2578`). If you hit one converting a file, just delete the suppression — don't carry it
forward into the `.js`/`.jsx` version.

## Tests

Convert `Foo.test.tsx` → `Foo.test.jsx` (or `.ts`/`.js` if it has no JSX) in the *same* PR as the
source, never separately. Rename the matching snapshot file to the new extension
(`Foo.test.tsx.snap` → `Foo.test.jsx.snap`) — a plain rename, don't regenerate it. A generic type
argument like `React.createRef<HTMLDivElement>()` becomes a JSDoc-annotated plain call:

```js
/** @type {React.RefObject<HTMLDivElement>} */
const ref = React.createRef();
```

## `as const` lookup objects

A plain `const` object in checked JS does **not** narrow its property values to literal types the
way `as const` did in TS — `{ small: 'small', medium: 'medium' }` infers as `Record<string, string>`,
which breaks a downstream consumer expecting a specific literal union (e.g. a `size` prop typed
`'small' | 'medium' | 'large'`). Give the object an explicit `@type` spelling out each literal value:

```js
/** @type {{ small: 'small', medium: 'medium', large: 'medium' }} */
const textSizeMapping = { small: 'small', medium: 'medium', large: 'medium' };
```

Only do this for lookup objects whose literal-ness downstream code actually depends on (checked by
running `typecheck` and seeing whether a consumer errors) — don't add it preemptively everywhere
`as const` appeared in the original file.

## Known lint flake on the full `yarn lint:klear360` run

Running the *whole-package* lint (not a single file) is intermittently producing spurious
`import/no-extraneous-dependencies` errors for `@klear/klear360-core` on unrelated files, with no
correlation to the actual diff — the same files pass 100% clean every time when linted individually
or in a small group. Confirmed non-deterministic across repeated identical runs (0 vs. 10 errors on
back-to-back invocations with zero code changes in between). Root cause not isolated yet, but it
reproduces independent of any component conversion and is very likely tied to the already-broken,
uncommitted `packages/klear360-core` working-tree state left by unrelated concurrent work (several
`klear360-core` token files are currently deleted on disk without replacement). If you hit this,
verify by linting your specific changed files directly rather than trusting a single full-project run.

## Type-only islands

Some files can't be expressed in JSDoc at all (recursive conditional types, template-literal path
types, branded/nominal types, mapped types with conditional value clauses). These stay permanent
`.ts` files — `allowJs`/`checkJs` lets converted `.js` files import types from them indefinitely via
`import('...')`, same as any other type-only import. Known islands so far:

- `utils/lodashButBetter/get.ts`
- `utils/platform/{types.ts, platform.ts, platform.native.ts, platform.all.ts}` (treat as one unit)
- `utils/types.ts` (the `DotNotation*` token-path types — highest-impact island, feeds 30+ files)
- `utils/isPartialMatchObjectKeys/isPartialMatchObjectKeys.ts` (`DeepPartial`)
- `utils/makeMotionTime/types.ts`
- `components/Icons/_Svg/Path/types.ts` (just the `Exact<T, X>` export)

Don't try to force one of these into JSDoc. If you find another file with this kind of type, add it to
this list rather than working around it locally.

## Verification checklist (every conversion PR)

- [ ] `yarn types:typecheck:web` and `:native` — diff against the pre-existing baseline (currently:
      `Amount.tsx` × 8 errors, `TimeInput.web.tsx` × 2 errors on web; same plus two `Icons/*.native.test.tsx`
      `container` errors on native) — any error beyond that baseline is a real regression, not noise
- [ ] `yarn test:react` / `test:react-native` for the component — zero snapshot diffs. If a diff
      appears, isolate it with `git stash` before assuming it's yours (most native snapshot noise on
      this codebase is pre-existing SVG-fill color drift, unrelated to any single conversion)
- [ ] `yarn lint:klear360` clean on the touched files
- [ ] Load the story in Storybook (`yarn workspace @klear/klear360 react`), confirm it renders and the
      Controls panel is still populated (proves the `react-docgen` switch is reading your JSDoc types)
- [ ] `git diff --stat` — only the intended component's files changed
