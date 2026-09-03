import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getKlear360GeneralDocsHttpCallback } from '../getKlear360GeneralDocs.js';
import * as skillUtils from '../../utils/skillUtils.js';
import * as getKlear360DocsResponseText from '../../utils/getKlear360DocsResponseText.js';
import * as generalUtils from '../../utils/generalUtils.js';
import { SKILL_VERSION } from '../../utils/tokens.js';
vi.mock('../../utils/skillUtils.js');
vi.mock('../../utils/getKlear360DocsResponseText.js');
vi.mock('../../utils/generalUtils.js', () => ({
  getKlear360DocsList: vi.fn(() => [
    'AvailableIcons',
    'ChartColorSystem',
    'Usage',
    'WhiteLabelling',
  ]),
}));
vi.mock('fs', () => ({
  readFileSync: vi.fn(() => 'Mock guide content'),
  existsSync: vi.fn(() => false),
}));

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('getKlear360GeneralDocs Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    vi.spyOn(generalUtils, 'getKlear360DocsList').mockReturnValue([
      'AvailableIcons',
      'ChartColorSystem',
      'Usage',
      'WhiteLabelling',
    ]);
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);
  });

  it('should return general docs for valid topics', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockTopicsList = 'Usage, AvailableIcons';
    const mockResponseText = 'Mock general documentation';

    // Mock the getKlear360DocsResponseText function
    vi.spyOn(getKlear360DocsResponseText, 'getKlear360DocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Get the HTTP callback
    const httpCallback = getKlear360GeneralDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        topicsList: mockTopicsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Verify the result structure
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty('type', 'text');
      if ('text' in result.content[0]) {
        expect(result.content[0].text).toBe(mockResponseText.trim());
      }
    }

    // Verify getKlear360DocsResponseText was called with correct parameters
    expect(getKlear360DocsResponseText.getKlear360DocsResponseText).toHaveBeenCalledWith({
      docsList: mockTopicsList,
      documentationType: 'general',
    });
  });

  it('should return error for invalid topics', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockTopicsList = 'InvalidTopic, AnotherInvalid';

    // Get the HTTP callback
    const httpCallback = getKlear360GeneralDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        topicsList: mockTopicsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Verify the result is an error
    expect(result).toBeDefined();
    expect(result).toHaveProperty('isError', true);
    if ('isError' in result && result.isError) {
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: expect.any(String),
          },
        ],
      });
    }
  });

  it('should return consistent general docs response (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testTopicsList = 'Usage, AvailableIcons';

    // Unmock fs first so that getKlear360DocsResponseText can read real files
    vi.doUnmock('fs');

    // Get the actual implementations (not mocked) to test real output
    // Re-import getKlear360DocsResponseText after unmocking fs so it uses actual readFileSync
    vi.doUnmock('../../utils/getKlear360DocsResponseText.js');
    const actualGetKlear360DocsResponseText = await vi.importActual<
      typeof getKlear360DocsResponseText
    >('../../utils/getKlear360DocsResponseText.js');
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );
    vi.restoreAllMocks();

    if (actualGetKlear360DocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getKlear360DocsResponseText, 'getKlear360DocsResponseText').mockImplementation(
        actualGetKlear360DocsResponseText.getKlear360DocsResponseText,
      );
      vi.spyOn(generalUtils, 'getKlear360DocsList').mockImplementation(
        actualGeneralUtils.getKlear360DocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getKlear360GeneralDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        topicsList: testTopicsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });

  it('should return consistent general docs response for claude agent', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testTopicsList = 'Usage, AvailableIcons';

    // Unmock fs first so that getKlear360DocsResponseText can read real files
    vi.doUnmock('fs');

    // Get the actual implementations (not mocked) to test real output
    // Re-import getKlear360DocsResponseText after unmocking fs so it uses actual readFileSync
    vi.doUnmock('../../utils/getKlear360DocsResponseText.js');
    const actualGetKlear360DocsResponseText = await vi.importActual<
      typeof getKlear360DocsResponseText
    >('../../utils/getKlear360DocsResponseText.js');
    const actualGeneralUtils = await vi.importActual<typeof generalUtils>(
      '../../utils/generalUtils.js',
    );
    vi.restoreAllMocks();

    if (actualGetKlear360DocsResponseText && actualGeneralUtils) {
      // Temporarily replace the mocked functions with the actual ones
      vi.spyOn(getKlear360DocsResponseText, 'getKlear360DocsResponseText').mockImplementation(
        actualGetKlear360DocsResponseText.getKlear360DocsResponseText,
      );
      vi.spyOn(generalUtils, 'getKlear360DocsList').mockImplementation(
        actualGeneralUtils.getKlear360DocsList,
      );
    }

    // Mock skill as not needing update
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);

    // Get the HTTP callback
    const httpCallback = getKlear360GeneralDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        topicsList: testTopicsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'claude',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });
});
