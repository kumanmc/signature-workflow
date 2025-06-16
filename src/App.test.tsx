import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act as actHook } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { useAppStore } from './store';
import { User, Notification } from './store/types';

const setupStoreForTest = (partialState?: Partial<ReturnType<typeof useAppStore.getState>>) => {
  actHook(() => {
    useAppStore.getState().resetAllSlices();

    if (partialState) {
      useAppStore.setState(partialState);
    }
  });
};

// We'll reset the store before each test to ensure test isolation
beforeEach(() => {
  actHook(() => {
    useAppStore.getState().resetAllSlices();
  });
});

afterEach(() => {
  actHook(() => {
    useAppStore.getState().resetAllSlices();
  });
});


test('Integration test uploading documents: displays uploaded documents and updates state', async () => {
  const currentUserForTest: User = { name: 'TestUser', email: 'test@example.com' };
  setupStoreForTest({ currentUser: currentUserForTest });

  render(<App />);

  const fileInputElement = screen.getByTestId('dropzone-input');
  if (!fileInputElement) throw new Error("Dropzone input element not found in App.tsx render.");

  const MIN_PDF_CONTENT = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x25, 0x45, 0x4F, 0x46]);
  const MIN_TXT_CONTENT = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
  const uploadedDocument1 = new File([MIN_PDF_CONTENT], 'MyDocument1.pdf', { type: 'application/pdf' });
  const uploadedDocument2 = new File([MIN_TXT_CONTENT], 'AnotherDoc.txt', { type: 'text/plain' });

  await userEvent.upload(fileInputElement, [uploadedDocument1, uploadedDocument2]);

  await waitFor(() => {
    const noDocumentsText = screen.queryByText(/No documents available/i);
    expect(noDocumentsText).not.toBeInTheDocument();

    const documentTitle = screen.getByText(new RegExp(`${currentUserForTest.name}'s Documents`, 'i'));
    expect(documentTitle).toBeInTheDocument();

    const documentItems = screen.queryAllByRole('listitem');
    expect(documentItems).toHaveLength(2);

    const docItem1 = screen.getByText(/MyDocument1.pdf/i);
    const docItem2 = screen.getByText(/AnotherDoc.txt/i);

    expect(docItem1).toBeInTheDocument();
    expect(docItem2).toBeInTheDocument();

    expect(screen.getAllByText('Pending')).toHaveLength(2);

  });

});


test('Integration test: Decline document', async () => {
  const currentUserForTest: User = { name: 'TestUser', email: 'test@example.com' };
  setupStoreForTest({ currentUser: currentUserForTest });

  render(<App />);

  const fileInputElement = screen.getByTestId('dropzone-input');
  if (!fileInputElement) throw new Error("Dropzone input element not found in App.tsx render.");

  const MIN_PDF_CONTENT = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x25, 0x45, 0x4F, 0x46]);
  const MIN_TXT_CONTENT = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
  const uploadedDocument1 = new File([MIN_PDF_CONTENT], 'MyDocument1.pdf', { type: 'application/pdf' });
  const uploadedDocument2 = new File([MIN_TXT_CONTENT], 'AnotherDoc.txt', { type: 'text/plain' });

  await userEvent.upload(fileInputElement, [uploadedDocument1, uploadedDocument2]);
  await waitFor(() => {
    const noDocumentsText = screen.queryByText(/No documents available/i);
    expect(noDocumentsText).not.toBeInTheDocument();

    const documentTitle = screen.getByText(new RegExp(`${currentUserForTest.name}'s Documents`, 'i'));
    expect(documentTitle).toBeInTheDocument();

    const documentItems = screen.queryAllByRole('listitem');
    expect(documentItems).toHaveLength(2);

    const docItem1 = screen.getByText(/MyDocument1.pdf/i);

    expect(docItem1).toBeInTheDocument();

    expect(screen.getAllByText('Pending')).toHaveLength(2);

  });

  const declineBtn = screen.getAllByRole('button', { name: /Decline document/i });
  expect(declineBtn).toHaveLength(2);

  const signBtn = screen.queryAllByRole('button', { name: 'Sign document' });
  expect(signBtn).toHaveLength(2);

  await userEvent.click(declineBtn[0]);
  await waitFor(() => {
    const statusText = screen.getByText('Declined');
    expect(statusText).toBeInTheDocument();
  });

  expect(signBtn[0]).toBeDisabled();
  expect(declineBtn[0]).toBeDisabled();


});

