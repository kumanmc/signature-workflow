import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState } from './types';
import { createUserSlice } from './userSlice';
import { createDocumentSlice } from './documentSlice';
import { createRequestedSignSlice } from './requestedSignSlice';
import { createNotificationSlice } from './notificationSlice';

export const useAppStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      ...createUserSlice(set, get, store),
      ...createDocumentSlice(set, get, store),
      ...createRequestedSignSlice(set, get, store),
      ...createNotificationSlice(set, get, store),
      resetAllSlices: () => {
        get().resetUserSlice();
        get().resetDocumentSlice();
        get().resetRequestedSign();
        get().resetNotification();
      },
    }),
    { name: 'SignatureWorkflowApp' }
  )
);
