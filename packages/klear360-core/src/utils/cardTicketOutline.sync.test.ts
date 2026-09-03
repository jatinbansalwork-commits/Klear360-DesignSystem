import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Sync test — verifies that packages/klear360/src/utils/cardTicketOutline.ts and
 * packages/klear360-core/src/utils/cardTicketOutline.ts stay in sync.
 *
 * klear360 cannot depend on klear360-core yet, so the file is duplicated. This test
 * compares the functional code (excluding the sync-comment header) to catch drift.
 */
describe('cardTicketOutline sync', () => {
  const klear360CorePath = resolve(__dirname, 'cardTicketOutline.ts');
  const klear360Path = resolve(__dirname, '../../../klear360/src/utils/cardTicketOutline.ts');

  const stripSyncHeader = (content: string): string => {
    const lines = content.split('\n');
    const firstExportIndex = lines.findIndex((line) => line.startsWith('/** Corner radius'));
    return lines.slice(firstExportIndex).join('\n');
  };

  it('klear360 and klear360-core cardTicketOutline.ts should have identical functional code', () => {
    const klear360CoreContent = readFileSync(klear360CorePath, 'utf-8');
    const klear360Content = readFileSync(klear360Path, 'utf-8');

    const klear360CoreCode = stripSyncHeader(klear360CoreContent);
    const klear360Code = stripSyncHeader(klear360Content);

    expect(klear360CoreCode).toBe(klear360Code);
  });
});
