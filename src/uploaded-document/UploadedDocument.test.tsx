import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { act as actHook } from '@testing-library/react';
import { useAppStore } from '../store';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
import UploadedDocument from './UploadedDocument';
import { Document, Sign, RequestedSign } from '../store/types';

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


test('renders the document details correctly', () => {
  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: null
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);
  expect(screen.getByText('Filename: ' + mockDocument.name)).toBeInTheDocument();
  expect(screen.getByText('Uploaded on: 1/10/23, 2:00')).toBeInTheDocument();
  expect(screen.getByLabelText('Document')).toBeInTheDocument();

  expect(screen.getByLabelText('View document')).toBeInTheDocument();
  expect(screen.getByLabelText('Sign document')).toBeInTheDocument();
  expect(screen.getByLabelText('Request sign document')).toBeInTheDocument();
  expect(screen.getByLabelText('Decline document')).toBeInTheDocument();

  expect(screen.getByLabelText('Status')).toBeInTheDocument();
  expect(screen.getByText('Pending')).toBeInTheDocument();

});

test('Status Signed', () => {
  const mockedSign: Sign = {
    id: '1',
    signedAt: new Date('2023-10-01T00:00:00.000Z'),
    declinedAt: null
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);

  expect(screen.getByLabelText('Status')).toBeInTheDocument();
  expect(screen.getByText('Signed')).toBeInTheDocument();
  const signBtn = screen.queryByLabelText('Sign document');
  expect(signBtn).toBeDisabled();
  const declineBtn = screen.queryByLabelText('Decline document');
  expect(declineBtn).toBeDisabled();

});

test('Status Declined', () => {
  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: new Date('2023-10-01T00:00:00.000Z'),
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);

  expect(screen.getByLabelText('Status')).toBeInTheDocument();
  expect(screen.getByText('Declined')).toBeInTheDocument();
  const signBtn = screen.queryByLabelText('Sign document');
  expect(signBtn).toBeDisabled();
  const declineBtn = screen.queryByLabelText('Decline document');
  expect(declineBtn).toBeDisabled();

});

test('toggles document view correctly', () => {
  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: null,
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);

  const viewButton = screen.getByLabelText('View document');
  expect(viewButton).toBeInTheDocument();
  expect(screen.queryByTitle(mockDocument.name)).not.toBeInTheDocument();

  act(() => {
    viewButton.click();
  });
  waitFor(() => {
    expect(screen.getByTitle(mockDocument.name)).toBeInTheDocument();
  });

  act(() => {
    viewButton.click();
  });
  expect(screen.queryByTitle(mockDocument.name)).not.toBeInTheDocument();
});

test('handles request sign form and email validation', () => {
  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: null,
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);

  const requestButton = screen.getByLabelText('Request sign document');
  expect(requestButton).toBeInTheDocument();
  expect(screen.queryByText('Enter email to request signature:')).not.toBeInTheDocument();

  act(() => {
    fireEvent.click(requestButton);
  });

  expect(screen.getByText('Enter email to request signature:')).toBeInTheDocument();
  const emailInput = screen.getByPlaceholderText('Enter email');
  expect(emailInput).toBeInTheDocument();
  const sendButton = screen.getByLabelText('Send request');
  expect(sendButton).toBeDisabled();

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  expect(emailInput).toHaveValue('invalid-email');
  waitFor(() => {
    expect(screen.queryByText('Invalid email address')).toBeInTheDocument();
  });

  fireEvent.change(emailInput, { target: { value: 'validemail@example.com' } });
  expect(emailInput).toHaveValue('validemail@example.com');
  waitFor(() => {
    expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
  });

  expect(sendButton).not.toBeDisabled();


  act(() => {
    fireEvent.click(sendButton);
  });
  waitFor(() => {
    expect(screen.getByText('Request sent successfully')).toBeInTheDocument();
  });

  waitFor(() => {
    expect(screen.getByText('Request sent successfully')).not.toBeInTheDocument();
  });

});

