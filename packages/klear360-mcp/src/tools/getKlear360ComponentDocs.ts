import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getKlear360DocsList } from '../utils/generalUtils.js';
import { handleError } from '../utils/errorUtils.js';
import { getKlear360DocsResponseText } from '../utils/getKlear360DocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
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

// Core business logic function
const getKlear360ComponentDocsCore = ({
  componentsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName: _clientName,
}: {
  componentsList: string;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
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
  } catch (error: unknown) {
    return handleError({
      toolName: getKlear360ComponentDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getKlear360ComponentDocsStdioCallback: ToolCallback<
  typeof getKlear360ComponentDocsStdioSchema
> = ({ componentsList, currentProjectRootDirectory, clientName }) => {
  return getKlear360ComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getKlear360ComponentDocsHttpCallback: ToolCallback<
  typeof getKlear360ComponentDocsHttpSchema
> = ({ componentsList, skillVersion, clientName, currentProjectRootDirectory }) => {
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
