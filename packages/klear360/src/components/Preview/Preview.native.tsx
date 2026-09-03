import React from 'react';
import type {
  PreviewBodyProps,
  PreviewFooterProps,
  PreviewHeaderProps,
  PreviewProps,
} from './types';
import { throwKlear360Error } from '~utils/logger';

const Preview = (_prop: PreviewProps): React.ReactElement => {
  throwKlear360Error({
    message: 'PreviewWindow is not yet implemented for native',
    moduleName: 'PreviewWindow',
  });

  return <></>;
};

const PreviewHeader = (_prop: PreviewHeaderProps): React.ReactElement => {
  throwKlear360Error({
    message: 'PreviewHeader is not yet implemented for native',
    moduleName: 'PreviewHeader',
  });

  return <></>;
};

const PreviewBody = (_prop: PreviewBodyProps): React.ReactElement => {
  throwKlear360Error({
    message: 'PreviewBody is not yet implemented for native',
    moduleName: 'PreviewBody',
  });

  return <></>;
};

const PreviewFooter = (_prop: PreviewFooterProps): React.ReactElement => {
  throwKlear360Error({
    message: 'PreviewFooter is not yet implemented for native',
    moduleName: 'PreviewFooter',
  });

  return <></>;
};

export { Preview, PreviewHeader, PreviewBody, PreviewFooter };
