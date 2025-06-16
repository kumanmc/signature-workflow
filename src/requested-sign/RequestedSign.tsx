import React from 'react';
import { UserDocument } from '../store/types';
import {
  ListItem,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import DocumentDetails from '../uploaded-document/DocumentDetails';
import { ActionButtons } from '../action-buttons/ActionButtons';

const RequestedSign = (doc: UserDocument) => {

  return (
    <ListItem
      key={doc.id}
      aria-label="Requested Document"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingY: { xs: 1, sm: 2 },
        borderBottom: '1px solid #4285F4' ,
        '&:last-child': {
          borderBottom: 'none'
        },
        backgroundColor: '#FFFDE7',
      }}
    >
      <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.25rem',
            },
            color: '#616161',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Filename: {doc.name}
        </Typography>
      </Box>

        <Grid container alignItems="center" spacing={2} sx={{ width: '100%', mt: 0 }}>
          <DocumentDetails doc={doc} />
          <ActionButtons
            doc={doc}
          />
        </Grid>


    </ListItem>
  );
};

export default RequestedSign;