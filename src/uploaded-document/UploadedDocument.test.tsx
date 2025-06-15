import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
import UploadedDocument from './UploadedDocument';
import { Document, Sign } from '../store/types';

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
    uploadedByUserId: '123',
    file: new File([''], 'test-document.pdf', { type: 'application/pdf' }),
    sign: mockedSign,
  };

  render(<UploadedDocument {...mockDocument} />);
  expect(screen.getByText(mockDocument.name)).toBeInTheDocument();
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
    uploadedByUserId: '123',
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
    uploadedByUserId: '123',
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
    uploadedByUserId: '123',
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
