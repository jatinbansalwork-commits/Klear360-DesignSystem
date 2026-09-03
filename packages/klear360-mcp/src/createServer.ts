import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  createNewKlear360ProjectToolName,
  createNewKlear360ProjectToolDescription,
  createNewKlear360ProjectToolSchema,
  createNewKlear360ProjectToolCallback,
} from './tools/createNewKlear360Project.js';
import {
  createKlear360SkillToolName,
  createKlear360SkillToolDescription,
  createKlear360SkillToolSchema,
  createKlear360SkillStdioCallback,
  createKlear360SkillHttpCallback,
} from './tools/createKlear360Skill.js';
import {
  getKlear360ComponentDocsToolName,
  getKlear360ComponentDocsToolDescription,
  getKlear360ComponentDocsHttpSchema,
  getKlear360ComponentDocsStdioSchema,
  getKlear360ComponentDocsStdioCallback,
  getKlear360ComponentDocsHttpCallback,
} from './tools/getKlear360ComponentDocs.js';
import {
  hiKlear360ToolName,
  hiKlear360ToolDescription,
  hiKlear360ToolSchema,
  hiKlear360ToolCallback,
} from './tools/hiKlear360.js';
import { getPackageJSONVersion } from './utils/generalUtils.js';
import {
  getKlear360PatternDocsToolName,
  getKlear360PatternDocsToolDescription,
  getKlear360PatternDocsHttpSchema,
  getKlear360PatternDocsHttpCallback,
  getKlear360PatternDocsStdioSchema,
  getKlear360PatternDocsStdioCallback,
} from './tools/getKlear360PatternDocs.js';
import {
  getKlear360GeneralDocsToolName,
  getKlear360GeneralDocsToolDescription,
  getKlear360GeneralDocsHttpCallback,
  getKlear360GeneralDocsHttpSchema,
  getKlear360GeneralDocsStdioSchema,
  getKlear360GeneralDocsStdioCallback,
} from './tools/getKlear360GeneralDocs.js';
import {
  getFigmaToCodeToolName,
  getFigmaToCodeToolDescription,
  getFigmaToCodeToolSchema,
  getFigmaToCodeToolCallback,
} from './tools/getFigmaToCode.js';
import {
  getChangelogToolName,
  getChangelogToolDescription,
  getChangelogToolSchema,
  getChangelogToolCallback,
} from './tools/getChangelog.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpsServerTools = (server: McpServer): void => {
  server.tool(
    createKlear360SkillToolName,
    createKlear360SkillToolDescription,
    createKlear360SkillToolSchema,
    createKlear360SkillHttpCallback,
  );

  server.tool(
    getKlear360ComponentDocsToolName,
    getKlear360ComponentDocsToolDescription,
    getKlear360ComponentDocsHttpSchema,
    getKlear360ComponentDocsHttpCallback,
  );

  server.tool(
    getKlear360PatternDocsToolName,
    getKlear360PatternDocsToolDescription,
    getKlear360PatternDocsHttpSchema,
    getKlear360PatternDocsHttpCallback,
  );

  server.tool(
    getKlear360GeneralDocsToolName,
    getKlear360GeneralDocsToolDescription,
    getKlear360GeneralDocsHttpSchema,
    getKlear360GeneralDocsHttpCallback,
  );
};

const stdioServerTools = (server: McpServer): void => {
  server.tool(
    createKlear360SkillToolName,
    createKlear360SkillToolDescription,
    createKlear360SkillToolSchema,
    createKlear360SkillStdioCallback,
  );

  server.tool(
    getKlear360ComponentDocsToolName,
    getKlear360ComponentDocsToolDescription,
    getKlear360ComponentDocsStdioSchema,
    getKlear360ComponentDocsStdioCallback,
  );

  server.tool(
    getKlear360PatternDocsToolName,
    getKlear360PatternDocsToolDescription,
    getKlear360PatternDocsStdioSchema,
    getKlear360PatternDocsStdioCallback,
  );

  server.tool(
    getKlear360GeneralDocsToolName,
    getKlear360GeneralDocsToolDescription,
    getKlear360GeneralDocsStdioSchema,
    getKlear360GeneralDocsStdioCallback,
  );
};
export const createServer = ({
  transportType = 'stdio',
}: {
  transportType?: 'stdio' | 'http';
}): McpServer => {
  const server = new McpServer({
    name: 'Klear360 MCP',
    version: getPackageJSONVersion(),
  });

  if (transportType === 'http') {
    httpsServerTools(server);
  } else {
    stdioServerTools(server);
  }

  server.tool(
    hiKlear360ToolName,
    hiKlear360ToolDescription,
    hiKlear360ToolSchema,
    hiKlear360ToolCallback,
  );

  server.tool(
    createNewKlear360ProjectToolName,
    createNewKlear360ProjectToolDescription,
    createNewKlear360ProjectToolSchema,
    createNewKlear360ProjectToolCallback,
  );

  server.tool(
    getFigmaToCodeToolName,
    getFigmaToCodeToolDescription,
    getFigmaToCodeToolSchema,
    getFigmaToCodeToolCallback,
  );

  server.tool(
    getChangelogToolName,
    getChangelogToolDescription,
    getChangelogToolSchema,
    getChangelogToolCallback,
  );

  return server;
};
