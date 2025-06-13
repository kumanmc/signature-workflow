import React from 'react';
import Header from './Header/Header';
import { Container } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <Header />
      </Container>
    </div>
  );
}

export default App;
