export type Mode = 'create' | 'edit';
export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageFile {
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: number; // Using timestamp as a simple unique ID
  imageDataUrl: string;
  width: number;
  height: number;
  size: number; // in KB
  createdAt: string; // ISO String
}