import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GENERAL_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';
import {
  commonKlear360MCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

import { getKlear360DocsList } from '../utils/generalUtils.js';
import { handleError } from '../utils/errorUtils.js';
import { getKlear360DocsResponseText } from '../utils/getKlear360DocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';

const klear360GeneralDocsList = getKlear360DocsList('general');

const getKlear360GeneralDocsToolName = 'get_klear360_general_docs';

const whichGeneralDocsToUse = readFileSync(
  join(GENERAL_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getKlear360GeneralDocsToolDescription = `Fetch general Klear360 Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.`;

// Schema for stdio transport
const getKlear360GeneralDocsStdioSchema = {
  topicsList: z
    .string()
    .describe(
      `Comma separated list of general documentation topics. E.g. "Installation, Theming". Possible values: ${klear360GeneralDocsList.join(
        ', ',
      )}. Here is guide on how to decide which general docs you might need:\n ${whichGeneralDocsToUse}`,
    ),
  ...commonKlear360MCPToolSchema,
};

// Schema for HTTP transport
const getKlear360GeneralDocsHttpSchema = {
  ...getKlear360GeneralDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getKlear360GeneralDocsCore = ({
  topicsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName: _clientName,
}: {
  topicsList: string;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const topics = topicsList.split(',').map((s) => s.trim());
  const invalidTopics = topics.filter((topic) => !klear360GeneralDocsList.includes(topic));
  if (invalidTopics.length > 0) {
    return handleError({
      toolName: getKlear360GeneralDocsToolName,
      mcpErrorMessage: `Invalid argument topicsList. Invalid values: ${invalidTopics.join(
        ', ',
      )}. Valid general docs values: ${klear360GeneralDocsList.join(', ')}`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getKlear360GeneralDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getKlear360DocsResponseText({
      docsList: topicsList,
      documentationType: 'general',
    });

    return {
      content: [
        {
          type: 'text',
          text: responseText.trim(),
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getKlear360GeneralDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getKlear360GeneralDocsStdioCallback: ToolCallback<
  typeof getKlear360GeneralDocsStdioSchema
> = ({ topicsList, currentProjectRootDirectory, clientName }) => {
  return getKlear360GeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getKlear360GeneralDocsHttpCallback: ToolCallback<typeof getKlear360GeneralDocsHttpSchema> = ({
  topicsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getKlear360GeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

export {
  getKlear360GeneralDocsToolName,
  getKlear360GeneralDocsToolDescription,
  getKlear360GeneralDocsHttpCallback,
  getKlear360GeneralDocsStdioCallback,
  getKlear360GeneralDocsHttpSchema,
  getKlear360GeneralDocsStdioSchema,
};
