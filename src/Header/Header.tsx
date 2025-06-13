import React from 'react';
import { useAppStore } from '../store/index';
import { Grid, Typography, TextField, Autocomplete, Box } from '@mui/material';
import { User } from '../store/types';

const Header = () => {

  const users = useAppStore((state) => state.users);
  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  const handleUserChange = (event: React.SyntheticEvent, userSelected: User) => {
    setCurrentUser(userSelected);
  };

  return (
    <Box component="header"
      sx={{
        backgroundColor: 'rgb(237, 237, 237)',
        color: 'white',
        mb: 5,
        textAlign: 'center'
      }}>
      <Typography
        sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}
        variant="h5"
        gutterBottom
      >Signature Workflow</Typography>
      <Typography
        sx={{ fontStyle: 'italic', color: '#333', mb: 2 }}
        variant="subtitle1"
        gutterBottom
      >
        Use the dropdown below to switch between users and simulate login/logout functionality.
      </Typography>
      <Grid container justifyContent="center" sx={{ mt: '4' }}>
        <Grid size={{xs:12, sm:8, md:6, lg:4 }}>
          <Autocomplete
            disableClearable
            id="user-selector"
            options={users}
            getOptionLabel={(option) => option.name + ' (' + option.email + ')'}
            value={currentUser}
            onChange={handleUserChange}
            renderInput={(params) => <TextField {...params} label="Select user" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Header;
