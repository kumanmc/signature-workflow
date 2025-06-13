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

export interface Document {
  id: string;
  name: string;
  uploadedByUserId: string;
  uploadedAt: Date;
  file: File;
  signs: [];
}

export interface DocumentSlice {
  documents: Document[];
  getDocumentsByUserId: (userId: string) => Document[];
  uploadDocument: (document: Document) => void;
  resetDocumentSlice: () => void;
}
export interface AppState extends UserSlice, DocumentSlice {
  resetAllSlices: () => void;
}
