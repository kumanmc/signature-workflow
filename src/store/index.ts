import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState } from './types';
import { createUserSlice } from './userSlice';
import { createDocumentSlice } from './documentSlice';

export const useAppStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      ...createUserSlice(set, get, store),
      ...createDocumentSlice(set, get, store),
      resetAllSlices: () => {
        get().resetUserSlice();
        get().resetDocumentSlice();
      },
    }),
    { name: 'SignatureWorkflowApp' }
  )
);
