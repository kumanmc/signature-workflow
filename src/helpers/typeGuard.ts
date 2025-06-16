import { UserDocument, DocumentRequested } from '../store/types';

export function isDocumentRequested(doc: UserDocument): doc is DocumentRequested {
  return (doc as DocumentRequested).requestedSign !== undefined;
}