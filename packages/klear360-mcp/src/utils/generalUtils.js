import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { SKILL_VERSION_STRING, KNOWLEDGEBASE_DIRECTORY, PROJECT_ROOT_DIRECTORY } from './tokens.js';

/**
 * @param {string} skillFilePath
 * @returns {boolean}
 */
const hasOutdatedSkill = (skillFilePath) => {
  const skillFileContent = readFileSync(skillFilePath, 'utf8');
  return !skillFileContent.includes(SKILL_VERSION_STRING);
};

/**
 * @returns {string}
 */
const getPackageJSONVersion = () => {
  const packageJson = JSON.parse(
    readFileSync(join(PROJECT_ROOT_DIRECTORY, 'package.json'), 'utf8'),
  );
  return packageJson.version;
};

/**
 * @typedef {'components' | 'patterns' | 'general'} DocumentationType
 */

/**
 * Reads the given documentation type directory and returns a list of available klear360 docs
 * @param {DocumentationType} documentationType
 * @returns {string[]}
 */
const getKlear360DocsList = (documentationType) => {
  /** @type {string[]} */
  const klear360DocsList = [];
  try {
    // Read all markdown files and strip the .md extension
    const files = readdirSync(join(KNOWLEDGEBASE_DIRECTORY, documentationType));
    for (const file of files) {
      if (file.endsWith('.md') && !file.includes('index.md')) {
        klear360DocsList.push(file.replace('.md', '').trim());
      }
    }
  } catch (error) {
    console.error('Error reading knowledgebase directory:', error);
    return [];
  }

  return klear360DocsList;
};

export { hasOutdatedSkill, getPackageJSONVersion, getKlear360DocsList };
