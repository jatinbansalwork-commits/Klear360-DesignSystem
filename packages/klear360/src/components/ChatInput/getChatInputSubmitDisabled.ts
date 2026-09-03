import type { Klear360FileList } from '~components/FileUpload/types';

const getChatInputSubmitDisabled = (textValue: string, files: Klear360FileList): boolean => {
  const hasText = textValue.trim().length > 0;
  const hasFiles = files.length > 0;
  const hasErrorFiles = files.some((f) => f.status === 'error' || f.status === 'uploading');
  return (!hasText && !hasFiles) || hasErrorFiles;
};

export { getChatInputSubmitDisabled };
