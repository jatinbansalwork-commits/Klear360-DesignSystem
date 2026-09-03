# Klear360

Klear360 is the design system that powers Klear products.

It ships cross-platform UI components for React (web) and React Native, a theming
and token engine, an MCP server for AI-assisted development, and a set of
Figma plugins that connect design and code.

> Internal repository. Not published to any public registry.

## 📦 Monorepo Structure

### Components & core

| Package                                                | Description                                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [klear360](./packages/klear360/)                       | Cross-platform UI component library for React Web and React Native                              |
| [klear360-core](./packages/klear360-core/)             | Theming and primitive engine: design tokens, theme creation, CSS variable generation            |

### Cross-platform tooling

| Package                                                  | Description                                                        |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| [eslint-plugin-klear360](./packages/eslint-plugin-klear360/) | Enforces the `.web`/`.native` import boundary across platform files |

### AI tooling

| Package                                    | Description                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [klear360-mcp](./packages/klear360-mcp/)   | Model Context Protocol server exposing component, pattern and general docs to AI agents  |

### Design-to-dev bridge

| Package                                                                              | Description                                                                     |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [klearcanvas](./packages/klearcanvas/)                                               | Figma-to-code engine that turns design nodes into Klear360 component code       |
| [plugin-figma-token-publisher](./packages/plugin-figma-token-publisher/)             | Figma plugin for publishing design tokens                                       |
| [plugin-figma-klear360-coverage](./packages/plugin-figma-klear360-coverage/)         | Figma plugin that measures Klear360 component coverage in design files          |
| [klear360-coverage-extension](./packages/klear360-coverage-extension/)               | Browser extension for measuring Klear360 component usage                        |
| [plugin-klear360-table-creator](./packages/plugin-klear360-table-creator/)           | Figma plugin for generating Klear360 tables                                     |
| [plugin-figma-pattern-creator](./packages/plugin-figma-pattern-creator/)             | Figma plugin for generating Klear360 layout patterns                            |
| [widget-figma-dev-handoff-checklist](./packages/widget-figma-dev-handoff-checklist/) | Figma widget for design-to-development handoff checklists                       |

## 🚀 Getting started

```bash
yarn install
yarn build
```

Run the component workshop:

```bash
yarn workspace @klear/klear360 start
```

## ✨ Features

- Cross-platform: one component API for React Web and React Native
- Themeable: token-driven light and dark themes, with white-labelling support
- Accessible: components are built and tested against WCAG guidance
- Documented: [RFCs](./rfcs) and per-component API decision records

## 📚 Documentation

Component, pattern and general documentation lives in
[`packages/klear360-mcp/knowledgebase`](./packages/klear360-mcp/knowledgebase/) and is
served to AI agents by the Klear360 MCP server.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
