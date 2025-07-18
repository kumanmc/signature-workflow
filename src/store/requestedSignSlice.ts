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
  declineRequestedSign: (requestSign: RequestedSign) => {
    // Same logic, BUT by scalability I keep diff methods because API calls could be different and diff logic
    set(state => ({
      requestedSigns: state.requestedSigns.map(sign =>
        sign.id === requestSign.id ? { ...sign, ...requestSign } : sign
      ),
    }));
  },
  signRequestedSign: (requestSign: RequestedSign) => {
    set(state => ({
      requestedSigns: state.requestedSigns.map(sign =>
        sign.id === requestSign.id ? { ...sign, ...requestSign } : sign
      ),
    }));
  },
  addRequestedSign:(requestedSign: RequestedSign) => { set(state => ({ requestedSigns: [...state.requestedSigns, requestedSign] })); },
});
