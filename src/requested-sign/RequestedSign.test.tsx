
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentList from '../document-list/DocumentList';
import { act as actHook } from '@testing-library/react';
import { useAppStore } from '../store';
import { RequestedSign } from '../store/types';

// To allow test with custom data
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

test('one rquested document with Declined status', () => {

  const mockedSign = {
    id: '',
    signedRequestAt: null,
    signedAt: null,
    declinedAt: null
  };
  const mockRequestedSign: RequestedSign = {
    id: '1',
    emailCreator: 'pique@example.com',
    documentId: '3',
    email: 'testuser@example.com',
    declinedAt: new Date('2023-02-01T00:00:00.000Z'),
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const mockRequestedSign2: RequestedSign = {
    id: '2',
    emailCreator: 'pique@example.com',
    documentId: 'no-exist',
    email: 'testuser@example.com',
    declinedAt: null,
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const customUsers = [
    { name: 'Test User', email: 'testuser@example.com' },
    { name: 'Pique', email: 'pique@example.com' },
    { name: 'Shakira', email: 'shakira@example.com' },
  ];

  setupStoreForTest({
    documents: [
      {
        id: '1', name: 'Document 1', uploadedBy: 'user2',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '2', name: 'Document 2', uploadedBy: 'user3',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '3', name: 'Document 3', uploadedBy: 'pique@example.com',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document3.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '4', name: 'Document 4', uploadedBy: 'pepe',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
    ],
    users: customUsers,
    currentUser: { name: 'Test User', email: 'testuser@example.com' },
    requestedSigns: [mockRequestedSign, mockRequestedSign2],
  });

  render(<DocumentList />);
  const documentList = screen.getByLabelText(/Document list/i);
  expect(documentList).toBeInTheDocument();

  const noDocumentsText = screen.queryByText(/No documents available/i);
  expect(noDocumentsText).not.toBeInTheDocument();

  const documentTitle = screen.getByText(/Test User's Documents/i);
  expect(documentTitle).toBeInTheDocument();
  const documentItems = screen.queryAllByRole('listitem', { name: /Document/i });
  expect(documentItems.length).toBe(1);

  // Document 3 has been requested to sign for this user so it has to be shown
  const documentItem3 = screen.getByText(/Document 3/i);
  expect(documentItem3).toBeInTheDocument();

  // Debugging output for the rendered document list
  const uploadedBy = screen.getByText(/by Pique\(pique@example\.com\)/i);
  expect(uploadedBy).toBeInTheDocument();

  //Buttons diabled
  expect(screen.getByLabelText('Status')).toBeInTheDocument();
  expect(screen.getByText('Declined')).toBeInTheDocument();
  const signBtn = screen.queryByLabelText('Sign document');
  expect(signBtn).toBeDisabled();
  const declineBtn = screen.queryByLabelText('Decline document');
  expect(declineBtn).toBeDisabled();
  const requestButton = screen.queryByRole('Request sign document');
  expect(requestButton).not.toBeInTheDocument();
});

test('one requested document PENDING, then click on SIGN', async () => {

  const mockedSign = {
    id: '',
    signedRequestAt: null,
    signedAt: null,
    declinedAt: null
  };
  const mockRequestedSign: RequestedSign = {
    id: '1',
    emailCreator: 'pique@example.com',
    documentId: '3',
    email: 'testuser@example.com',
    declinedAt: null,
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const mockRequestedSign2: RequestedSign = {
    id: '2',
    emailCreator: 'pique@example.com',
    documentId: 'no-exist',
    email: 'testuser@example.com',
    declinedAt: null,
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const customUsers = [
    { name: 'Test User', email: 'testuser@example.com' },
    { name: 'Pique', email: 'pique@example.com' },
    { name: 'Shakira', email: 'shakira@example.com' },
  ];

  setupStoreForTest({
    documents: [
      {
        id: '1', name: 'Document 1', uploadedBy: 'pique@example.com',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '2', name: 'Document 2', uploadedBy: 'user3',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '3', name: 'Document 3', uploadedBy: 'pique@example.com',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document3.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '4', name: 'Document 4', uploadedBy: 'pepe',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
    ],
    users: customUsers,
    currentUser: { name: 'Test User', email: 'testuser@example.com' },
    requestedSigns: [mockRequestedSign, mockRequestedSign2],
  });

  render(<DocumentList />);
  const documentList = screen.getByLabelText(/Document list/i);
  expect(documentList).toBeInTheDocument();

  const noDocumentsText = screen.queryByText(/No documents available/i);
  expect(noDocumentsText).not.toBeInTheDocument();

  const documentTitle = screen.getByText(/Test User's Documents/i);
  expect(documentTitle).toBeInTheDocument();
  const documentItems = screen.queryAllByRole('listitem', { name: /Document/i });
  expect(documentItems.length).toBe(1);

  // Document 3 has been requested to sign for this user so it has to be shown
  const documentItem3 = screen.getByText(/Document 3/i);
  expect(documentItem3).toBeInTheDocument();

  // Debugging output for the rendered document list
  const uploadedBy = screen.getByText(/by Pique\(pique@example\.com\)/i);
  expect(uploadedBy).toBeInTheDocument();

  //Buttons diabled
  expect(screen.getByLabelText('Status')).toBeInTheDocument();
  expect(screen.getByText('Pending')).toBeInTheDocument();
  const signBtn = screen.getByLabelText('Sign document');
  expect(signBtn).toBeInTheDocument();
  const declineBtn = screen.getByLabelText('Decline document');
  expect(declineBtn).not.toBeDisabled();

  //SIGN BTN
  await userEvent.click(signBtn);
  waitFor(() => {
    const statusText = screen.getByText('Declined');
    expect(statusText).toBeInTheDocument();
  });

  expect(signBtn).toBeDisabled();
  expect(declineBtn).toBeDisabled();


});

test('one requested document PENDING, then click on DECLINE', async () => {

  const mockedSign = {
    id: '',
    signedRequestAt: null,
    signedAt: null,
    declinedAt: null
  };
  const mockRequestedSign: RequestedSign = {
    id: '1',
    emailCreator: 'pique@example.com',
    documentId: '3',
    email: 'testuser@example.com',
    declinedAt: null,
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const mockRequestedSign2: RequestedSign = {
    id: '2',
    emailCreator: 'pique@example.com',
    documentId: 'no-exist',
    email: 'testuser@example.com',
    declinedAt: null,
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const customUsers = [
    { name: 'Test User', email: 'testuser@example.com' },
    { name: 'Pique', email: 'pique@example.com' },
    { name: 'Shakira', email: 'shakira@example.com' },
  ];

  setupStoreForTest({
    documents: [
      {
        id: '1', name: 'Document 1', uploadedBy: 'user2',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '2', name: 'Document 2', uploadedBy: 'user3',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '3', name: 'Document 3', uploadedBy: 'pique@example.com',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document3.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '4', name: 'Document 4', uploadedBy: 'pepe',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
    ],
    users: customUsers,
    currentUser: { name: 'Test User', email: 'testuser@example.com' },
    requestedSigns: [mockRequestedSign, mockRequestedSign2],
  });

  render(<DocumentList />);
  const documentList = screen.getByLabelText(/Document list/i);
  expect(documentList).toBeInTheDocument();

  const noDocumentsText = screen.queryByText(/No documents available/i);
  expect(noDocumentsText).not.toBeInTheDocument();

  const documentTitle = screen.getByText(/Test User's Documents/i);
  expect(documentTitle).toBeInTheDocument();
  const documentItems = screen.queryAllByRole('listitem', { name: /Document/i });
  expect(documentItems.length).toBe(1);

  // Document 3 has been requested to sign for this user so it has to be shown
  const documentItem3 = screen.getByText(/Document 3/i);
  expect(documentItem3).toBeInTheDocument();

  // Debugging output for the rendered document list
  const uploadedBy = screen.getByText(/by Pique\(pique@example\.com\)/i);
  expect(uploadedBy).toBeInTheDocument();

  //Buttons diabled
  expect(screen.getByLabelText('Status')).toBeInTheDocument();
  expect(screen.getByText('Pending')).toBeInTheDocument();
  const signBtn = screen.queryByLabelText('Sign document');
  expect(signBtn).not.toBeDisabled();
  const declineBtn = screen.getByLabelText('Decline document');
  expect(declineBtn).not.toBeDisabled();
  const requestButton = screen.queryByRole('Request sign document');
  expect(requestButton).not.toBeInTheDocument();

  //DECLINE BTN
  actHook(() => {
    userEvent.click(declineBtn);
  });
  await waitFor(() => {
    const statusText = screen.getByText('Declined');
    expect(statusText).toBeInTheDocument();
  });

  expect(signBtn).toBeDisabled();
  expect(declineBtn).toBeDisabled();
});