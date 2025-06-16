import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationItem from './Notification';
import { Notification } from '../store/types';

describe('NotificationItem Component', () => {
  const mockOnMarkAsRead = jest.fn();

  const mockNotification: Notification = {
    id: '1',
    emailCreator: 'creator@example.com',
    email: 'recipient@example.com',
    type: 'Request',
    date: new Date(),
    documentId: 'doc123',
    read: false,
  };

  it('renders the correct message based on notification type', () => {
    render(
      <NotificationItem notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} />
    );

    const messageElement = screen.getByText(/New signature request from creator@example.com./);
    expect(messageElement).toBeInTheDocument();
  });

  it('renders the correct secondary text', () => {
    render(
      <NotificationItem notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} />
    );

    const secondaryText = screen.getByText(
      `To: recipient@example.com • ${new Date(mockNotification.date).toLocaleString()}`
    );
    expect(secondaryText).toBeInTheDocument();
  });

  it('calls onMarkAsRead when the notification is clicked', () => {
    render(
      <NotificationItem notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} />
    );

    const listItem = screen.getByRole('listitem');
    fireEvent.click(listItem);

    expect(mockOnMarkAsRead).toHaveBeenCalledWith(mockNotification.id);
  });

  it('does not call onMarkAsRead when the notification is already read', () => {
    const readNotification = { ...mockNotification, read: true };
    render(
      <NotificationItem notification={readNotification} onMarkAsRead={mockOnMarkAsRead} />
    );

    const listItem = screen.getByRole('listitem');
    fireEvent.click(listItem);

    expect(mockOnMarkAsRead).not.toHaveBeenCalled();
  });

  it('renders the mark as read button when the notification is unread', () => {
    render(
      <NotificationItem notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} />
    );

    const markAsReadButton = screen.getByLabelText('Mark as read');
    expect(markAsReadButton).toBeInTheDocument();
  });

  it('does not render the mark as read button when the notification is read', () => {
    const readNotification = { ...mockNotification, read: true };
    render(
      <NotificationItem notification={readNotification} onMarkAsRead={mockOnMarkAsRead} />
    );

    const markAsReadButton = screen.queryByLabelText('mark as read');
    expect(markAsReadButton).not.toBeInTheDocument();
  });

  it('calls onMarkAsRead when the mark as read button is clicked', () => {
    render(
      <NotificationItem notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} />
    );

    const markAsReadButton = screen.getByLabelText('Mark as read');
    fireEvent.click(markAsReadButton);

    expect(mockOnMarkAsRead).toHaveBeenCalledWith(mockNotification.id);
  });
});