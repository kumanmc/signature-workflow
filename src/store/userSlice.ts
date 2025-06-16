import { StateCreator } from 'zustand';
import { User, UserSlice, AppState } from './types';

const hardcodedUsers: User[] = [
  { id: '0001', name: 'Superman', email: 'superman@example.com' },
  { id: '0002', name: 'Batman', email: 'batman@example.com' },
  { id: '0003', name: 'Wolverine', email: 'wolverine@example.com' },
  { id: '0004', name: 'Pinocho', email: 'pinocho@example.com' },
];

const initialUserStateProperties = {
  currentUser: hardcodedUsers[0],
  users: hardcodedUsers,
};

export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
  ...initialUserStateProperties,
  setCurrentUser: (user: User) => set({ currentUser: user }),
  getUserById: (userId: string) => get().users.find((user) => user.id === userId),
  resetUserSlice: () => set(initialUserStateProperties),
});
