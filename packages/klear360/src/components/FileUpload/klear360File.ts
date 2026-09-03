// Default (React Native) shape of Klear360File. Web uses `klear360File.web.ts` which extends the
// native `File`/`Blob` API instead, since native has no such global.
interface Klear360File {
  /**
   * The file name.
   */
  name: string;
  /**
   * The file size in bytes.
   */
  size: number;
  /**
   * The MIME type of the file (e.g. "image/png").
   * Optional on React Native — some file pickers may not return a MIME type.
   */
  type?: string;
  /**
   * The last modified time of the file as a Unix timestamp (milliseconds since epoch).
   * Present on web File objects; may be omitted on React Native.
   */
  lastModified?: number;
  /**
   * The unique identifier of the file.
   */
  id?: string;
  /**
   * The file's upload status.
   */
  status?: 'uploading' | 'success' | 'error';
  /**
   * The percentage of file upload completion.
   */
  uploadPercent?: number;
  /**
   * Text indicating an error state
   */
  errorText?: string;
}

export type { Klear360File };
