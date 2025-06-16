import React from 'react';
import {
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { Notification } from '../store/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const { id, emailCreator, email, type, date, read } = notification;

  let message = '';
  let messageColor = 'text.primary';
  const notificationBackgroundColor = read ? 'background.paper' : 'primary.light';
  const notificationShadow = read ? 'none' : '0px 2px 4px rgba(0,0,0,0.1)';

  switch (type) {
    case 'Request':
      message = `New signature request from ${emailCreator}.`;
      messageColor = 'info.dark';
      break;
    case 'Sign':
      message = `Document signed by ${emailCreator}.`;
      messageColor = 'success.dark';
      break;
    case 'Decline':
      message = `Document declined by ${emailCreator}.`;
      messageColor = 'error.dark';
      break;
  }

  return (
    <ListItem
      aria-label='Notification'
      sx={{
        backgroundColor: notificationBackgroundColor,
        borderRadius: '8px',
        mb: 1,
        boxShadow: notificationShadow,
        transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: read ? 'action.hover' : 'primary.lighter',
        },
      }}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <ListItemText
        primary={
          <Typography variant="body1" sx={{ fontWeight: read ? 'normal' : 'bold', color: messageColor }}>
            {message}
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {`To: ${email} • ${new Date(date).toLocaleString()}`}
          </Typography>
        }
      />
      {!read && (
        <IconButton
          edge="end"
          aria-label="Mark as read"
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead(id);
          }}
          sx={{ color: 'primary.main' }}
        >
          <CheckCircleOutlineIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

export default NotificationItem;