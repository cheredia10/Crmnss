export interface DirectoryOption {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'file';
  size?: number;
  lastModified?: Date;
  parent?: string;
}