import { StateCreator } from 'zustand';
import { Document, DocumentSlice, AppState } from './types';

const initialDocumentStateProperties = {
  documents: [] as Document[],
};

export const createDocumentSlice: StateCreator<AppState, [], [], DocumentSlice> = (set, get) => ({
  ...initialDocumentStateProperties,
  getDocumentsByUserId: (userId) => get().documents.filter(doc => doc.uploadedByUserId === userId),
  uploadDocument: (document: Document) => { set(state => ({ documents: [...state.documents, document] })); },
  resetDocumentSlice: () => set(initialDocumentStateProperties),
});
