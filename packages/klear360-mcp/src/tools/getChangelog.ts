import { readFileSync } from 'fs';
import { join } from 'path';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import dedent from 'dedent';
import { z } from 'zod';
import { handleError } from '../utils/errorUtils.js';
import {
  getLatestVersion,
  getRangeChangelogs,
  stringifyChangelog,
} from '../utils/changelogParser.js';
import { PROJECT_ROOT_DIRECTORY } from '../utils/tokens.js';

const getChangelogToolName = 'get_klear360_changelog';

const getChangelogToolDescription = `
Get the changelog of klear360 to help consumer with klear360 upgrades and checking release notes. Either for a specific version or a range of two versions,

Intent examples:
- help me with upgrades -> read \`package.json\` to get consumer's klear360 version to use it as \`fromVersion\` and then use \`toVersion\` as \`latest\` version (range)
- what was changed in x.x.x version? -> Just \`fromVersion\` (set isRange to false & omit toVersion)
- what was changed between x.x.x and y.y.y versions? -> \`fromVersion\` and \`toVersion\` (set isRange to true)
- what is the latest version of klear360? -> \`fromVersion\` as \`latest\` (set isRange to false & omit toVersion)

You will provide high level summary of notable changes in this output format:

\`\`\`
# Key Changes to Watch Out For:
- **XYZ component changed (v12.0.0):** description of the change and how it impacts the consumer
# Visual Changes:
- **XYZ component** was updated to use new design tokens (v12.0.0)
# New Components:
- **XYZ** - Component was added (v12.0.0)
# Enhancements:
- **XYZ** now supports new prop (v12.0.0)
# Bug Fixes:
- **XYZ** now fixes a bug (v12.0.0)
# Breaking Changes:
- **XYZ** component was removed (v12.0.0)
\`\`\`

When you mention a Klear360 version such as \`(v12.0.0)\`, keep it as a version tag. Do not invent external release URLs.
`;

const getChangelogToolSchema = {
  fromVersion: z
    .string()
    .describe('The start version of the range to get the changelog for. E.g. 10.15.0'),
  toVersion: z
    .string()
    .optional()
    .describe('The end version of the range to get the changelog for. E.g. 10.16.0'),
  isRange: z
    .boolean()
    .optional()
    .describe(
      'Whether to get the changelog for a range of versions or a specific version, this is based on intent of user.',
    ),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const getChangelogToolCallback: ToolCallback<typeof getChangelogToolSchema> = async ({
  fromVersion,
  toVersion,
  isRange,
  currentProjectRootDirectory: _currentProjectRootDirectory,
}) => {
  try {
    const changelogPath = join(PROJECT_ROOT_DIRECTORY, '..', 'klear360', 'CHANGELOG.md');
    const changelogText = readFileSync(changelogPath, 'utf8');

    const isToVersionLatest = toVersion === 'latest';
    if (isToVersionLatest) {
      const latestVersion = getLatestVersion(changelogText);
      toVersion = latestVersion?.version ?? '';
    }
    const isFromVersionLatest = fromVersion === 'latest';
    if (isFromVersionLatest) {
      const latestVersion = getLatestVersion(changelogText);
      fromVersion = latestVersion?.version ?? fromVersion;
    }

    const parsedChangelog = getRangeChangelogs(changelogText, fromVersion, toVersion);
    const stringifiedChangelog = stringifyChangelog(parsedChangelog);

    if (parsedChangelog === undefined) {
      return handleError({
        toolName: getChangelogToolName,
        mcpErrorMessage: `Failed to read changelog.`,
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: dedent`
            ## Changelog for: ${
              isRange ? `range from ${fromVersion} to ${toVersion}` : `version ${fromVersion}`
            }

            \`\`\`
            ${stringifiedChangelog}
            \`\`\`
          `,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getChangelogToolName,
      mcpErrorMessage: `Failed to read changelog, ${error}`,
    });
  }
};

export {
  getChangelogToolCallback,
  getChangelogToolName,
  getChangelogToolDescription,
  getChangelogToolSchema,
};
