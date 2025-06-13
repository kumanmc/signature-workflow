import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState } from './types';
import { createUserSlice } from './userSlice';

export const useAppStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      ...createUserSlice(set, get, store),
      resetAllSlices: () => {
        get().resetUserSlice();
      },
    }),
    { name: 'SignatureWorkflowApp' }
  )
);
