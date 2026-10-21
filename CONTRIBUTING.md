# Contributing guidelines for `klear360`

## Local Development Setup

These steps should get you up and started for local development setup. Please ensure you've NodeJS and Yarn installed on your machine before proceeding.

### Prerequisites

- `cd` into `packages/klear360`

- Install dependencies:

  ```sh
  yarn
  ```

### Setting up web

- Run storybook for web:

  ```sh
  yarn start:web
  ```

- That's it! You can access storybook on http://localhost:9009

### Setting up React Native

If you're contributing to React Native parts, you can follow the following setup.

You can skip it if you're contributing to web only component. Our [Component Status Page in Documentation](https://klear360.klear.com/?path=/docs/guides-component-status--docs) mentions which components are react native supported and which are web only

<details>
<summary><h4>React Native Local Development Setup</h4></summary>

### Setting up iOS

- Get a tea, coffee or your favorite drink, you'll need it 😸

- Install [`brew`](https://brew.sh/) if you don't have it installed

- Install watchman:

  ```sh
  brew install watchman
  ```

- Install [Xcode](https://reactnative.dev/docs/environment-setup#xcode).

  > [!Note]
  >
  > Sometimes it can take a very long time for Xcode to install. Check [here](https://apple.stackexchange.com/questions/427640/mac-app-store-xcode-download-stuck-at-installing) for troubleshooting.

- Install an iOS 13 simulator in Xcode: Xcode > Preferences > Platforms.

  > [!Note]
  >
  > Sometimes this can get stuck or take a very long time. Check [here](https://stackoverflow.com/questions/29058229/download-xcode-simulator-directly) for troubleshooting.

- Install cocoapods:

  ```sh
  sudo gem install cocoapods
  ```

- Install pods. This can be done by running `pod install` in the `ios/` directory for Intel machine. For M1, things might not work out of box.

  > [!Note]
  >
  > Follow the note [here](https://reactnative.dev/docs/environment-setup#cocoapods) if you're using M1

- `cd` back to `packages/klear360`. Start storybook dev-server for ios:

  ```sh
  yarn start:ios
  ```

  > **Tip:**
  >
  > You don't need to build the app everytime (only when you're changing native dependencies), once the app is built you can just start the storybook server and open the app directly on your simulator

- If the stars aligned correctly, the storybook app should get installed and up and running on the simulator. If not, please refer to the official [guide](https://reactnative.dev/docs/environment-setup) for any deviations.

_The storybook can take some time to open after simulator starts. Don't worry, it will start after few minutes (hopefully 🤞)._

### Setting up Android

- Of course you'll need a fresh cup of tea, coffee or your favorite drink 😸

- Follow the official [guide](https://reactnative.dev/docs/environment-setup). Some of the initial steps needed are the same for iOS. Please note the following tips and deviations:

  - Use the Android 12 SDK, when you follow the official guide, the default selected SDK is not Android 12
  - When you setup the emulator from Android Studio, create a fresh one (delete the one that is created by default). The default one comes with low storage and memory so you'll likely run into `INSTALL_FAILED_INSUFFICIENT_STORAGE` issue. For RAM and virtual memory heap you may use `2000` and for storage `4000` as values.

  > **Tip**
  >
  > At times, you might run into some weird issues during installation. Sometimes restarting your computer does the trick. You can also `cd` into the `android` directory and run `./gradlew clean` to clean up cache and built files when retrying installation or running the app.

- `cd` back to `packages/klear360`. Start the storybook dev-server for android:

  ```sh
  yarn start:android
  ```

  > [!Note]
  >
  > If you already have `yarn start:ios` running, you might have to close it since `yarn start:android` will try to run react-native server on the same port and fail with port taken error.
  >
  > If you want to run both, android and ios at the same time, you can use `yarn start:native` instead.

  > [!Note]
  >
  > Make sure `$ANDROID_SDK_ROOT` is added before running the above command, you can run `echo $ANDROID_SDK_ROOT` in same terminal to confirm. (You can run `source ~/.zshrc` or `source ~/.bash_profile` depending on where you added the variables)

- If the stars aligned correctly, the storybook app should get installed and up and running on the emulator 🎉

> [!TIP]
>
> You can use `yarn start:all` command to run storybooks on all platforms like web, android, and ios (better to not use it in development though to avoid stressing your laptop)

</details>

## Codebase Terminologies and Structure

### Base Component Terminology in Code

We have some base components defined internally such as BaseInput, BaseButton, BaseText which act as a base for multiple exposed components.

E.g.

- Heading, Display, Text all use BaseText internally
- TextInput, PasswordInput, SelectInput all use BaseInput internally
- Majority of our components use BaseBox internally which is a more flexible version of the exposed Box component.

### Cross Platform Guide

You will see files with `.web.tsx` or `.native.tsx` syntax. The `.web.tsx` files end up in web bundle and `.native.tsx` files end up in react native bundle. You can define common logic in normal `.tsx` files which can be imported in both web and native files.

#### Cross Platform TypeScript Guide

[Writing Cross-Platform TypeScript In Klear360](./rfcs/writing-cross-platform-typescript.md)

## Testing Changes

### Unit Tests

We have unit tests which you can run by running following commands

```sh
cd packages/klear360
yarn test:react # web tests
yarn test:react-native # native tests
```

### Visual Tests

We also have visual tests that run on every PR. So if your PR changes / breaks a certain component, the diff will show up on chromatic checks of PR

**Where to find it:** the `Chromatic` job runs in the `CI` workflow on every PR. Once it finishes, find it in the PR's checks list (or in GitHub's "Checks" tab) and open the `Details` link - this takes you straight to the Chromatic build, with a per-story grid of every visual change it detected against the baseline on `main`.

**What to do when you see a diff:**

- Open each changed story and compare the before/after snapshot.
- If the change is the intended result of your PR (e.g. you changed a component's padding or color), click **Accept** on those snapshots in Chromatic. This updates the baseline so future PRs diff against your new, intended look.
- If the change is unintended (e.g. an unrelated component shifted because of a shared token or style change), treat it as a bug - fix it, push the fix, and let Chromatic re-run.
- If you're unsure whether a flagged change is intentional, ask for a second opinion in the PR before accepting.

**This is non-blocking by design.** The Chromatic job runs with `exitZeroOnChanges: true`, so it always reports success in GitHub's check list even when it finds visual differences - a visual diff is a flag for human review, not a CI failure. Don't expect (or wait for) the Chromatic check to go red; instead, make it a habit to open the Chromatic build on every PR that could affect visual output and review the diff before merging, since CI won't stop you if you skip it.


### Interaction Tests

We support writing interaction tests using playwright. You can check example interaction tests of toast at [Toast.test.stories.tsx](./packages/klear360/src/components/Toast/__tests__/Toast.test.stories.tsx). You can run these tests by visiting the Interaction Tests section in klear360 documentation E.g. [Toast Stacking Interaction Test on Documentation](https://klear360.klear.com/?path=/story/components-interaction-tests-toast--toast-stacking)

Toast above is just one example to read first - there are 17 `*.test.stories.tsx` files across the
package (DatePicker, Dropdown, FileUpload, AutoComplete, TimePicker, Table, Popover, Carousel,
TabNav, Menu, Drawer, Tooltip, PhoneNumberInput, SideNav, CitedFieldRow, BaseMotion, Toast). This
is deliberate, not incidental: every one of them involves something jsdom + RTL genuinely can't
verify - real floating-ui positioning, actual CSS animation/transition timing, or drag gestures -
unlike most components (Modal, Accordion, Checkbox, Tabs, ...), which get thorough coverage from
jsdom unit tests alone and don't need a real browser. Reach for an interaction test only when a
jsdom limitation like the above actually applies, not as a default for every stateful component.

## Release Notes

If your PR ships something a non-engineer would want to know about - a new component, a real
user-visible bug fix, a meaningful process change - add an entry to the **Release Notes**, not just
a changeset. This is a separate, human-facing page (plain language, no jargon, styled after
[PrimeReact's changelog](https://primereact.dev/changelog)), distinct from `CHANGELOG.md`'s
technical version log:

- Edit `packages/klear360/RELEASE_NOTES.md` **and** `packages/klear360/docs/guides/ReleaseNotes.mdx`
  together (they're intentionally duplicated - one for plain git/GitHub viewing, one for Storybook's
  "Guides → Release Notes" page) - add your entry at the top of both.
- Heading is the version only - no date, no day of week.
- Group bullets under simple section labels - `**Added**`, `**Fixed**`, `**Improved**`, `**Checked**`
  - using only the ones that apply. One short, plain sentence per bullet: name the component or
  screen, not the function or prop, and say what changed for someone using it. See the file's own
  entries for the exact tone - simple enough that a junior designer understands every line.
- Bump the version at the top of both files (`vX.Y.Z` → next patch, or a minor bump with a short
  title if this caps off a bigger chunk of work).

A pure internal refactor or a one-off audit doc with no visible effect usually doesn't need its own
entry unless it's part of a larger themed batch worth calling out together.

## Performance & Profiling

### Runtime profiling

When you suspect a component re-renders more than it should, or want to verify a fix actually
helped, profile it with React DevTools rather than guessing:

1. Install the [React Developer Tools](https://react.dev/learn/react-developer-tools) browser
   extension and open its **Profiler** tab against `yarn start:web` (or any app consuming
   `@klear/klear360`).
2. Click record, perform the interaction you're investigating (typing in a filter, scrolling a
   virtualized `Table`, opening a `Dropdown`), then stop recording.
3. Look for components that re-rendered without their props/state actually changing - the
   Profiler's "why did this render" view (flame graph + the commit's highlighted components)
   points at these directly. That's the signal to reach for `React.memo`, `useMemo`, or
   `useCallback` - not render count alone, since a component that renders often but cheaply
   usually isn't worth optimizing, and one of these wrappers has its own (small but nonzero) cost.
4. For a component with no interactive repro (e.g. verifying a large list doesn't re-render on an
   unrelated context update), wrap it in [`<Profiler>`](https://react.dev/reference/react/Profiler)
   temporarily and log `actualDuration`/`baseDuration` from its `onRender` callback.

Record what you found and why a fix was or wasn't needed in the component's own
`_decisions/decisions.md` (see any component's `_decisions/` folder for the format), the same way
other non-obvious decisions are tracked - a render-count number without that context won't mean
anything to the next person who re-measures it after unrelated changes.

### Bundle size

`yarn generate-bundle-size-info` (from `packages/klear360`, after `yarn pregenerate-bundle-size-info`
to build first) reports each component's individual production bundle size
(`scripts/generateBundleSizeInfo.js`), and `node scripts/generateBundleDiff.js` compares the
current PR's stats (`prBundleSizeStats.json`) against a baseline fetched from the
`bundle-size-stats` branch. This now runs automatically in CI (the `Bundle Size` job comments the
diff on every PR, and `Update Bundle Size Baseline` refreshes the baseline on `main`) - you only
need to run it manually for a quicker local check before pushing.

### Tree-shaking

`@klear/klear360`'s `sideEffects` field (`package.json`) tells bundlers it's safe to drop an
unused component's import entirely rather than keep it around in case it has side effects. Verified
this actually works end-to-end with a real bundler (`esbuild`, bundling against the built package
output, not just source): importing a single component (`Button`) produces a 320KB bundle, versus
7.5MB importing the full `components` barrel (`import * as AllComponents`) - esbuild's own output
explicitly lists every excluded component's import as "marked as having no side effects". If you
ever see a suspiciously large bundle for a single-component import, suspect a missing/incorrect
`sideEffects` entry or a new file extension that needs adding to it, not a bundler misconfiguration.

## Editor Setup

- Make sure you have [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) installed and setup on your VSCode. This will guide you and autofix errors to keep the code consistent with this project's guidelines
- Make sure you have [VSCode MDX](https://marketplace.visualstudio.com/items?itemName=JounQin.vscode-mdx) installed on your VSCode. This will help you with linting the markdown files if you're modifying or adding any `mdx` files for documentation purpose.
  - After installing this plugin navigate to your settings and add `mdx` extension to your `eslint` config. Below is how your settings will look after configuring `mdx` to work with eslint
  ```json
  // .vscode/settings.json
  {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "eslint.options": {
      "extensions": [".js", ".jsx", ".md", ".mdx", ".ts", ".tsx"]
    },
    "eslint.validate": [
      "markdown",
      "mdx",
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact"
    ]
  }
  ```

## Troubleshooting guidelines

- VSCode auto imports can sometimes mess things up due to import aliases and `.web` / `.native` extensions. If something is breaking weirdly after adding / importing a new module this might be related
- Ensure you're not using any `.web`, `.native` files directly in respective imports in `.web` / `.native` modules. For example, if you end up importing a `.web` module accidentally in a `.native` module, you might see a blank component being rendered or module not found error
- If you forget to import types inside a `.d.ts` file, sometimes TS won't complain and it can throw the typecheck logic in other modules off

- `Klear360 requires "FRAMEWORK" environment variable to be set. Valid values are "REACT" and "REACT_NATIVE". Instead, received: undefined`

  **Issue:** This is an issue that happens mostly if you run `yarn android` directly. For some reason `FRAMEWORK` doesn't gets passed to React Native application

  **Fix:** If you come across this issue then you first run `yarn start` and then run `yarn android`.
