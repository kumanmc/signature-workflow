import React from 'react';
import { UserDocument } from '../store/types';
import {
  ListItem,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import DocumentDetails from './DocumentDetails';
import { ActionButtons } from '../action-buttons/ActionButtons';
import RequestedSignHistory from './RequestedSignHistory';

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

const UploadedDocument = (doc: UserDocument) => {
  const [currentTab, setCurrentTab] = React.useState(0);

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
        borderBottom: '1px solid #4285F4' ,
        '&:last-child': {
          borderBottom: 'none'
        },
        backgroundColor: '#fafafa',
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
        <RequestedSignHistory {...doc} />
      </TabPanel>
    </ListItem>
  );
};

export default UploadedDocument;