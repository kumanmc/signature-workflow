import React from 'react';
import { Box, Typography, List, Button, Divider } from '@mui/material';
import { useAppStore } from '../store/index';
import NotificationItem from './Notification';
import { Notification } from '../store/types';

const NotificationList = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const getNotificationsByEmail = useAppStore((state) => state.getNotificationsByEmail);
  const markAsRead = useAppStore((state) => state.markAsRead);
  const clearNotificationsByEmail = useAppStore((state) => state.clearNotificationsByEmail);
  const userNotifications = getNotificationsByEmail(currentUser.email);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleResetNotifications = () => {
    clearNotificationsByEmail(currentUser.email);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
      <Typography variant="h5" gutterBottom>My Notifications</Typography>

      {userNotifications.length === 0 ? (
        <Typography variant="body1" color="text.secondary">You have no new notifications.</Typography>
      ) : (
        <List>
          {userNotifications.map((notification: Notification) => (
            <React.Fragment key={notification.id}>
              <NotificationItem
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
              <Divider sx={{ my: 1 }} />
            </React.Fragment>
          ))}
        </List>
      )}

      {userNotifications.length > 0 && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetNotifications}
          sx={{ mt: 2 }}
        >
          Clear All Notifications
        </Button>
      )}
    </Box>
  );
};

export default NotificationList;