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

const UploadedDocument = (props: Document) => {
  return (
    <ListItem
      key={props.id}
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
        <Grid size={{ xs: 12, sm: 8 }}>
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
                {props.name}
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                  },
                }}
              >
                {`Uploaded on: ${new Date(props.uploadedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short'})}`}
              </Typography>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
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
            <Button variant="contained" size="small" aria-label='View document'>
              View
            </Button>
            <Button variant="contained" size="small" aria-label='Sign document'>
              Sign
            </Button>
            <Button variant="outlined" size="small" aria-label='Request sign document'>
              Request Sign
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default UploadedDocument;