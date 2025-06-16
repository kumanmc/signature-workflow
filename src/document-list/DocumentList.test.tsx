
import React from 'react';
import { render, screen} from '@testing-library/react';
import DocumentList from './DocumentList';
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

test('Show list without documents', () => {

  setupStoreForTest({
    documents: [],
  });

  render(<DocumentList />);
  const documentList = screen.getByLabelText(/Document list/i);
  expect(documentList).toBeInTheDocument();

  const noDocumentsText = screen.getByText(/No documents available/i);
  expect(noDocumentsText).toBeInTheDocument();

  const documentItems = screen.queryAllByRole('listitem');
  expect(documentItems.length).toBe(0);
});

test('Show list with documents', () => {

  const mockedSign = {
    id: '',
    signedRequestAt: null,
    signedAt: null,
    declinedAt: null
  };
  const mockRequestedSign: RequestedSign = {
    id: '1',
    userId: '2',
    documentId: '3',
    email: 'testuser@example.com',
    declinedAt: null,
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const mockRequestedSign2: RequestedSign = {
    id: '2',
    userId: '2',
    documentId: 'no-exist',
    email: 'testuser@example.com',
    declinedAt: null,
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: null,
  };
  const customUsers = [
    { id: 'user1', name: 'Test User', email: 'testuser@example.com' },
    { id: '2', name: 'Pique', email: 'pique@example.com' },
    { id: '3', name: 'Shakira', email: 'shakira@example.com' },
  ];

  setupStoreForTest({
    documents: [
      {
        id: '1', name: 'Document 1', uploadedByUserId: 'user1',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '2', name: 'Document 2', uploadedByUserId: 'user1',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '3', name: 'Document 3', uploadedByUserId: '2',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document3.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
      {
        id: '4', name: 'Document 4', uploadedByUserId: 'pepe',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
    ],
    users: customUsers,
    currentUser: { id: 'user1', name: 'Test User', email: 'testuser@example.com' },
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
  expect(documentItems.length).toBe(3);

  // Document 3 has been requested to sign for this user so it has to be shown
  const documentItem = screen.getByText(/Document 1/i);
  expect(documentItem).toBeInTheDocument();
  const documentItem2 = screen.getByText(/Document 2/i);
  expect(documentItem2).toBeInTheDocument();
  const documentItem3 = screen.getByText(/Document 3/i);
  expect(documentItem3).toBeInTheDocument();

  // Debugging output for the rendered document list
  const uploadedBy = screen.getByText(/by Pique\(pique@example\.com\)/i);
  expect(uploadedBy).toBeInTheDocument();

  // Document 4 is not uploaded by the current user, so it should not be displayed
  const documentItem4 = screen.queryByText(/Document 4/i);
  expect(documentItem4).not.toBeInTheDocument();
});
