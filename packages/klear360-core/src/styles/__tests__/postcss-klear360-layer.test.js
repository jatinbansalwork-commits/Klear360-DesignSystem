import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const postcssKlear360Layer = require(path.resolve(
  __dirname,
  '../../../postcss-klear360-layer.cjs',
));

describe('postcss-klear360-layer', () => {
  it('wraps klear360-core *.module.css output in @layer klear360', async () => {
    const inputPath = path.resolve(__dirname, '../Button/button.module.css');
    const input = fs.readFileSync(inputPath, 'utf8');

    const result = await postcss([postcssKlear360Layer]).process(input, { from: inputPath });

    expect(result.css).toMatch(/^@layer klear360\s*\{/);
    expect(result.css).toContain('border-radius: var(--border-radius-small)');
  });

  it('does not wrap non-module CSS', async () => {
    const inputPath = path.resolve(__dirname, '../layers.css');
    const input = fs.readFileSync(inputPath, 'utf8');

    const result = await postcss([postcssKlear360Layer]).process(input, { from: inputPath });

    expect(result.css.trim()).toBe(input.trim());
  });
});
