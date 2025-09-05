import { CreateFunction, EditFunction, AspectRatio } from './types';

interface CreateFunctionCard {
  id: CreateFunction;
  icon: string;
  name: string;
}

interface EditFunctionCard {
  id: EditFunction;
  icon: string;
  name: string;
  requiresTwo?: boolean;
}

export const CREATE_FUNCTIONS: CreateFunctionCard[] = [
  { id: 'free', icon: '✨', name: 'Prompt' },
  { id: 'sticker', icon: '🏷️', name: 'Adesivos' },
  { id: 'text', icon: '📝', name: 'Logo' },
  { id: 'comic', icon: '💭', name: 'HQ' },
];

export const EDIT_FUNCTIONS: EditFunctionCard[] = [
  { id: 'add-remove', icon: '➕', name: 'Adicionar' },
  { id: 'retouch', icon: '🎯', name: 'Retoque' },
  { id: 'style', icon: '🎨', name: 'Estilo' },
  { id: 'compose', icon: '🖼️', name: 'Unir', requiresTwo: true },
];

export const ASPECT_RATIOS: { id: AspectRatio; label: string }[] = [
    { id: '1:1', label: '1:1' },
    { id: '16:9', label: '16:9' },
    { id: '9:16', label: '9:16' },
    { id: '4:3', label: '4:3' },
    { id: '3:4', label: '3:4' },
];