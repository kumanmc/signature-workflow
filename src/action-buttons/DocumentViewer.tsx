import React from 'react';
import { Box, Grid } from '@mui/material';
import { Document } from '../store/types';

const DocumentViewer = ({ doc }: { doc: Document }) => (
  <Grid size={{ xs: 12 }}>
    <Box
      sx={{
        marginTop: '1rem',
        width: '100%',
        height: '500px',
        border: '1px solid #e0e0e0',
      }}
    >
      <iframe
        src={URL.createObjectURL(doc.file)}
        title={doc.name}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </Box>
  </Grid>
);

export default DocumentViewer;