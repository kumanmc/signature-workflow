import React from 'react';
import { Container } from '@mui/material';
import Header from './header/Header';
import DocumentList from './document-list/DocumentList';
import FileUpload from './file-upload/FileUpload';
import NotificationBell from './notification/NotificationBell';

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <Header />
        <NotificationBell />
        <FileUpload />
        <DocumentList />
      </Container>
    </div>
  );
}

export default App;
