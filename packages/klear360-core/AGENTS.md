# klear360-core — Agent Context

Core utilities and shared functionality for the Klear360 Design System. Contains shared logic consumed by `@klear/klear360` and other Klear360 packages.

Important: This package is only used in `@klear/klear360-svelte` package right now and not in `@klear/klear360` package.

## Package Structure

```
src/   # Core utilities and shared code
  tokens/   # Core theme tokens of klear360
  styles/   # Shared styles
  utils/    # Shared utilities
  types/    # Shared types
  index.ts  # Entry point
```

## Quick Commands

> **Note:** Run these commands from the `packages/klear360-core` directory.

| Task          | Command            |
| ------------- | ------------------ |
| Build         | `yarn build`       |
| Build (watch) | `yarn build:watch` |
| Type check    | `yarn typecheck`   |
| Run tests     | `yarn test`        |
