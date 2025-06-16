import React, {useState, useMemo} from 'react';
import {
  IconButton,
  Badge,
  Menu,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import NotificationList from './NotificationList';
import { useAppStore } from '../store';

const NotificationBell = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const notifications = useAppStore((state) => state.notifications);
  const getNotificationsByEmail = useAppStore((state) => state.getNotificationsByEmail);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openNotificationMenu = Boolean(anchorEl);

  const unreadNotificationsCount = useMemo(() => {
    const userNotifs = getNotificationsByEmail(currentUser.email);
    return userNotifs.filter(notif => !notif.read).length;
  }, [notifications, currentUser]);

  const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label={`show ${unreadNotificationsCount} new notifications`}
        color="inherit"
        onClick={handleOpenNotificationMenu}
      >
        <Badge badgeContent={unreadNotificationsCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={openNotificationMenu}
        onClose={handleCloseNotificationMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: '35ch',
          },
        }}
      >
        <NotificationList />
      </Menu>
    </>
  );
};

export default NotificationBell;