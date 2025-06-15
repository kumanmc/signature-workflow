import React from 'react';
import { Document } from '../store/types';
import {
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Box,
  Button,
} from '@mui/material';

import { useAppStore } from '../store/index';
import { Sign } from '../store/types';

const UploadedDocument = (doc: Document) => {

  const declineDocument = useAppStore((state) => state.declineDocument);
  const signDocument = useAppStore((state) => state.signDocument);

  const handleDecline = () => {
    const sign: Sign = {
      id: doc.sign.id,
      signedAt: null,
      declinedAt: new Date(),
    };
    declineDocument({ ...doc, sign });
  }
  const handleSign = () => {
    const sign: Sign = {
      id: doc.sign.id,
      signedAt: new Date(),
      declinedAt: null,
    };
    signDocument({ ...doc, sign });
  }

  const status = {
    style: 'info.main',
    label: 'Pending',
    signDisabled: false,
    declineDisabled: false,
  };
  if (doc.sign.signedAt) {
    status.style = 'success.main';
    status.label = 'Signed';
    status.signDisabled = true;
    status.declineDisabled = true;
  } else if (doc.sign.declinedAt) {
    status.style = 'error.main';
    status.label = 'Declined';
    status.signDisabled = true;
    status.declineDisabled = true;
  }

  return (
    <ListItem
      key={doc.id}
      aria-label="Document"
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingY: { xs: 1, sm: 2 },
        borderBottom: '1px solid #e0e0e0',
        '&:last-child': {
          borderBottom: 'none'
        },
      }}
    >
      <Grid container alignItems="center" spacing={2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, sm: 7 }}>
          <ListItemText
            primary={
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
            }
            secondary={
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


            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 5 }}>
          <Box
            sx={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: {
                xs: 'flex-start',
                sm: 'flex-end',
              },
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },
              width: {
                xs: '100%',
                sm: 'auto',
              },
              '& > button': {
                width: {
                  xs: '100%',
                  sm: 'auto',
                },
              },
            }}
          >
            <Button variant="outlined" size="small" aria-label='View document'>
              View
            </Button>
            <Button
              variant="contained"
              size="small"
              aria-label='Sign document'
              disabled={status.signDisabled}
              onClick={handleSign}
              sx={{
                backgroundColor: 'success.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'success.dark',
                },
              }}
            >
              Sign
            </Button>
            <Button
              variant="contained"
              size="small"
              aria-label='Decline document'
              disabled={status.declineDisabled}
              onClick={handleDecline}
              sx={{
                backgroundColor: 'error.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'error.dark',
                },
              }}
            >
              Decline
            </Button>
            <Button variant="contained" size="small" aria-label='Request sign document'>
              Request Sign
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default UploadedDocument;