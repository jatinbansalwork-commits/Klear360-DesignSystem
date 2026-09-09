import { z } from 'zod';
import { getKlear360DocsList } from '../utils/generalUtils.js';
import { handleError } from '../utils/errorUtils.js';
import { getKlear360DocsResponseText } from '../utils/getKlear360DocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import {
  commonKlear360MCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

const klear360ComponentsList = getKlear360DocsList('components');
const klear360ComponentsListString = klear360ComponentsList.join(', ');

const getKlear360ComponentDocsToolName = 'get_klear360_component_docs';
const getKlear360ComponentDocsToolDescription = `Fetch the Klear360 Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`;

// Schema for stdio transport
const getKlear360ComponentDocsStdioSchema = {
  componentsList: z
    .string()
    .describe(
      `Comma separated list of semantic klear360 component names. E.g. "Button, Accordion". Make sure to use the semantic components (like PasswordInput for passwords). Possible values: ${klear360ComponentsListString}`,
    ),
  ...commonKlear360MCPToolSchema,
};

// Schema for HTTP transport
const getKlear360ComponentDocsHttpSchema = {
  ...getKlear360ComponentDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

/**
 * @param {Object} params
 * @param {string} params.componentsList
 * @param {string} [params.currentProjectRootDirectory]
 * @param {boolean} [params.skipLocalSkillChecks]
 * @param {string} [params.skillVersion]
 * @param {'claude' | 'cursor' | 'unknown'} params.clientName
 * @returns {import('../utils/types.js').McpToolResponse}
 */
const getKlear360ComponentDocsCore = ({
  componentsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName: _clientName,
}) => {
  const components = componentsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !klear360ComponentsList.includes(comp));
  const invalidComponentsString = invalidComponents.join(', ');
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getKlear360ComponentDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponentsString}. Valid component docs values: ${klear360ComponentsListString}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getKlear360ComponentDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getKlear360DocsResponseText({
      docsList: componentsList,
      documentationType: 'components',
    });

    // Return the formatted response

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
      toolName: getKlear360ComponentDocsToolName,
      errorObject: error,
    });
  }
};

/** @type {import('@modelcontextprotocol/sdk/server/mcp.js').ToolCallback<typeof getKlear360ComponentDocsStdioSchema>} */
const getKlear360ComponentDocsStdioCallback = ({
  componentsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getKlear360ComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

/** @type {import('@modelcontextprotocol/sdk/server/mcp.js').ToolCallback<typeof getKlear360ComponentDocsHttpSchema>} */
const getKlear360ComponentDocsHttpCallback = ({
  componentsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getKlear360ComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

// Export all at once
export {
  getKlear360ComponentDocsToolName,
  getKlear360ComponentDocsToolDescription,
  getKlear360ComponentDocsHttpCallback,
  getKlear360ComponentDocsStdioCallback,
  getKlear360ComponentDocsStdioSchema,
  getKlear360ComponentDocsHttpSchema,
};
