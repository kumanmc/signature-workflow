import React from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useAppStore } from '../store/index';
import { Sign, Document, RequestedSign, Notification } from '../store/types';
import { generateGUID } from '../helpers/generate-GUID';
import DocumentViewer from './DocumentViewer';
import RequestSignForm from './RequestedSignForm';
import { getStatus } from '../helpers/getStatus';
import { isDocumentRequested } from '../helpers/typeGuard'

export const ActionButtons = ({ doc }: {
  doc: Document;
}) => {
  const declineDocument = useAppStore((state) => state.declineDocument);
  const signDocument = useAppStore((state) => state.signDocument);
  const addRequestedSign = useAppStore((state) => state.addRequestedSign);
  const signRequestedSign = useAppStore((state) => state.signRequestedSign);
  const declineRequestedSign = useAppStore((state) => state.declineRequestedSign);
  const sendNotification = useAppStore((state) => state.sendNotification);

  const [showDocument, setShowDocument] = React.useState(false);
  const [showRequestForm, setShowRequestForm] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const currentUser = useAppStore((state) => state.currentUser);

  const [email, setEmail] = React.useState('');

  const handleViewDocument = () => {
    setShowDocument(!showDocument);
  };

  const handleDecline = () => {
    if (isDocumentRequested(doc)) {
      const reqSign = {
        ...doc.requestedSign,
        declinedAt: new Date(),
      };
      declineRequestedSign(reqSign);
      sendNotification({
        id: generateGUID(),
        emailCreator: currentUser.email,
        email: doc.uploadedBy,
        type: 'Decline',
        date: new Date(),
        documentId: doc.id,
        fileName: doc.name,
        read: false,
      } as Notification);
    } else {
      const sign: Sign = {
        id: generateGUID(),
        signedAt: null,
        declinedAt: new Date(),
      };
      declineDocument({ ...doc, sign });
    }
  }
  const handleSign = () => {
    if (isDocumentRequested(doc)) {
      const reqSign = {
        ...doc.requestedSign,
        signedAt: new Date(),
      };
      signRequestedSign(reqSign);
      sendNotification({
        id: generateGUID(),
        emailCreator: currentUser.email,
        email: doc.uploadedBy,
        type: 'Sign',
        date: new Date(),
        documentId: doc.id,
        fileName: doc.name,
        read: false,
      } as Notification);
    } else {
      const sign: Sign = {
        id: generateGUID(),
        signedAt: new Date(),
        declinedAt: null,
      };
      signDocument({ ...doc, sign });
    }
  }
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
        emailCreator: currentUser.email,
        email: email,
        declinedAt: null,
        signedAt: null,
        requestedAt: new Date(),
      } as RequestedSign);
      sendNotification({
        id: generateGUID(),
        emailCreator: currentUser.email,
        email: email,
        type: 'Request',
        date: new Date(),
        documentId: doc.id,
        fileName: doc.name,
        read: false,
      } as Notification);
    }, 1000);
  };

  let status;
  if (isDocumentRequested(doc)) {
    status = getStatus(doc.requestedSign)
  }else {
    status = getStatus(doc.sign)
  }

  return (
    <>
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
            aria-label="View document"
          >
            {showDocument ? 'Hide' : 'View'}
          </Button>
          <Button
            variant="contained"
            size="small"
            aria-label="Sign document"
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
            aria-label="Decline document"
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
          { !isDocumentRequested(doc) && <Button
            variant="contained"
            size="small"
            aria-label="Request sign document"
            onClick={handleRequestSign}
            disabled={showSuccessMessage}
          >
            {showRequestForm ? 'Cancel' : 'Request Sign'}
          </Button>}
        </Box>
      </Grid>
      {showRequestForm && (
        <RequestSignForm
          showSuccessMessage={showSuccessMessage}
          email={email}
          setEmail={setEmail}
          handleSendRequest={handleSendRequest}
        />
      )}
      {showDocument && (<DocumentViewer doc={doc} />)}
    </>
  );
};
