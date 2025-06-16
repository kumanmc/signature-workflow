import React from 'react';
import { useAppStore } from '../store/index';
import { useMemo } from 'react';
import { DocumentRequested, UserDocument } from '../store/types';
import { Box, List, Typography } from '@mui/material';
import UploadedDocument from '../uploaded-document/UploadedDocument';
import RequestedSign from '../requested-sign/RequestedSign';
import { isDocumentRequested } from '../helpers/typeGuard'

const DocumentList = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const getDocumentsByEmail = useAppStore((state) => state.getDocumentsByEmail);
  const getRequestedSignByEmail = useAppStore((state) => state.getRequestedSignByEmail);
  const documents = useAppStore((state) => state.documents);
  const requestedSigns = useAppStore((state) => state.requestedSigns);

  // Memoize the list of documents for the current user
  const userDocuments: UserDocument[] = useMemo(() => {
    const documentsFilteredByEmail = getDocumentsByEmail(currentUser.email);
    const requestedSigns = getRequestedSignByEmail(currentUser.email);
    requestedSigns.forEach((sign) => {
      const existingDocument = documents.find((doc) => doc.id === sign.documentId);
      if (existingDocument) {
        documentsFilteredByEmail.push({
          ...existingDocument,
          requestedSign: sign,
        } as DocumentRequested);
      }
    });
    return documentsFilteredByEmail.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [currentUser, documents, requestedSigns]);

  return (
    <Box
      sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}
      aria-label="Document list"
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: '#007bff',
          fontWeight: 'bold',
          textAlign: 'left',
        }}
      >
        {`${currentUser.name}'s Documents`}
      </Typography>

      {userDocuments.length === 0 ? (
        <Typography variant="body1" sx={{ color: '#555' }}>
          No documents available
        </Typography>
      ) : (
        <List>
          {
            userDocuments.map((doc, index) => (
              isDocumentRequested(doc) ?
                <RequestedSign key={index} {...doc} />
                :
                <UploadedDocument key={index}  {...doc} />
            )
            )}
        </List>
      )}
    </Box>
  );
};

export default DocumentList;
