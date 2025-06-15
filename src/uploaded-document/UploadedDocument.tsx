import React from 'react';
import { Document, RequestedSign } from '../store/types';
import {
  ListItem,
  Grid,
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

import { useAppStore } from '../store/index';
import { Sign } from '../store/types';
import { generateGUID } from '../helpers/generate-GUID';
import RequestSignForm from './RequestedSignForm';
import DocumentViewer from './DocumentViewer';
import DocumentDetails from './DocumentDetails';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 0, width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UploadedDocument = (doc: Document) => {
  const declineDocument = useAppStore((state) => state.declineDocument);
  const signDocument = useAppStore((state) => state.signDocument);
  const [showDocument, setShowDocument] = React.useState(false);
  const [showRequestForm, setShowRequestForm] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState(0);

  const getRequestedSignByDocumentId = useAppStore((state) => state.getRequestedSignByDocumentId);
  const addRequestedSign = useAppStore((state) => state.addRequestedSign);
  const currentUser = useAppStore((state) => state.currentUser);
  const requestedSigns = useAppStore((state) => state.requestedSigns);

  const requestedSignsFilteredByDoc: RequestedSign[] = useMemo(() => {
    return getRequestedSignByDocumentId(doc.id);
  }, [doc.id, getRequestedSignByDocumentId, requestedSigns]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRequestSign = () => {
    setShowRequestForm(!showRequestForm);
  };

  const handleSendRequest = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setEmail('');
      setShowRequestForm(false);
      addRequestedSign({
        id: generateGUID(),
        documentId: doc.id,
        userId: currentUser.id,
        email: email,
        createdAt: new Date(),
        declinedAt: null,
        signedAt: null,
        signedRequestAt: null,
      } as RequestedSign);
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
    signDisabled: false,
    declineDisabled: false,
  };
  if (doc.sign.signedAt) {
    status.signDisabled = true;
    status.declineDisabled = true;
  } else if (doc.sign.declinedAt) {
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
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingY: { xs: 1, sm: 2 },
        borderBottom: '1px solid #e0e0e0',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="document details tabs">
          <Tab label="Document Details" id='simple-tab-0' aria-controls='simple-tabpanel-0' />
          <Tab label="Sign Requests" id='simple-tab-1' aria-controls='simple-tabpanel-1' />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Grid container alignItems="center" spacing={2} sx={{ width: '100%', mt: 0 }}>
          <DocumentDetails doc={doc} />
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
          {showDocument && (<DocumentViewer doc={doc} />)}
          {showRequestForm && (
            <RequestSignForm
              showSuccessMessage={showSuccessMessage}
              email={email}
              setEmail={setEmail}
              handleSendRequest={handleSendRequest}
            />
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Box sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            This document has been sent to the following users:
          </Typography>
          {requestedSignsFilteredByDoc && requestedSignsFilteredByDoc.length > 0 ? (
            requestedSignsFilteredByDoc.map((request, index) => (<>

              <Typography key={index} variant="body2">
                {request.email} - {'request.status'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {doc.sign.signedAt ? 'Document has been signed.' : 'No sign requests made yet.'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {doc.sign.declinedAt && (
                  <Typography variant="body2" color="error.main">
                    Document has been declined.
                  </Typography>
                )}
                {!doc.sign.signedAt && !doc.sign.declinedAt && (
                  <Typography variant="body2" color="text.secondary">
                    Document is pending signature.
                  </Typography>
                )}
              </Box>
            </>

            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No sign requests made yet.
            </Typography>
          )}
        </Box>
      </TabPanel>
    </ListItem>
  );
};

export default UploadedDocument;