import { StateCreator } from 'zustand';
import { Notification, NotificationSlice, AppState } from './types';

const initialNotificationStateProperties = {
  notifications: [],
};

export const createNotificationSlice: StateCreator<AppState, [], [], NotificationSlice> = (set, get) => ({
  ...initialNotificationStateProperties,
  sendNotification: (notification: Notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),
  markAsRead: (notificationId: string) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === notificationId? { ...n, read: true } : n
    ),
  })),
  getNotificationsByEmail: (email: string) => get().notifications.filter((notification) => notification.email === email),
  clearNotificationsByEmail: (email: string) => set((state) => ({
    notifications: state.notifications.filter((notification) => notification.email !== email),
  })),
  resetNotification: () => set(initialNotificationStateProperties),
});
