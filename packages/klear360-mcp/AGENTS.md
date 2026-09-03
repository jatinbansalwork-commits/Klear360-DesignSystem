# klear360-mcp — Agent Context

MCP (Model Context Protocol) server for the Klear360 Design System. Exposes Klear360 docs to AI agents via MCP tools along with other tools such as figma-to-code, create-new-klear360-project, etc.

## Package Structure

```
knowledgebase/       # Component, Pattern and General Documentation of Klear360. This is where most changes happen.
src/
  tools/      # MCP tool definitions
  utils/      # Shared utilities
  server.ts   # MCP server entry point
```

## Quick Commands

> **Note:** Run these commands from the `packages/klear360-mcp` directory.

| Task             | Command                                    |
| ---------------- | ------------------------------------------ |
| Build            | `yarn build`                               |
| Dev (watch)      | `yarn dev`                                 |
| Inspect MCP      | `yarn inspect`                             |
| Start server     | `yarn start` (requires build to run first) |
| Type check       | `yarn typecheck`                           |
| Run tests        | `yarn test`                                |
| Update snapshots | `yarn test:updateSnapshots`                |
