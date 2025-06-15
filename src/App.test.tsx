import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act as actHook } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { useAppStore } from './store';
import { User } from './store/types';

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
  const currentUserForTest: User = { id: 'test-user-id', name: 'TestUser', email: 'test@example.com' };
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
  const currentUserForTest: User = { id: 'test-user-id', name: 'TestUser', email: 'test@example.com' };
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
  const currentUserForTest: User = { id: 'test-user-id', name: 'TestUser', email: 'test@example.com' };
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
