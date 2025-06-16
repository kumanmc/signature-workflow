import React, { useMemo } from 'react';
import { ListItemText, Typography, Box } from "@mui/material";
import { UserDocument } from '../store/types';
import { getStatus } from '../helpers/getStatus';
import { isDocumentRequested } from '../helpers/typeGuard'
import { useAppStore } from '../store';

const DocumentDetails = ({ doc }: { doc: UserDocument }) => {

  let status = null;
  let byUser = '';

  if (isDocumentRequested(doc)) {
    const getUserById = useAppStore((state) => state.getUserById);
    const userWhoRequested = useMemo(() => {
      return getUserById(doc.uploadedByUserId)!;
    }, [getUserById, doc.uploadedByUserId]);

    byUser = ' by ' + userWhoRequested.name + '(' + userWhoRequested.email + ')' ;
    status = getStatus(doc.requestedSign);
  } else {
    status = getStatus(doc.sign);
  }

  const primary = (
    <>
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
        <Box component="span" sx={{ color: 'text.secondary', marginRight: '4px' }} aria-label='Status'>
          Status
        </Box>
        <Box component="span" sx={{ color: status.style, fontWeight: 'bold' }}>
          {status.label}
        </Box>
      </Typography>
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
        {`Uploaded on: ${new Date(doc.uploadedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })} ${byUser}`}
      </Typography>
    </>
  );

  return <ListItemText primary={primary} />;
};

export default DocumentDetails;
