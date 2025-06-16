import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Typography, Paper, Alert, IconButton, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppStore } from '../store/index';
import { Document, Sign } from '../store/types';
import { FileRejection } from 'react-dropzone';
import { generateGUID } from '../helpers/generate-GUID';
import { log } from 'console';

interface FileUploadProps {
  maxFileSizeMb?: number;
}

interface FileErrorDetail {
  fileName: string;
  code: string;
  message: string;
  id: string;
}

const FileUpload = (props: FileUploadProps) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const uploadDocument = useAppStore((state) => state.uploadDocument);
  const maxFileSizeMb = props.maxFileSizeMb || 1;
  const [error, setError] = useState<FileErrorDetail[]>([]);

  const handleDocumentsUpload = (files: File[]) => {

    files.forEach(file => {
      uploadDocument({
        id: generateGUID(),
        name: file.name,
        uploadedByUserId: currentUser.id,
        uploadedAt: new Date(),
        file: file,
        sign: {
          id: generateGUID(),
          signedAt: null,
          declinedAt: null,
        } as Sign,
      } as Document);
    });
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      handleDocumentsUpload(acceptedFiles);
    }
    if (fileRejections.length > 0) {
      const errors: FileErrorDetail[] = fileRejections.map(fileRejection => ({
        fileName: fileRejection.file.name,
        code: fileRejection.errors[0].code,
        message: fileRejection.errors[0].message,
        id: `${fileRejection.file.name}-${fileRejection.errors[0].code}-${Date.now()}`,
      }));
      setError(errors);
    }
  }, [currentUser]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: maxFileSizeMb * 1024 * 1024,
    multiple: true,
  });

  return (
    <Box mt={4}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: '#007bff',
          fontWeight: 'bold',
          textAlign: 'left',
        }}
      >
        Upload New Document
      </Typography>
      <Paper
        elevation={2}
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#e0e0e0' : '#fafafa',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
        {...getRootProps()}
      >
        <input data-testid="dropzone-input" {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 40, color: '#9e9e9e', mb: 1 }} />
        {isDragActive ? (
          <Typography variant="h6" color="primary">
            Drop the files here!
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Drag and drop some files here, or click to select files.
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          startIcon={<CloudUploadIcon />}
        >
          Select Documents
        </Button>
      </Paper>
      <UploadErrorAlert error={error} setError={setError}/>
    </Box>
  );
};

interface UploadErrorAlertProps {
  error: FileErrorDetail[];
  setError: React.Dispatch<React.SetStateAction<FileErrorDetail[]>>;
}

const UploadErrorAlert = ({ error, setError }: UploadErrorAlertProps) => {

  if (error.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', mx: 'auto', my: 2 }}>
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close-file-alert"
            color="inherit"
            size="small"
            onClick={() => {
              setError([]);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          '.MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          File upload errors!
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          The following issues were found with the files:
        </Typography>
        <List dense disablePadding>
          {error.map((errorDetail) => (
            <ListItem key={errorDetail.id} disableGutters>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {errorDetail.fileName}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {errorDetail.message} ({errorDetail.code})
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Alert>
    </Box>
  );
};

export default FileUpload;