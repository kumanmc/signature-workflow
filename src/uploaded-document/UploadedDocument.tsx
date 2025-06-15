import React from 'react';
import { Document, RequestedSign } from '../store/types';
import {
  ListItem,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

import { useAppStore } from '../store/index';
import DocumentDetails from './DocumentDetails';
import { ActionButtons } from './ActionButtons';

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
  const [currentTab, setCurrentTab] = React.useState(0);

  const getRequestedSignByDocumentId = useAppStore((state) => state.getRequestedSignByDocumentId);
  const requestedSigns = useAppStore((state) => state.requestedSigns);

  const requestedSignsFilteredByDoc: RequestedSign[] = useMemo(() => {
    return getRequestedSignByDocumentId(doc.id);
  }, [doc.id, getRequestedSignByDocumentId, requestedSigns]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

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
          <ActionButtons
            doc={doc}
            status={status}
          />

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