test('Test that after tome out success message disappears', async () => {
  jest.useFakeTimers();
  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: null,
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);

  const requestButton = screen.getByLabelText('Request sign document');
  act(() => {
    fireEvent.click(requestButton);
  });

  const emailInput = screen.getByPlaceholderText('Enter email');
  const sendButton = screen.getByLabelText('Send request');

  fireEvent.change(emailInput, { target: { value: 'validemail@example.com' } });
  expect(emailInput).toHaveValue('validemail@example.com');
  expect(sendButton).not.toBeDisabled();

  act(() => {
    fireEvent.click(sendButton);
  });

  const successMessage = screen.queryByText('Request sent successfully');
  expect(successMessage).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  const emailPrompt = screen.queryByText('Enter email to request signature:');
  expect(successMessage).not.toBeInTheDocument();
  expect(emailPrompt).not.toBeInTheDocument();

  jest.useRealTimers();
});

test('handles tab change correctly', () => {
  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: null,
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);

  const documentDetailsTab = screen.getByText('Document Details');
  const signRequestsTab = screen.getByText('Sign Requests');

  // Initially, the first tab should be active
  expect(screen.getByText('Document Details')).toBeInTheDocument();
  expect(screen.queryByText('Sign Request History')).not.toBeInTheDocument();

  // Switch to the second tab
  act(() => {
    fireEvent.click(signRequestsTab);
  });

  waitFor(() => {
    expect(screen.getByText('Sign Request History')).toBeInTheDocument();
    expect(screen.queryByText('Document Details')).not.toBeInTheDocument();
  });

  // Switch back to the first tab
  act(() => {
    fireEvent.click(documentDetailsTab);
  });

  waitFor(() => {
    expect(screen.getByText('Document Details')).toBeInTheDocument();
    expect(screen.queryByText('Sign Request History')).not.toBeInTheDocument();
    expect(screen.getByText('No sign requests made yet.')).toBeInTheDocument();
  });
});

test('renders requested Sign dates correctly', () => {

  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: null,
  };

  const mockRequestedSign: RequestedSign = {
    id: '1',
    email: '123',
    documentId: '1',
    email: 'test@example.com',
    declinedAt: new Date('2023-10-09T00:00:00.000Z'),
    requestedAt: new Date('2023-02-01T00:00:00.000Z'),
    signedAt: new Date('2023-10-21T00:00:00.000Z'),
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  setupStoreForTest({
    documents: [mockDocument],
    requestedSigns: [mockRequestedSign],
    currentUser: { id: '123', name: 'Test User', email: 'testuser@example.com' },
  });

  render(<UploadedDocument {...mockDocument} />);

  const signRequestsTab = screen.getByText('Sign Requests');
  act(() => {
    fireEvent.click(signRequestsTab);
  });

  waitFor(() => {
    expect(screen.getByText('Sign Request History')).toBeInTheDocument();
    expect(screen.queryByText('Document Details')).not.toBeInTheDocument();
  });

  expect(screen.getByText('Requested on:')).toBeInTheDocument();
  expect(screen.getByText(/1\/2\/23/i)).toBeInTheDocument();
  expect(screen.getByText('Declined on:')).toBeInTheDocument();
  expect(screen.getByText(/9\/10\/23/i)).toBeInTheDocument();
  expect(screen.getByText('Signed on:')).toBeInTheDocument();
  expect(screen.getByText(/21\/10\/23/i)).toBeInTheDocument();
});

test('renders requested Sign without dates', () => {

  const mockedSign: Sign = {
    id: '1',
    signedAt: null,
    declinedAt: null,
  };

  const mockRequestedSign: RequestedSign = {
    id: '1',
    email: '123',
    documentId: '1',
    email: 'test@example.com',
    declinedAt: null,
    requestedAt: null,
    signedAt: null,
  };

  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    uploadedAt: new Date('2023-10-01T00:00:00.000Z'),
    uploadedBy: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  setupStoreForTest({
    documents: [mockDocument],
    requestedSigns: [mockRequestedSign],
    currentUser: { id: '123', name: 'Test User', email: 'testuser@example.com' },
  });

  render(<UploadedDocument {...mockDocument} />);

  const signRequestsTab = screen.getByText('Sign Requests');
  act(() => {
    fireEvent.click(signRequestsTab);
  });

  waitFor(() => {
    expect(screen.getByText('Sign Request History')).toBeInTheDocument();
    expect(screen.queryByText('Document Details')).not.toBeInTheDocument();
  });

  expect(screen.queryByText('Requested on:')).not.toBeInTheDocument();
  expect(screen.queryByText('Declined on:')).not.toBeInTheDocument();
  expect(screen.queryByText('Signed on:')).not.toBeInTheDocument();
});
