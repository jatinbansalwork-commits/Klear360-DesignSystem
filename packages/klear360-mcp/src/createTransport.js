import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

/** @returns {StdioServerTransport} */
export const createStdioTransport = () => {
  const transport = new StdioServerTransport();
  return transport;
};

/**
 * Creating streamable http transport for Klear360 MCP server.
 *
 * ```
 * import { createServer, createStreamableHttpTransport } from '@klear/klear360-mcp';
 *
 * const server = createServer();
 *
 * // somewhere in your nodejs server. Refer to https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#streamable-http
 * const transport = createStreamableHttpTransport();
 * server.connect(transport);
 * ```
 *
 * @param {import('@modelcontextprotocol/sdk/server/streamableHttp.js').StreamableHTTPServerTransportOptions} options
 * @returns {StreamableHTTPServerTransport}
 */
export const createStreamableHttpTransport = (options) => {
  const transport = new StreamableHTTPServerTransport(options);
  return transport;
};
