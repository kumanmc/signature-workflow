import { StateCreator } from 'zustand';
import { User, UserSlice, AppState } from './types';

const hardcodedUsers: User[] = [
  { name: 'Superman', email: 'superman@example.com' },
  { name: 'Batman', email: 'batman@example.com' },
  { name: 'Wolverine', email: 'wolverine@example.com' },
  { name: 'Pinocho', email: 'pinocho@example.com' },
];

const initialUserStateProperties = {
  currentUser: hardcodedUsers[0],
  users: hardcodedUsers,
};

export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
  ...initialUserStateProperties,
  setCurrentUser: (user: User) => set({ currentUser: user }),
  getUserByEmail: (email: string) => get().users.find((user) => user.email === email),
  resetUserSlice: () => set(initialUserStateProperties),
});
