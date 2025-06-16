import React from 'react';
import { Document, RequestedSign } from '../store/types';
import {
  ListItem,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  ListItemText,
  List,
} from '@mui/material';
import { useMemo } from 'react';

import { useAppStore } from '../store/index';
import DocumentDetails from './DocumentDetails';
import { ActionButtons } from './ActionButtons';
import { getStatus } from '../helpers/getStatus';

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

      <TabPanel key='1' value={currentTab} index={0}>
        <Grid container alignItems="center" spacing={2} sx={{ width: '100%', mt: 0 }}>
          <DocumentDetails doc={doc} />
          <ActionButtons
            doc={doc}
          />
        </Grid>
      </TabPanel>

      <TabPanel key='2' value={currentTab} index={1}>
        <Box sx={{ p: 2, width: '100%' }}>
          <Typography component="span" variant="h6" sx={{ mb: 1.5 }}>Sign Request History</Typography>
          <List disablePadding>
            {requestedSignsFilteredByDoc && requestedSignsFilteredByDoc.length > 0 ? (
              requestedSignsFilteredByDoc.map((request) => {
                const requestStatus = getStatus({
                  id: request.id,
                  signedAt: request.signedAt,
                  declinedAt: request.declinedAt
                });

                return (
                  <ListItem key={request.id} disableGutters sx={{ borderBottom: '1px dashed #eee', py: 1 }}>
                    <ListItemText
                      primary={null}
                      secondary={
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: '0.5rem', sm: '1rem' }, mt: 0.5 }}>
                          <Typography component="div" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold', mr: 0.5 }}>User:</Box>
                            <Box component="span" sx={{ fontWeight: 'bold' }}>{request.email}</Box>
                          </Typography>
                          <Typography component="div" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', mr: 0.5 }}>Status:</Box>
                            <Box component="span" sx={{ color: requestStatus.style, fontWeight: 'bold' }}>
                              {requestStatus.label}
                            </Box>
                          </Typography>
                          {request.requestedAt && (
                            <Typography component="div" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>

                              <Box component="span">
                                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', mr: 0.5 }}>Requested on:</Box>
                                {new Date(request.requestedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                              </Box>
                            </Typography>
                          )}
                          {request.signedAt && (
                            <Typography component="div" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>

                              <Box component="span">
                                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', mr: 0.5 }}>Signed on:</Box>
                                {new Date(request.signedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                              </Box>
                            </Typography>
                          )}
                          {request.declinedAt && (
                            <Typography component="div" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>

                              <Box component="span">
                                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', mr: 0.5 }}>Declined on:</Box>
                                {new Date(request.declinedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                              </Box>
                            </Typography>
                          )}
                        </Box>
                      }
                      slotProps={{ secondary: { component: 'div' } }}
                    />
                  </ListItem>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No sign requests made yet.
              </Typography>
            )}
          </List>
        </Box>
      </TabPanel>
    </ListItem>
  );
};

export default UploadedDocument;