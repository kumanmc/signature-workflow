import React from "react";
import { ListItem, ListItemText, Box, Typography, List } from "@mui/material";
import { getStatus } from "../helpers/getStatus";
import { RequestedSign } from "../store/types";
import { Document } from "../store/types";
import { useMemo } from 'react';
import { useAppStore } from '../store/index';

const RequestedSignHistory = (doc: Document) => {

  const getRequestedSignByDocumentId = useAppStore((state) => state.getRequestedSignByDocumentId);
  const requestedSigns = useAppStore((state) => state.requestedSigns);

  const requestedSignsFilteredByDoc: RequestedSign[] = useMemo(() => {
    return getRequestedSignByDocumentId(doc.id);
  }, [doc.id, getRequestedSignByDocumentId, requestedSigns]);

  return requestedSignsFilteredByDoc && requestedSignsFilteredByDoc.length > 0 ? (
    <List disablePadding>{
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
      })}
    </List>
  ) : (
    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
      No sign requests made yet.
    </Typography>
  );
};

export default RequestedSignHistory