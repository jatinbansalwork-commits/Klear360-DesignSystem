import styles from './FileUpload.module.scss';

export const getFileUploadDropZoneClass = (): string => styles.dropZone;

export const getFileUploadItemClass = (): string => styles.item;

export const getFileUploadDropZoneDataAttributes = ({
  isDisabled,
  isActive,
}: {
  isDisabled?: boolean;
  isActive?: boolean;
}): { 'data-disabled'?: true; 'data-active'?: true } => ({
  ...(isDisabled ? { 'data-disabled': true } : {}),
  ...(isActive ? { 'data-active': true } : {}),
});

export const getFileUploadItemDataAttributes = (
  status: string,
): { 'data-status': string } => ({
  'data-status': status,
});
