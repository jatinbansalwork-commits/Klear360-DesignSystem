import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import { GENERAL_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';
import {
  commonKlear360MCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

import { getKlear360DocsList } from '../utils/generalUtils.js';
import { handleError } from '../utils/errorUtils.js';
import { getKlear360DocsResponseText } from '../utils/getKlear360DocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';

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

/**
 * @param {Object} params
 * @param {string} params.topicsList
 * @param {string} [params.currentProjectRootDirectory]
 * @param {boolean} [params.skipLocalSkillChecks]
 * @param {string} [params.skillVersion]
 * @param {'claude' | 'cursor' | 'unknown'} params.clientName
 * @returns {import('../utils/types.js').McpToolResponse}
 */
const getKlear360GeneralDocsCore = ({
  topicsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName: _clientName,
}) => {
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
  } catch (error) {
    return handleError({
      toolName: getKlear360GeneralDocsToolName,
      errorObject: error,
    });
  }
};

/** @type {import('@modelcontextprotocol/sdk/server/mcp.js').ToolCallback<typeof getKlear360GeneralDocsStdioSchema>} */
const getKlear360GeneralDocsStdioCallback = ({
  topicsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getKlear360GeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

/** @type {import('@modelcontextprotocol/sdk/server/mcp.js').ToolCallback<typeof getKlear360GeneralDocsHttpSchema>} */
const getKlear360GeneralDocsHttpCallback = ({
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
