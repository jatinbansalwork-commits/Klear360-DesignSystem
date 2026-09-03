import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getKlear360ComponentDocsHttpCallback,
  getKlear360ComponentDocsStdioCallback,
} from '../getKlear360ComponentDocs.js';
import * as skillUtils from '../../utils/skillUtils.js';
import * as getKlear360DocsResponseText from '../../utils/getKlear360DocsResponseText.js';
import * as generalUtils from '../../utils/generalUtils.js';
import { SKILL_VERSION } from '../../utils/tokens.js';
vi.mock('../../utils/skillUtils.js');
vi.mock('../../utils/getKlear360DocsResponseText.js');
vi.mock('../../utils/generalUtils.js', () => ({
  getKlear360DocsList: vi.fn(() => ['Button', 'Accordion', 'Input']),
}));

// Create a mock context object for tool callbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockContext = (): any => ({
  signal: new AbortController().signal,
  requestId: 'test-request-id',
  sendNotification: vi.fn().mockResolvedValue(undefined),
  sendRequest: vi.fn().mockResolvedValue({}),
});

describe('getKlear360ComponentDocs Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    vi.spyOn(generalUtils, 'getKlear360DocsList').mockReturnValue(['Button', 'Accordion', 'Input']);
    vi.spyOn(skillUtils, 'shouldCreateOrUpdateSkill').mockReturnValue(undefined);
  });

  it('should return component docs for valid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'Button, Accordion';
    const mockResponseText = 'Mock component documentation';

    // Mock the getKlear360DocsResponseText function
    vi.spyOn(getKlear360DocsResponseText, 'getKlear360DocsResponseText').mockReturnValue(
      mockResponseText,
    );

    // Get the HTTP callback
    const httpCallback = getKlear360ComponentDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        componentsList: mockComponentsList,
        currentProjectRootDirectory: mockCurrentProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Verify the result structure
    expect(result).toHaveProperty('content');
    if ('content' in result && !('isError' in result)) {
      expect(result).toMatchObject({
        content: [
          {
            type: 'text',
            text: mockResponseText.trim(),
          },
        ],
      });
    }

    // Verify getKlear360DocsResponseText was called with correct parameters
    expect(getKlear360DocsResponseText.getKlear360DocsResponseText).toHaveBeenCalledWith({
      docsList: mockComponentsList,
      documentationType: 'components',
    });
  });

  it('should return error for invalid components', () => {
    const mockCurrentProjectRootDirectory = '/Users/test/project';
    const mockComponentsList = 'InvalidComponent, AnotherInvalid';

    // Get the HTTP callback
    const httpCallback = getKlear360ComponentDocsHttpCallback;

    // Call the tool callback
    const result = httpCallback(
      {
        componentsList: mockComponentsList,
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

  it('should return consistent component docs response (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
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
    const httpCallback = getKlear360ComponentDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        componentsList: testComponentsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });

  it('should return consistent component docs response for claude agent (snapshot)', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
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
    const httpCallback = getKlear360ComponentDocsHttpCallback;

    // Call the tool callback with actual implementation
    const result = httpCallback(
      {
        componentsList: testComponentsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'claude',
        skillVersion: SKILL_VERSION,
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });

  it('should return consistent component docs response for stdio transport', async () => {
    const testProjectRootDirectory = '/Users/test/project';
    const testComponentsList = 'Button, Accordion';

    // Get the actual implementations (not mocked) to test real output
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

    // Get the stdio callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stdioCallback = getKlear360ComponentDocsStdioCallback;

    // Call the tool callback with actual implementation
    const result = stdioCallback(
      {
        componentsList: testComponentsList,
        currentProjectRootDirectory: testProjectRootDirectory,
        clientName: 'cursor',
      },
      createMockContext(),
    );

    // Snapshot test to ensure the output format remains consistent
    expect(result).toMatchSnapshot();
  });
});
