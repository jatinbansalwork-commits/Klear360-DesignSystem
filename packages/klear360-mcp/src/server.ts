#!/usr/bin/env node

import { createServer } from './createServer.js';
import { createStdioTransport } from './createTransport.js';

try {
  const server = createServer({ transportType: 'stdio' });
  const transport = createStdioTransport();
  await server.connect(transport);
  // Why console.error? Checkout https://modelcontextprotocol.io/quickstart/server#logging-in-mcp-servers-2
  console.error('Klear360 MCP connected successfully.');
} catch (error: unknown) {
  console.error('Klear360 MCP Error', error);
  process.exit(1);
}
