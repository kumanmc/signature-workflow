import React from 'react';
import { Document } from '../store/types';
import {
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Box,
  Button,
  Alert,
  TextField
} from '@mui/material';

import { useAppStore } from '../store/index';
import { Sign } from '../store/types';
import { generateGUID } from '../helpers/generate-GUID';

const UploadedDocument = (doc: Document) => {

  const declineDocument = useAppStore((state) => state.declineDocument);
  const signDocument = useAppStore((state) => state.signDocument);
  const [showDocument, setShowDocument] = React.useState(false);
  const [showRequestForm, setShowRequestForm] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleRequestSign = () => {
    setShowRequestForm(!showRequestForm);
  };

  const handleSendRequest = () => {
    //TODO: send email request to sign the document
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setEmail('');
      setShowRequestForm(false);
    }, 1000);
  };

  const handleViewDocument = () => {
    setShowDocument(!showDocument);
  };

  const handleDecline = () => {
    const sign: Sign = {
      id: generateGUID(),
      signedAt: null,
      declinedAt: new Date(),
    };
    declineDocument({ ...doc, sign });
  }
  const handleSign = () => {
    const sign: Sign = {
      id: generateGUID(),
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
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewDocument}
              aria-label='View document'
            >
              {showDocument ? 'Hide' : 'View'}
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
            <Button
              variant="contained"
              size="small"
              aria-label='Request sign document'
              onClick={handleRequestSign}
              disabled={showSuccessMessage}
            >
              {showRequestForm ? 'Cancel' : 'Request Sign'}
            </Button>
          </Box>

        </Grid>
        {showRequestForm && (
          <Grid size={{ xs: 12 }}>
            <React.Fragment>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  width: '100%',
                }}
              >
                { showSuccessMessage ? (
                  // Display the Alert component when showSuccessMessage is true
                  <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                    Request sent successfully
                  </Alert>
                ) : (
                  <React.Fragment>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Enter email to request signature:
                    </Typography>
                    <Box
                      component="form"
                      sx={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendRequest();
                      }}
                    >
                      <TextField
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="Enter email"
                        required
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{
                          flex: 1,
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        aria-label="Send request"
                        disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                      >
                        Send
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Box>
            </React.Fragment>
          </Grid>
        )}
        {showDocument && (
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
        )}
      </Grid>
    </ListItem>
  );
};

export default UploadedDocument;