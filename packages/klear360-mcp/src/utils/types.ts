/**
 * Common return type for MCP tool responses
 * Used by various Klear360 MCP tools to return standardized responses
 */
export type McpToolResponse = {
  isError?: true;
  content: Array<{ type: 'text'; text: string }>;
};
