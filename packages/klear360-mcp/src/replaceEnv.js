// scripts/replace-env.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the paths to the files to be replaced
const FIGMA_TO_CODE_JS_PATH = path.resolve(__dirname, '../dist/tools/getFigmaToCode.js');

// Load env variables from .env file (if exists) or use process.env
dotenv.config();

// Use environment variables with defaults
const NODE_ENV = process.env.NODE_ENV;

function replaceInFileSync(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    for (const { from, to } of replacements) {
      content = content.replace(from, to);
    }

    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    throw error;
  }
}

async function replaceEnvironmentVariables() {
  try {
    // Replace NODE_ENV in figma-to-code.js
    replaceInFileSync(FIGMA_TO_CODE_JS_PATH, [
      {
        from: /process\.env\.NODE_ENV/g,
        to: `'${NODE_ENV}'`,
      },
    ]);

    console.log('Environment variables replaced successfully');
  } catch (error) {
    console.error('Error during environment variables replacement:', error);
    process.exit(1);
  }
}

replaceEnvironmentVariables();
