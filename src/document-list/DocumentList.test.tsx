
import React from 'react';
import { render, screen} from '@testing-library/react';
import DocumentList from './DocumentList';
import { act as actHook } from '@testing-library/react';
import { useAppStore } from '../store';

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
        id: '3', name: 'Document 3', uploadedByUserId: 'user2',
        uploadedAt: new Date(),
        file: new File(['valid content'], 'document1.pdf', { type: 'application/pdf' }),
        sign: mockedSign,
      },
    ],
    currentUser: { id: 'user1', name: 'Test User', email: 'testuser@example.com' },
  });

  render(<DocumentList />);
  const documentList = screen.getByLabelText(/Document list/i);
  expect(documentList).toBeInTheDocument();

  const noDocumentsText = screen.queryByText(/No documents available/i);
  expect(noDocumentsText).not.toBeInTheDocument();

  const documentTitle = screen.getByText(/Test User's Documents/i);
  expect(documentTitle).toBeInTheDocument();
  const documentItems = screen.queryAllByRole('listitem', { name: /Document/i });
  expect(documentItems.length).toBe(2);

  const documentItem = screen.getByText(/Document 1/i);
  expect(documentItem).toBeInTheDocument();
  const documentItem2 = screen.getByText(/Document 2/i);
  expect(documentItem2).toBeInTheDocument();

  // Document 3 is not uploaded by the current user, so it should not be displayed
  const documentItem3 = screen.queryByText(/Document 3/i);
  expect(documentItem3).not.toBeInTheDocument();
});