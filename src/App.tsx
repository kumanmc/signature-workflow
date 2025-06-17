import React from 'react';
import { Container } from '@mui/material';
import Header from './header/Header';
import DocumentList from './document-list/DocumentList';
import FileUpload from './file-upload/FileUpload';
import NotificationBell from './notification/NotificationBell';
import UserInfo from './notification/UserInfo';

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <Header />
        <UserInfo />
        <FileUpload />
        <DocumentList />
      </Container>
    </div>
  );
}

export default App;
