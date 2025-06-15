import { StateCreator } from 'zustand';
import { Document, DocumentSlice, AppState } from './types';

const initialDocumentStateProperties = {
  documents: [] as Document[],
};

export const createDocumentSlice: StateCreator<AppState, [], [], DocumentSlice> = (set, get) => ({
  ...initialDocumentStateProperties,
  getDocumentsByUserId: (userId) => get().documents.filter(doc => doc.uploadedByUserId === userId),
  uploadDocument: (document: Document) => { set(state => ({ documents: [...state.documents, document] })); },
  declineDocument: (document: Document) => {
    set(state => ({
      documents: state.documents.map(doc =>
        doc.id === document.id ? { ...doc, sign: { ...doc.sign, declinedAt: new Date() } } : doc
      )
    }));
  },
  resetDocumentSlice: () => set(initialDocumentStateProperties),
});
