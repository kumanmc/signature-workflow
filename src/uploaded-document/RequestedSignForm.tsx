import React from "react";
import { Grid, Box, Alert, Typography, TextField, Button } from "@mui/material";

const RequestSignForm = ({
  showSuccessMessage,
  email,
  setEmail,
  handleSendRequest,
}: {
  showSuccessMessage: boolean;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  handleSendRequest: () => void;
}) => (
  <Grid size={{ xs: 12 }}>
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: '1rem',
          width: '100%',
        }}
      >
        {showSuccessMessage ? (
          // Display the Alert component when showSuccessMessage is true
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Request sent successfully
          </Alert>
        ) : (
          <React.Fragment>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Enter email to request signature:
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSendRequest();
              }}
            >
              <TextField
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Enter email"
                required
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                  flex: 1,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                aria-label="Send request"
                disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Send
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </React.Fragment>
  </Grid>
);

export default RequestSignForm;