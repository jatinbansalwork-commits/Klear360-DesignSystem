/* eslint-disable @typescript-eslint/no-explicit-any */
export function getKlear360Coverage(): {
  klear360Coverage: number;
  totalNodes: number;
  klear360Nodes: number;
};

export function assertKlear360Coverage({
  page,
  expect,
  threshold,
}: {
  page: any;
  expect: any;
  threshold?: number;
}): Promise<void>;
