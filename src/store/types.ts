export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserSlice {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  resetUserSlice: () => void;
}

export interface AppState extends UserSlice {
  // Add other slices here if needed
  resetAllSlices: () => void;
}
