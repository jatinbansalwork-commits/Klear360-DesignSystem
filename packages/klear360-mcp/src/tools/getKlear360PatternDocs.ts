import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PATTERNS_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';

import { getKlear360DocsList } from '../utils/generalUtils.js';
import { handleError } from '../utils/errorUtils.js';
import { getKlear360DocsResponseText } from '../utils/getKlear360DocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import {
  commonKlear360MCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';
import { getKlear360ComponentDocsToolName } from './getKlear360ComponentDocs.js';

const klear360PatternsList = getKlear360DocsList('patterns');
const whichPatternToUseGuide = readFileSync(
  join(PATTERNS_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getKlear360PatternDocsToolName = 'get_klear360_pattern_docs';

const getKlear360PatternDocsToolDescription = `Fetch the Klear360 Design System pattern docs. Use this to get information about design patterns, best practices, and implementation guidelines.`;

// Schema for stdio transport
const getKlear360PatternDocsStdioSchema = {
  patternsList: z
    .string()
    .describe(
      `Comma separated list of klear360 pattern names. E.g. "ListView, DetailedView". Possible values: ${klear360PatternsList.join(
        ', ',
      )}. Here is guide on how to decide which pattern to use: ${whichPatternToUseGuide}`,
    ),
  ...commonKlear360MCPToolSchema,
};

// Schema for HTTP transport
const getKlear360PatternDocsHttpSchema = {
  ...getKlear360PatternDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getKlear360PatternDocsCore = ({
  patternsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion,
  clientName: _clientName,
}: {
  patternsList: string;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const components = patternsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !klear360PatternsList.includes(comp));
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getKlear360PatternDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponents.join(
        ', ',
      )}. Valid component docs values: ${klear360PatternsList.join(
        ', ',
      )}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getKlear360PatternDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getKlear360DocsResponseText({
      docsList: patternsList,
      documentationType: 'patterns',
    });

    // Return the formatted response

    return {
      content: [
        {
          type: 'text',
          text: `Below is the documentation for Patterns. After this, call ${getKlear360ComponentDocsToolName} to get documentation for components that are used in patterns.:\n ${responseText}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getKlear360PatternDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getKlear360PatternDocsStdioCallback: ToolCallback<
  typeof getKlear360PatternDocsStdioSchema
> = ({ patternsList, currentProjectRootDirectory, clientName }) => {
  return getKlear360PatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getKlear360PatternDocsHttpCallback: ToolCallback<typeof getKlear360PatternDocsHttpSchema> = ({
  patternsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getKlear360PatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

export {
  getKlear360PatternDocsToolName,
  getKlear360PatternDocsToolDescription,
  getKlear360PatternDocsStdioCallback,
  getKlear360PatternDocsHttpCallback,
  getKlear360PatternDocsStdioSchema,
  getKlear360PatternDocsHttpSchema,
};
