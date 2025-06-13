import React from 'react';
import { render, screen, act } from '@testing-library/react';
import FileUpload from './FileUpload';
import * as reactDropzone from 'react-dropzone';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

describe('FileUpload component - isDragActive (Module Mock)', () => {
  let mockUseDropzone: jest.SpyInstance;

  beforeEach(() => {
    mockUseDropzone = jest.spyOn(reactDropzone, 'useDropzone').mockReturnValue(
      {
        getRootProps: (): DropzoneRootProps => ({
          role: 'presentation',
          tabIndex: 0,
        }),
        getInputProps: (): DropzoneInputProps => ({
          type: 'file',
          autoComplete: 'off',
          tabIndex: -1,
          style: { display: 'none' },
        }),
        isDragActive: false,
        acceptedFiles: [],
        fileRejections: [],
      } as unknown as ReturnType<typeof reactDropzone.useDropzone>
    );
  });

  afterEach(() => {
    mockUseDropzone.mockRestore();
  });

  test('changes text and background when drag is active and inactive', async () => {
    const { rerender } = render(<FileUpload />);

    let dragInstructionText: HTMLElement | null;
    let dropText: HTMLElement | null;
    let dropzonePaperElement: Element | null;

    dragInstructionText = screen.getByText(/Drag and drop some files here, or click to select files./i);
    dropText = screen.queryByText(/Drop the files here!/i);
    dropzonePaperElement = dragInstructionText.closest('.MuiPaper-root');

    if (!dropzonePaperElement) {
      throw new Error("Elemento Dropzone no encontrado inicialmente.");
    }

    expect(dragInstructionText).toBeInTheDocument();
    expect(dropText).not.toBeInTheDocument();
    expect(dropzonePaperElement).toHaveStyle('background-color: rgb(250, 250, 250)');

    await act(async () => {
      mockUseDropzone.mockReturnValue(
        {
          getRootProps: (): DropzoneRootProps => ({
            role: 'presentation',
            tabIndex: 0,
          }),
          getInputProps: (): DropzoneInputProps => ({
            type: 'file',
            autoComplete: 'off',
            tabIndex: -1,
            style: { display: 'none' },
          }),
          isDragActive: true, // Forzar a true
          acceptedFiles: [],
          fileRejections: [],
        } as unknown as ReturnType<typeof reactDropzone.useDropzone>
      );
      rerender(<FileUpload />);
    });

    dropText = screen.getByText(/Drop the files here!/i);
    dragInstructionText = screen.queryByText(/Drag and drop some files here, or click to select files./i);
    dropzonePaperElement = dropText.closest('.MuiPaper-root');

    if (!dropzonePaperElement) {
        throw new Error("Elemento Dropzone no encontrado después del primer re-render (arrastre activo).");
    }

    expect(dropText).toBeInTheDocument();
    expect(dragInstructionText).not.toBeInTheDocument();
    expect(dropzonePaperElement).toHaveStyle('background-color: rgb(224, 224, 224)');


    await act(async () => {
      mockUseDropzone.mockReturnValue(
        {
          getRootProps: (): DropzoneRootProps => ({
            role: 'presentation',
            tabIndex: 0,
          }),
          getInputProps: (): DropzoneInputProps => ({
            type: 'file',
            autoComplete: 'off',
            tabIndex: -1,
            style: { display: 'none' },
          }),
          isDragActive: false,
          acceptedFiles: [],
          fileRejections: [],
        } as unknown as ReturnType<typeof reactDropzone.useDropzone>
      );
      rerender(<FileUpload />);
    });
    
    dragInstructionText = screen.getByText(/Drag and drop some files here, or click to select files./i);
    dropText = screen.queryByText(/Drop the files here!/i);
    dropzonePaperElement = dragInstructionText.closest('.MuiPaper-root');

    if (!dropzonePaperElement) {
        throw new Error("Elemento Dropzone no encontrado después del segundo re-render (arrastre inactivo).");
    }

    expect(dragInstructionText).toBeInTheDocument();
    expect(dropText).not.toBeInTheDocument();
    expect(dropzonePaperElement).toHaveStyle('background-color: rgb(250, 250, 250)');
  });
});