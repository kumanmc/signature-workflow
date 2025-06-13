// src/file-upload/FileUpload.tsx

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppStore } from '../store/index';
import { Document } from '../store/types';
import { FileRejection } from 'react-dropzone';

interface FileUploadProps {
  maxFileSizeMb?: number;
}

const FileUpload = (props: FileUploadProps) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const uploadDocument = useAppStore((state) => state.uploadDocument);
  const maxFileSizeMb = props.maxFileSizeMb || 1;

  const handleDocumentsUpload = (files: File[]) => {
    console.log('Files ready:', files);

    files.forEach(file => {
      uploadDocument({
        id: crypto.randomUUID(),
        name: file.name,
        uploadedByUserId: currentUser.id,
        uploadedAt: new Date(),
        file: file,
        signs: [],
      } as Document);
      console.log('Uploading file:', file.name);
    });
    //TODO:
    // - Actualizar el estado del store con los archivos.
    // - Mostrar loading o algo asi
    // - Manejar errores
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      handleDocumentsUpload(acceptedFiles);
    }
    if (fileRejections.length > 0) {
      fileRejections.forEach(fileRejection => {
        console.error(fileRejection.file.name + ' - ' + fileRejection.errors[0].code + ' - ' + fileRejection.errors[0].message);
      });
    }
  }, []);

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
    </Box>
  );
};

export default FileUpload;