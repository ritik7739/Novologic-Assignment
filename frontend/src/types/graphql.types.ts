export type User = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
};

export type WorkbookFile = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  storageKey: string;
  createdAt: string;
};

export type Workbook = {
  id: string;
  content: Record<string, unknown>;
  updatedAt: string;
  files: WorkbookFile[];
};

export type WorkbookVersion = {
  id: string;
  content: Record<string, unknown>;
  savedAt: string;
};
