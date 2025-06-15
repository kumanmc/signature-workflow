import React from 'react';
import { ListItemText, Typography, Box } from "@mui/material";
import { Document } from '../store/types';

const DocumentDetails = ({ doc }: { doc: Document }) => {

  const status = {
    style: 'info.main',
    label: 'Pending',
  };
  if (doc.sign.signedAt) {
    status.style = 'success.main';
    status.label = 'Signed';
  } else if (doc.sign.declinedAt) {
    status.style = 'error.main';
    status.label = 'Declined';
  }

  const primary = (
    <Typography
      variant="h6"
      sx={{
        fontSize: {
          xs: '1rem',
          sm: '1.25rem',
        },
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {doc.name}
    </Typography>
  );

  const secondary = (
    <>
      <Typography
        variant="body2"
        component="span"
        sx={{
          color: 'text.secondary',
          fontSize: {
            xs: '0.875rem',
            sm: '1rem',
          },
          display: 'block',
        }}
      >
        {`Uploaded on: ${new Date(doc.uploadedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}`}
      </Typography>
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem',
          },
        }}
      >
        <Box component="span" sx={{ color: 'text.secondary', marginRight: '4px', fontWeight: 'bold' }} aria-label='Status'>
          Status
        </Box>
        <Box component="span" sx={{ color: status.style, fontWeight: 'bold' }}>
          {status.label}
        </Box>
      </Typography>
    </>
  );

  return <ListItemText primary={primary} secondary={secondary} />;
};

export default DocumentDetails;
