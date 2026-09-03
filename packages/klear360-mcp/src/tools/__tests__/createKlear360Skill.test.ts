import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createKlear360SkillHttpCallback,
  createKlear360SkillStdioCallback,
} from '../createKlear360Skill.js';
import * as skillUtils from '../../utils/skillUtils.js';
import { SKILL_VERSION_STRING } from '../../utils/tokens.js';

vi.mock('../../utils/skillUtils.js');

const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('createKlear360Skill HTTP callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return skill creation instructions', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockInstructions = 'Mock instructions for creating klear360 skill';

    vi.spyOn(skillUtils, 'skillCreationInstructions').mockReturnValue(mockInstructions);

    const result = createKlear360SkillHttpCallback(
      { currentProjectRootDirectory: mockCurrentProjectRootDirectory },
      createMockContext(),
    );

    expect(result).toMatchObject({
      content: [{ type: 'text', text: mockInstructions }],
    });
    expect(skillUtils.skillCreationInstructions).toHaveBeenCalledWith({
      currentProjectRootDirectory: mockCurrentProjectRootDirectory,
    });
  });
});

describe('createKlear360Skill stdio callback', () => {
  let tmpDir: string;

  beforeEach(() => {
    vi.clearAllMocks();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'klear360-skill-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('should create skill file and symlink in the correct locations', () => {
    const result = createKlear360SkillStdioCallback(
      { currentProjectRootDirectory: tmpDir },
      createMockContext(),
    );

    const skillFilePath = path.join(tmpDir, '.agents/skills/ui-code-guidelines/SKILL.md');
    const symlinkPath = path.join(tmpDir, '.claude/skills/ui-code-guidelines');

    expect(result).toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('Klear360 skill created') }],
    });
    expect(fs.existsSync(skillFilePath)).toBe(true);
    expect(fs.existsSync(symlinkPath)).toBe(true);
  });

  it('should write template content that passes the version check (regression: quote mismatch)', () => {
    createKlear360SkillStdioCallback({ currentProjectRootDirectory: tmpDir }, createMockContext());

    const skillFilePath = path.join(tmpDir, '.agents/skills/ui-code-guidelines/SKILL.md');
    const writtenContent = fs.readFileSync(skillFilePath, 'utf8');

    // If this fails, the template and SKILL_VERSION_STRING are out of sync
    expect(writtenContent).toContain(SKILL_VERSION_STRING);
  });

  it('should return "already up to date" if skill file is current', () => {
    // Create it once
    createKlear360SkillStdioCallback({ currentProjectRootDirectory: tmpDir }, createMockContext());
    // Try again
    const result = createKlear360SkillStdioCallback(
      { currentProjectRootDirectory: tmpDir },
      createMockContext(),
    );

    expect(result).toMatchObject({
      content: [{ type: 'text', text: expect.stringContaining('up to date') }],
    });
  });
});
