/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { IconButton } from '~components/Button/IconButton';
import { CheckIcon, CopyIcon } from '~components/Icons';
import { useCopyToClipboard } from './useCopyToClipboard';
import { MarkdownCodeBlockActions, MarkdownCodeBlockCopyAnimation } from './MarkdownStyles';

const MarkdownCodeBlockCopyButton = ({ code }: { code: React.ReactNode }) => {
  const { copied, handleCopy } = useCopyToClipboard(String(code ?? ''));

  return (
    <MarkdownCodeBlockActions>
      <Tooltip content={copied ? 'Copied!' : 'Copy'} placement="top">
        <TooltipInteractiveWrapper>
          <MarkdownCodeBlockCopyAnimation key={copied ? 'copied' : 'copy'} $copied={copied}>
            <IconButton
              icon={copied ? CheckIcon : CopyIcon}
              size="small"
              emphasis="intense"
              accessibilityLabel="Copy code block"
              onClick={handleCopy}
            />
          </MarkdownCodeBlockCopyAnimation>
        </TooltipInteractiveWrapper>
      </Tooltip>
    </MarkdownCodeBlockActions>
  );
};

export { MarkdownCodeBlockCopyButton };
