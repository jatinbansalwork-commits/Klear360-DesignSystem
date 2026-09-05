import { join } from 'path';
import {
  existsSync,
  symlinkSync,
  unlinkSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from 'fs';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  KLEAR360_SKILL_FILE_PATH,
  SKILL_VERSION,
  SKILL_DIRECTORY_NAME,
  SKILL_REFERENCES_DIRECTORY,
} from '../utils/tokens.js';

import { hasOutdatedSkill } from '../utils/generalUtils.js';
import { handleError } from '../utils/errorUtils.js';
// eslint-disable-next-line import/no-cycle
import { skillCreationInstructions } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';

const createKlear360SkillToolName = 'create_klear360_skill';

const createKlear360SkillToolDescription =
  'Creates the UI code guidelines skill for AI-assisted frontend code generation with Klear360. Scaffolds the skill in .agents/skills/ui-code-guidelines and creates a symlink in .claude/skills for Claude Code support.';

const createKlear360SkillToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

// Core business logic function
const createKlear360SkillCore = ({
  currentProjectRootDirectory,
  isHttpTransport = false,
}: {
  currentProjectRootDirectory: string;
  isHttpTransport?: boolean;
}): McpToolResponse => {
  try {
    // For HTTP transport, return instructions instead of creating the file directly
    if (isHttpTransport) {
      return {
        content: [
          {
            type: 'text',
            text: skillCreationInstructions({ currentProjectRootDirectory }),
          },
        ],
      };
    }

    const skillDir = join(currentProjectRootDirectory, '.agents/skills', SKILL_DIRECTORY_NAME);
    const skillFilePath = join(skillDir, 'SKILL.md');

    if (existsSync(skillFilePath)) {
      if (hasOutdatedSkill(skillFilePath)) {
        // removes the outdated skill file and continues execution to generate new skill file
        unlinkSync(skillFilePath);
      } else {
        return {
          content: [
            {
              type: 'text',
              text: 'Klear360 skill already exists and is up to date. Doing nothing',
            },
          ],
        };
      }
    }

    const skillFileTemplateContent = readFileSync(KLEAR360_SKILL_FILE_PATH, 'utf8');

    if (!existsSync(skillDir)) {
      mkdirSync(skillDir, { recursive: true });
    }

    writeFileSync(skillFilePath, skillFileTemplateContent);

    // Copy reference files
    const refsSourceDir = SKILL_REFERENCES_DIRECTORY;
    const refsDestDir = join(skillDir, 'references');
    if (existsSync(refsSourceDir)) {
      if (!existsSync(refsDestDir)) {
        mkdirSync(refsDestDir, { recursive: true });
      }
      const refFiles = readdirSync(refsSourceDir);
      for (const refFile of refFiles) {
        const refContent = readFileSync(join(refsSourceDir, refFile), 'utf8');
        writeFileSync(join(refsDestDir, refFile), refContent);
      }
    }

    // Create symlink for Claude Code support
    const claudeSkillsDir = join(currentProjectRootDirectory, '.claude/skills');
    const symlinkPath = join(claudeSkillsDir, SKILL_DIRECTORY_NAME);

    if (!existsSync(claudeSkillsDir)) {
      mkdirSync(claudeSkillsDir, { recursive: true });
    }

    if (!existsSync(symlinkPath)) {
      // Relative symlink: .claude/skills/ui-code-guidelines -> ../../.agents/skills/ui-code-guidelines
      symlinkSync(join('..', '..', '.agents', 'skills', SKILL_DIRECTORY_NAME), symlinkPath);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Klear360 skill created at: ${skillFilePath}. Symlink created at: ${symlinkPath}. Skill Version: ${SKILL_VERSION}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createKlear360SkillToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const createKlear360SkillStdioCallback: ToolCallback<typeof createKlear360SkillToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  return createKlear360SkillCore({
    currentProjectRootDirectory,
    isHttpTransport: false,
  });
};

// Callback for HTTP transport
const createKlear360SkillHttpCallback: ToolCallback<typeof createKlear360SkillToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  return createKlear360SkillCore({
    currentProjectRootDirectory,
    isHttpTransport: true,
  });
};

export {
  createKlear360SkillToolName,
  createKlear360SkillToolDescription,
  createKlear360SkillToolSchema,
  createKlear360SkillStdioCallback,
  createKlear360SkillHttpCallback,
};
