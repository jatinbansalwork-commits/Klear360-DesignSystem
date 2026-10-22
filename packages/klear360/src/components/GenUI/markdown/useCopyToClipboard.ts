import { useState } from 'react';

const COPIED_FEEDBACK_DURATION_MS = 2000;

// Shared by MarkdownCodeBlockCopyButton and Copyable - both show a transient "copied" state
// for the same duration after writing the same kind of text value to the clipboard.
const useCopyToClipboard = (value: string): { copied: boolean; handleCopy: () => void } => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_DURATION_MS);
  };

  return { copied, handleCopy };
};

export { useCopyToClipboard };
