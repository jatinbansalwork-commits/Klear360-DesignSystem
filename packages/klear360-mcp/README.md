# Klear360 MCP

[![npm version](https://img.shields.io/npm/v/@klear/klear360-mcp.svg)](https://www.npmjs.com/package/@klear/klear360-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

Klear360 MCP is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that implements Klear's Design Guidelines and allows you to build Web Interfaces using Klear360 Design System.

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](<https://cursor.com/en-US/install-mcp?name=Klear360%20MCP%20(Stdio)&config=eyJjb21tYW5kIjoibnB4IC15IEByYXpvcnBheS9ibGFkZS1tY3BAbGF0ZXN0In0%3D>)

## Available Tools

| Tool Name                   | Description                                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hi_klear360`                  | Provides a welcome message and overview of Klear360 MCP capabilities when user greets with "hi klear360", "hey klear360", etc.                                                                                                                      |
| `create_new_klear360_project`  | Creates a new project using Klear360 with Vite, React, and TypeScript setup. Should only be called when creating a new project from scratch.                                                                                                  |
| `create_klear360_cursor_rules` | Creates the cursor rules for Klear360 to help with code generation. Should be called before getting component docs and when the rule file doesn't exist.                                                                                      |
| `get_klear360_component_docs`  | Fetches the Klear360 Design System documentation for specific components. Useful when adding or modifying components in your project.                                                                                                         |
| `get_klear360_pattern_docs`    | Fetches the Klear360 Design System pattern documentation. Use this to get information about design patterns, best practices, and implementation guidelines.                                                                                   |
| `get_klear360_general_docs`    | Fetches general Klear360 Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.                                                                                         |
| `get_figma_to_code`         | Converts Figma designs into Klear360 Design System code. Provide a Figma design URL to generate the corresponding React components using Klear360's component library. **[NOTE: figma to code tool can only be accessed by Klear employees]** |

## Prerequisites

- Node.js 18.x or higher ([install using NVM](https://nodejs.org/en/download))

## Installation

### Cursor or VS Code

Create or update your `mcp.json` file with:

```json
{
  "mcpServers": {
    "klear360-mcp": {
      "command": "npx",
      "args": ["-y", "@klear/klear360-mcp@latest"]
    }
  }
}
```

### Claude Desktop

Add the following to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "klear360-mcp": {
      "command": "npx",
      "args": ["-y", "@klear/klear360-mcp@latest"]
    }
  }
}
```

> [!NOTE]
>
> - Learn about how to configure MCP servers in [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
> - If you're using `nvm`, you might want to [follow these steps](https://github.com/modelcontextprotocol/servers/issues/64) instead of `npx`
> - Learn how to install [Claude Desktop](https://claude.ai/download)

## Troubleshooting / Manually Updating the MCP Server

> [!NOTE]
>
> The MCP server would auto-update by default after few days if you have followed the steps above.

If your MCP server is failing to start or if you want to manually force update the MCP server to latest version, you can do so by following these steps:

- Step 1: Clear the npx cache

  Run following command in your terminal

  ```sh
  npx clear-npx-cache
  ```

- Step 2: Quit and Restart Cursor or Claude Instance

## How to use

- Follow [Integrations Guide](#integrations) to configure MCP servers in Cursor
- Open Cursor, Click "Open Project" and select an empty folder
- Press CMD + I (or CTRL + I) to open Cursor's chat
- Type "Hi klear360" and get started

```
Can you create a signup form with best UX practices using Klear360?
```

The AI agents will use the MCP server to retrieve components and generate appropriate code.

## Local Klear360 MCP Development Setup

### Clone the repository

```bash
# Clone the repository
git clone https://github.com/jatinbansalwork-commits/Klearnow.ai.git
cd klear360

# Install dependencies
yarn

# Navigate to the MCP server package
cd packages/klear360-mcp

# Build the package
yarn build
```

### Local Klear360 MCP Development with Cursor

For local Klear360 MCP development with Cursor, update your `mcp.json` with the local path:

```json
{
  "klear360-mcp": {
    "command": "node",
    "args": ["<<USER_PATH>>/klear360/packages/klear360-mcp/dist/server.js"]
  }
}
```

Replace the `<<USER_PATH>>` with your actual local path to the repository.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT © Klear
