import React from 'react';
import Header from './header/Header';
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
