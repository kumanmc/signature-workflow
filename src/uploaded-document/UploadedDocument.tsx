import React from 'react';
import { Document } from '../store/types';
import { ListItem, ListItemText, Typography } from '@mui/material';

const UploadedDocument = (props: Document) => {
  return (
    <ListItem key={props.id} aria-label="Document">
      <ListItemText
      primary={
        <Typography
        variant="h6"
        sx={{
          fontSize: {
          xs: '1rem',
          sm: '1.25rem',
          },
        }}
        >
        {props.name}
        </Typography>
      }
      secondary={
        <Typography
        variant="body2"
        sx={{
          color: '#555',
          fontSize: {
          xs: '0.875rem',
          sm: '1rem',
          },
        }}
        >
        {`Uploaded on: ${new Date(props.uploadedAt).toLocaleDateString('en-GB')}`}
        </Typography>
      }
      />
    </ListItem>
  );
};


export default UploadedDocument;
