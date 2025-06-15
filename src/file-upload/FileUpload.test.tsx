import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { User } from '../store/types';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';
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


test('renders the file upload area correctly with default text', () => {
  render(<FileUpload />);
  expect(screen.getByText(/Upload New Document/i)).toBeInTheDocument();
  expect(screen.getByText(/Drag and drop some files here, or click to select files./i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Select Documents/i })).toBeInTheDocument();
});

test('changes style on drag over and reverts on drag leave', async () => {

  const currentUserForTest: User = { id: 'test-user-id', name: 'TestUser', email: 'test@example.com' };
  setupStoreForTest({ currentUser: currentUserForTest });
  render(<FileUpload />);

  const instructionText = screen.getByText(/Drag and drop some files here, or click to select files./i);
  const dropzonePaperElement = instructionText.closest('.MuiPaper-root'); // Busca el Paper usando su clase de MUI

  if (!dropzonePaperElement) {
    throw new Error("Dropzone Paper element not found. Check HTML structure.");
  }

  expect(dropzonePaperElement).toHaveStyle('background-color: rgb(250, 250, 250)'); // #fafafa en RGB
  expect(instructionText).toBeInTheDocument();

  await act(async () => { // Usar act de React
    fireEvent.dragEnter(dropzonePaperElement);
  });
  waitFor(() => {
    // Verifica que el color de fondo cambia a #e0e0e0 (rgb(224, 224, 224))
    expect(dropzonePaperElement).toHaveStyle('background-color: rgb(224, 224, 224)');
    expect(screen.getByText(/Drop the files here!/i)).toBeInTheDocument();

  });
  fireEvent.dragLeave(dropzonePaperElement);

  waitFor(() => {
    expect(dropzonePaperElement).toHaveStyle('background-color: rgb(250, 250, 250)'); // #fafafa
    expect(screen.getByText(/Drag and drop some files here, or click to select files./i)).toBeInTheDocument();
    expect(screen.queryByText(/Drop the files here!/i)).not.toBeInTheDocument();
  });
});

test('handles rejection and accept file', async () => {
  const currentUserForTest: User = { id: 'test-user-id', name: 'TestUser', email: 'test@example.com' };
  setupStoreForTest({ currentUser: currentUserForTest });
  render(<FileUpload />);

  const validPdf = new File(['valid content'], 'document.pdf', { type: 'application/pdf' });

  const largeFileContent = new ArrayBuffer(Math.ceil(1.5 * 1024 * 1024)); // 1.5MB
  const largeFile = new File([largeFileContent], 'Large.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

  const filesToUpload = [validPdf, largeFile];

  const fileInputElement = screen.getByTestId('dropzone-input');

  if (!fileInputElement) throw new Error("Dropzone input element not found. Ensure it has data-testid.");

  act(() => {
    userEvent.upload(fileInputElement, filesToUpload);
  });

  await waitFor(() => {
    expect(screen.getByText(/file-too-large/i)).toBeInTheDocument();
  });

  const closeButton = screen.getByRole('button', { name: /close-file-alert/i });

  act(() => {
    fireEvent.click(closeButton);
  });
  await waitFor(() => {
    expect(screen.queryByText(/file-too-large/i)).not.toBeInTheDocument();
  });

});

test('handles one file rejection', async () => {
  render(<FileUpload />);

  const largeFileContent = new ArrayBuffer(Math.ceil(1.5 * 1024 * 1024)); // 1.5MB
  const largeFile = new File([largeFileContent], 'Large.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

  const filesToUpload = [largeFile];

  const fileInputElement = screen.getByTestId('dropzone-input');

  if (!fileInputElement) throw new Error("Dropzone input element not found. Ensure it has data-testid.");

  act(() => {
    userEvent.upload(fileInputElement, filesToUpload);
  });

  await waitFor(() => {
    expect(screen.getByText(/file-too-large/i)).toBeInTheDocument();
  });

  const closeButton = screen.getByRole('button', { name: /close-file-alert/i });

  act(() => {
    fireEvent.click(closeButton);
  });
  await waitFor(() => {
    expect(screen.queryByText(/file-too-large/i)).not.toBeInTheDocument();
  });

});

