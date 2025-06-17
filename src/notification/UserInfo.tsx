import { Typography, Box } from "@mui/material";
import NotificationBell from "./NotificationBell";
import { useAppStore } from "../store";

function UserInfo() {
  const currentUser = useAppStore((state) => state.currentUser);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        padding: '0.5rem 1.5rem',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="h6" component="h1">
        Signature Workflow
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="h1" sx={{ marginRight: 2 }}>
          Hi {currentUser.name}!
        </Typography>
        <NotificationBell />
      </Box>
    </Box>
  );
}

export default UserInfo;