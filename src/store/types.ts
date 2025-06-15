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
  sign: Sign;
}

export interface DocumentSlice {
  documents: Document[];
  getDocumentsByUserId: (userId: string) => Document[];
  uploadDocument: (document: Document) => void;
  declineDocument: (document: Document) => void;
  signDocument: (document: Document) => void;
  resetDocumentSlice: () => void;
}

export interface Sign {
  id: string;
  signedAt: Date | null;
  declinedAt: Date | null;
}

export interface RequestedSign extends Sign {
  userId: string;
  email: string;
  signedRequestAt: Date | null;
  documentId: string;
}

export interface AppState extends UserSlice, DocumentSlice {
  resetAllSlices: () => void;
}
