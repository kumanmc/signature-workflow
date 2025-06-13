import React from 'react';
import { useAppStore } from '../store/index';
import { useMemo } from 'react';
import { Document } from '../store/types';
import { Box, List, Typography } from '@mui/material';
import UploadedDocument from '../uploaded-document/UploadedDocument';


const DocumentList = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const getDocumentsByUserId = useAppStore((state) => state.getDocumentsByUserId);
  const documents = useAppStore((state) => state.documents);

  // Memoize the list of documents for the current user
  const userDocuments: Document[] = useMemo(() => {
    return getDocumentsByUserId(currentUser.id);
  }, [currentUser, documents]);

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
          {userDocuments.map((doc) => (<UploadedDocument key={doc.id} {...doc} />))}
        </List>
      )}
    </Box>
  );
};

export default DocumentList;
