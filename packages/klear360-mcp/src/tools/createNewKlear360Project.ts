import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';

import { handleError } from '../utils/errorUtils.js';
import { getKlear360ComponentDocsToolName } from './getKlear360ComponentDocs.js';

const createNewKlear360ProjectToolName = 'create_new_klear360_project';

const createNewKlear360ProjectToolDescription =
  'Create a new project using klear360. Uses vite, react, and typescript for setup. Call this tool ONLY when you are creating a new project from scratch.';

const createNewKlear360ProjectToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const createNewKlear360ProjectToolCallback: ToolCallback<
  typeof createNewKlear360ProjectToolSchema
> = ({ currentProjectRootDirectory: _currentProjectRootDirectory }) => {
  try {
    return {
      content: [
        {
          type: 'text',
          text: `## AI should run the following commands to create a new Klear360 project:

            ## Prerequisites:
            - The working directory must be is empty. Run \`[ "$(ls -A)" ] && echo "not empty" || echo "empty"\` to check if the directory is empty. If it's not empty do not continue with the steps below.

            ## Steps:
            1. Create the project using degit: \`npx degit klear/klear360/packages/klear360-mcp/base-klear360-template\`
            2. Run \`npm install --legacy-peer-deps && npm install @klear/klear360@latest --legacy-peer-deps\` to install the latest klear360.
            3. Always start the development server using \`npm run dev\` (if its not already running) before starting to code. Do not start it again after writing code.
            4. Start coding in App.tsx. Use \`${getKlear360ComponentDocsToolName}\` to get information about the components.
          `,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createNewKlear360ProjectToolName,
      errorObject: error,
    });
  }
};

export {
  createNewKlear360ProjectToolName,
  createNewKlear360ProjectToolDescription,
  createNewKlear360ProjectToolSchema,
  createNewKlear360ProjectToolCallback,
};
