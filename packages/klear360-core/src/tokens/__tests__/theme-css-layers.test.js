import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themeCssPath = path.resolve(__dirname, '../theme.css');

describe('theme.css cascade layers', () => {
  const themeCss = fs.readFileSync(themeCssPath, 'utf8');

  it('declares @layer klear360 before utilities', () => {
    const layerDeclarationIndex = themeCss.indexOf('@layer klear360;');
    const utilitySectionIndex = themeCss.indexOf('/* ===== UTILITY CLASSES ===== */');

    expect(layerDeclarationIndex).toBeGreaterThan(-1);
    expect(utilitySectionIndex).toBeGreaterThan(layerDeclarationIndex);
  });

  it('wraps utility classes in @layer klear360 so Tailwind utilities win', () => {
    const utilityBlockStart = themeCss.indexOf(
      '@layer klear360 {\n/* ===== UTILITY CLASSES ===== */',
    );
    const utilityBlockEnd = themeCss.lastIndexOf('\n}\n');

    expect(utilityBlockStart).toBeGreaterThan(-1);
    expect(utilityBlockEnd).toBeGreaterThan(utilityBlockStart);
    expect(themeCss.slice(utilityBlockStart, utilityBlockEnd)).toContain('.items-center');
    expect(themeCss.slice(utilityBlockStart, utilityBlockEnd)).toContain('.flex-row');
  });

  it('keeps CSS variables unlayered for global token availability', () => {
    const rootBlockEnd = themeCss.indexOf('@layer klear360 {\n/* ===== UTILITY CLASSES ===== */');
    const tokenSection = themeCss.slice(0, rootBlockEnd);

    expect(tokenSection).toContain(':root {');
    expect(tokenSection).toContain('--spacing-3:');
    expect(tokenSection).not.toMatch(/@layer klear360\s*\{[^}]*--spacing-3/);
  });
});
