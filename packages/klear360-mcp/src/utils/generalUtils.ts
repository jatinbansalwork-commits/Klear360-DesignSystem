import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { SKILL_VERSION_STRING, KNOWLEDGEBASE_DIRECTORY, PROJECT_ROOT_DIRECTORY } from './tokens.js';

const hasOutdatedSkill = (skillFilePath: string): boolean => {
  const skillFileContent = readFileSync(skillFilePath, 'utf8');
  return !skillFileContent.includes(SKILL_VERSION_STRING);
};

const getPackageJSONVersion = (): string => {
  const packageJson = JSON.parse(
    readFileSync(join(PROJECT_ROOT_DIRECTORY, 'package.json'), 'utf8'),
  );
  return packageJson.version;
};

type DocumentationType = 'components' | 'patterns' | 'general';

/**
 * Reads the given documentation type directory and returns a list of available klear360 docs
 */
const getKlear360DocsList = (documentationType: DocumentationType): string[] => {
  const klear360DocsList: string[] = [];
  try {
    // Read all markdown files and strip the .md extension
    const files = readdirSync(join(KNOWLEDGEBASE_DIRECTORY, documentationType));
    for (const file of files) {
      if (file.endsWith('.md') && !file.includes('index.md')) {
        klear360DocsList.push(file.replace('.md', '').trim());
      }
    }
  } catch (error: unknown) {
    console.error('Error reading knowledgebase directory:', error);
    return [];
  }

  return klear360DocsList;
};

export { hasOutdatedSkill, getPackageJSONVersion, getKlear360DocsList };
export type { DocumentationType };
