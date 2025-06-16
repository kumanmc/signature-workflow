import { StateCreator } from 'zustand';
import { RequestedSign, RequestedSignSlice, AppState } from './types';

const initialRequestedSignProperties = {
  requestedSigns: [] as RequestedSign[],
};

export const createRequestedSignSlice: StateCreator<AppState, [], [], RequestedSignSlice> = (set, get) => ({
  ...initialRequestedSignProperties,
  getRequestedSignByDocumentId: (documentId) =>
    get().requestedSigns.filter(sign => sign.documentId === documentId),
  getRequestedSignByEmail: (email: string) =>
    get().requestedSigns.filter(sign => sign.email === email),
  resetRequestedSign: () => set(initialRequestedSignProperties),
  addRequestedSign:(requestedSign: RequestedSign) => { set(state => ({ requestedSigns: [...state.requestedSigns, requestedSign] })); },
});
