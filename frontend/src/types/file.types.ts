import type { WorkbookFile } from './graphql.types';

export type UploadResult = Omit<WorkbookFile, 'id' | 'createdAt'> & {
  workbookId?: string;
  url: string;
};
