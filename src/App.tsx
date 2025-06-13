import React from 'react';
import { Container } from '@mui/material';
import Header from './header/Header';
import DocumentList from './document-list/DocumentList';

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <Header />
        <DocumentList />
      </Container>
    </div>
  );
}

export default App;
