export interface User {
  name: string;
  email: string;
}

export interface UserSlice {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  getUserByEmail: (email: string) => User | undefined;
  resetUserSlice: () => void;
}

export interface Document {
  id: string;
  name: string;
  uploadedBy: string;
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
  getDocumentsByEmail: (email: string) => Document[];
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
  emailCreator: string;
  email: string;
  requestedAt: Date | null;
  documentId: string;
}

export interface RequestedSignSlice {
  requestedSigns: RequestedSign[];
  getRequestedSignByDocumentId: (documentId: string) => RequestedSign[];
  getRequestedSignByEmail: (email: string) => RequestedSign[];
  declineRequestedSign: (requestedSign: RequestedSign) => void;
  signRequestedSign: (requestedSign: RequestedSign) => void;
  resetRequestedSign: () => void;
  addRequestedSign: (requestedSign: RequestedSign) => void;
}

export interface AppState extends UserSlice, DocumentSlice, RequestedSignSlice {
  resetAllSlices: () => void;
}
