// src/file-upload/FileUpload.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('FileUpload component', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });

  test('renders the file upload area correctly with default text', () => {
    render(<FileUpload />);
    expect(screen.getByText(/Upload New Document/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag and drop some files here, or click to select files./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Documents/i })).toBeInTheDocument();
  });

  test('changes style on drag over and reverts on drag leave', async () => {
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

  test('calls handleDocumentsUpload and logs for accepted files when dropped', async () => {
    render(<FileUpload />);

    const testFilePdf = new File(['pdf content'], 'document.pdf', { type: 'application/pdf' });
    const testFileTxt = new File(['text content'], 'notes.txt', { type: 'text/plain' });

    const fileInputElement = screen.getByTestId('dropzone-input');
    await userEvent.upload(fileInputElement, [testFilePdf, testFileTxt]); // Upload directly to the input

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Files ready:', [testFilePdf, testFileTxt]);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  test('handles rejection and accept file', async () => {
    render(<FileUpload />);

    const validPdf = new File(['valid content'], 'document.pdf', { type: 'application/pdf' });

    const largeFileContent = new ArrayBuffer(Math.ceil(1.5 * 1024 * 1024)); // 1.5MB
    const largeFile = new File([largeFileContent], 'Large.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    const filesToUpload = [validPdf, largeFile];

    const fileInputElement = screen.getByTestId('dropzone-input');

    if (!fileInputElement) throw new Error("Dropzone input element not found. Ensure it has data-testid.");

    await userEvent.upload(fileInputElement, filesToUpload);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Files ready:', [validPdf]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Large.docx - file-too-large - File is larger than 1048576 bytes'));
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).not.toHaveBeenCalledWith('Archivos aceptados:', expect.any(Array));
    });
  });

  test('handles one file rejection', async () => {
    render(<FileUpload />);

    const largeFileContent = new ArrayBuffer(Math.ceil(1.5 * 1024 * 1024)); // 1.5MB
    const largeFile = new File([largeFileContent], 'Large.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    const filesToUpload = [largeFile];

    const fileInputElement = screen.getByTestId('dropzone-input');

    if (!fileInputElement) throw new Error("Dropzone input element not found. Ensure it has data-testid.");

    await userEvent.upload(fileInputElement, filesToUpload);

    await waitFor(() => {
      expect(consoleLogSpy).not.toHaveBeenCalledWith('Archivos listos para subir:');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Large.docx - file-too-large - File is larger than 1048576 bytes'));
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).not.toHaveBeenCalledWith('Archivos aceptados:', expect.any(Array));
    });
  });

});