test('Integration test: Sign document', async () => {
  const currentUserForTest: User = { name: 'TestUser', email: 'test@example.com' };
  setupStoreForTest({ currentUser: currentUserForTest });

  render(<App />);

  const fileInputElement = screen.getByTestId('dropzone-input');
  if (!fileInputElement) throw new Error("Dropzone input element not found in App.tsx render.");

  const MIN_PDF_CONTENT = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x25, 0x45, 0x4F, 0x46]);
  const MIN_TXT_CONTENT = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
  const uploadedDocument1 = new File([MIN_PDF_CONTENT], 'MyDocument1.pdf', { type: 'application/pdf' });
  const uploadedDocument2 = new File([MIN_TXT_CONTENT], 'AnotherDoc.txt', { type: 'text/plain' });

  await userEvent.upload(fileInputElement, [uploadedDocument1, uploadedDocument2]);
  await waitFor(() => {
    const noDocumentsText = screen.queryByText(/No documents available/i);
    expect(noDocumentsText).not.toBeInTheDocument();

    const documentTitle = screen.getByText(new RegExp(`${currentUserForTest.name}'s Documents`, 'i'));
    expect(documentTitle).toBeInTheDocument();

    const documentItems = screen.queryAllByRole('listitem');
    expect(documentItems).toHaveLength(2);

    const docItem1 = screen.getByText(/MyDocument1.pdf/i);

    expect(docItem1).toBeInTheDocument();

    expect(screen.getAllByText('Pending')).toHaveLength(2);

  });

  const declineBtn = screen.getAllByRole('button', { name: /Decline document/i });
  expect(declineBtn).toHaveLength(2);

  const signBtn = screen.queryAllByRole('button', { name: 'Sign document' });
  expect(signBtn).toHaveLength(2);

  await userEvent.click(signBtn[0]);
  await waitFor(() => {
    const statusText = screen.getByText('Signed');
    expect(statusText).toBeInTheDocument();
  });

  expect(signBtn[0]).toBeDisabled();
  expect(declineBtn[0]).toBeDisabled();


});

test('Integration test: Notifications for document actions', async () => {
  const currentUserForTest: User = { name: 'TestUser', email: 'test@example.com' };
  const initialNotifications = [
    {
      id: 'notif-001',
      emailCreator: 'sender@example.com',
      email: 'test@example.com',
      type: 'Request',
      date: new Date('2025-06-15T10:00:00Z'),
      documentId: 'doc-abc-123',
      read: false,
    },
    {
      id: 'notif-002',
      emailCreator: 'signer@example.com',
      email: 'test@example.com',
      type: 'Sign',
      date: new Date('2025-06-16T14:30:00Z'),
      documentId: 'doc-def-456',
      read: false,
    },
    {
      id: 'notif-003',
      emailCreator: 'decliner@example.com',
      email: 'test@example.com',
      type: 'Decline',
      date: new Date('2025-06-17T09:15:00Z'),
      documentId: 'doc-ghi-789',
      read: false,
    },
  ] as Notification[];

  setupStoreForTest({ currentUser: currentUserForTest, notifications: initialNotifications });

  render(<App />);
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /show 3 new notifications/i })).toBeInTheDocument();
  });

  expect(screen.queryByRole('list', { name: /My notifications/i })).not.toBeInTheDocument();
  const bellButton = screen.getByRole('button', { name: /show 3 new notifications/i });

  await actHook(async () => {
    await userEvent.click(bellButton);
  });

  expect(screen.getByRole('heading', { name: /My Notifications/i })).toBeInTheDocument();

  const notification1 = screen.getByText(/New signature request from sender@example.com/i);
  const notification2 = screen.getByText(/Document signed by signer@example.com/i);
  expect(notification1).toBeInTheDocument();
  expect(notification2).toBeInTheDocument();

  const markAsReadButtons = screen.getAllByRole('button', { name: /Mark as read/i });

  await actHook(async () => {
    userEvent.click(markAsReadButtons[0]);
  });
  await waitFor(() => {
    expect(screen.getByLabelText('show 2 new notifications')).toBeInTheDocument();
  });
  const clearAllButton = screen.getByRole('button', { name: /clear all notifications/i });

  await actHook(async () => {
    await userEvent.click(clearAllButton);
  });

  await waitFor(() => {
    expect(screen.getByLabelText('show 0 new notifications')).toBeInTheDocument();
  });

  const menuElement = screen.getByRole('menu');
  expect(menuElement).toBeInTheDocument();
  menuElement.focus();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => {
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.queryByRole('list', { name: /My notifications/i })).not.toBeInTheDocument();
  });
});
