export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserSlice {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  getUserById: (userId: string) => User | undefined;
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

export interface DocumentRequested extends Document {
  requestedSign: RequestedSign;
}

export type UserDocument = Document | DocumentRequested;

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
  requestedAt: Date | null;
  documentId: string;
}

export interface RequestedSignSlice {
  requestedSigns: RequestedSign[];
  getRequestedSignByDocumentId: (documentId: string) => RequestedSign[];
  getRequestedSignByEmail: (email: string) => RequestedSign[];
  resetRequestedSign: () => void;
  addRequestedSign: (requestedSign: RequestedSign) => void;
}

export interface AppState extends UserSlice, DocumentSlice, RequestedSignSlice {
  resetAllSlices: () => void;
}
